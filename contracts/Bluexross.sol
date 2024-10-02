// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "./stakecoin.sol";
import "./rewardcoin.sol";
import "hardhat/console.sol";

contract Bluexross is Ownable, AccessControl {
    
    constructor() Ownable(msg.sender) {
        IssuestoTime[RescueType.RESCUE] = 30 seconds;
        IssuestoTime[RescueType.INJURY] = 2 minutes;
        IssuestoTime[RescueType.ACCIDENT] = 3 minutes;
        IssuestoTime[RescueType.ANIMAL_ABUSE] = 4 minutes;
    }

    bytes32 public constant VERIFIER = keccak256("VERIFIER");

    enum Status { PENDING, COMPLETED, FAKE, UNATTENDED }
    enum RewardStatus { PENDING, SUCCESSFUL, STAKE_LOST }
    enum RescueType { RESCUE, INJURY, ACCIDENT, ANIMAL_ABUSE }

    struct Issue {
        address user;
        uint256 id;
        string phoneno;
        string addres;
        bool fakeIssue;
        uint256 time;
        uint256 timestamp;
        Status status;
        RewardStatus rewardStatus;
    }

    Issue[] public issues;

    event IssueRised(Issue _issue, uint256 Time, Status status);
    event NewUser(address indexed _user);
    event StatusUpdated(Status status, RewardStatus rewardStatus);

    mapping(RescueType => uint256) private IssuestoTime;
    mapping(address => bool) private userList;
    mapping(address => uint256[]) private addressToIds;

    StakeTokens public stakeToken;
    RewardTokens public rewardToken;

    uint256 private constant stakePrice = 5;

    modifier stakeCoins() {
        console.log(msg.sender);
        console.log(address(this));
        stakeToken.approve(address(this), stakePrice);
        require(stakeToken.transferFrom(msg.sender, address(this), stakePrice), "YOU DON'T HAVE ENOUGH STAKE COINS");
        _;
    }

    function checkVerifierAccess() public view returns (bool) {
        return hasRole(VERIFIER, msg.sender);
    }

    function checkOwner() public view returns (bool) {
        return msg.sender == owner();
    }

    function newUser() public {
        require(!userList[msg.sender], "You are already a user ;[[");
        userList[msg.sender] = true;
        stakeToken.mint(msg.sender, 10);
        emit NewUser(msg.sender);
    }

    function getStakeBalance() public view returns (uint256) {
        return stakeToken.balanceOf(msg.sender);
    }

    function getRewardBalance() public view returns (uint256) {
        return rewardToken.balanceOf(msg.sender);
    }

    function grantVerifierAccess(address verifier) public onlyOwner {
        _grantRole(VERIFIER, verifier);
    }

    function initializeCoins(StakeTokens _stakeTokens, RewardTokens _rewardTokens) public onlyOwner {
        stakeToken = _stakeTokens;
        rewardToken = _rewardTokens;
    }

    function issueRescue(RescueType rescueType, string memory phoneNo, string memory addres) public stakeCoins {
        uint256 time = IssuestoTime[rescueType];
        Issue memory issue = Issue({
            user: msg.sender,
            id: issues.length + 1,
            phoneno: phoneNo,
            addres: addres,
            fakeIssue: false,
            time: time,
            timestamp: block.timestamp,
            status: Status.PENDING,
            rewardStatus: RewardStatus.PENDING
        });

        addressToIds[msg.sender].push(issues.length + 1);
        issues.push(issue);

        emit IssueRised(issue, time, Status.PENDING);
    }

    function isNewUser() public view returns (bool) {
        return userList[msg.sender];
    }

    function issueVerify(bool issueDetail, uint256 id) external {
        require(hasRole(VERIFIER, msg.sender), "Caller is not a VERIFIER");
        require(id <= issues.length, "Invalid issue ID");

        Issue storage issue = issues[id - 1];
        require(issue.status == Status.PENDING, "Issue already verified");

        issue.fakeIssue = issueDetail;
        if (!issueDetail) {
            issue.status = Status.COMPLETED;
            rewardForRescue(issue.user);
            issue.rewardStatus = RewardStatus.SUCCESSFUL;
        } else {
            issue.status = Status.FAKE;
            issue.rewardStatus = RewardStatus.STAKE_LOST;
        }

        emit StatusUpdated(issue.status, issue.rewardStatus);
    }

    function getIssues() public view returns (Issue[] memory) {
        require(hasRole(VERIFIER, msg.sender), "Caller is not a VERIFIER");
        return issues;
    }

    function rewardForRescue(address user) private {
        stakeToken.transfer(user, 5);
        rewardToken.mint(user, 2);
    }

    function getCheckAndReward() public view returns (uint256[] memory) {
        return addressToIds[msg.sender];
    }

    function checkAndReward(uint256 id) public {
        require(id <= issues.length, "Invalid issue ID");

        Issue storage issue = issues[id - 1];
        require(issue.user == msg.sender, "You are not the owner of the issue!");

        if (block.timestamp > issue.timestamp + issue.time) {
            issue.status = Status.UNATTENDED;
            rewardForRescue(issue.user);
            issue.rewardStatus = RewardStatus.SUCCESSFUL;
            emit StatusUpdated(issue.status, issue.rewardStatus);
        } else {
            issue.rewardStatus = RewardStatus.PENDING;
            revert("Status Pending!");
        }
    }
}
