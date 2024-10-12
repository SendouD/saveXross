// SPDX-License-Identifier: MIT
// Compatible with OpenZeppelin Contracts ^5.0.0
pragma solidity ^0.8.20;
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "./stakecoin.sol";
import "./rewardcoin.sol";
import "hardhat/console.sol";
contract Bluexross is Ownable, AccessControl{
  
    struct Issue{
        address user;
        uint256 Id;
        // Phone number can be a uint256 as it is cheaper than string
        uint256 phoneno;
        string addres;
        bool fakeissue;
        uint256 time;
        uint256 timestamp;
        IssueStatus status;
        RewardStatus rewardstatus;
    }
    // enums for status instead of string in each struct
    enum IssueStatus {
        pending,
        completed,
        fake,
        unattended
    }
    enum RewardStatus {
        pending,
        successfull,
        failed
    }

    Issue[] public issues;

    // status already defined in _issue
    event IssueRose(Issue _issue);
    event newuser(address indexed _user);
    // Added _issue to event to provide more information
    event Status(Issue _issue, IssueStatus status,RewardStatus rewardstatus);
    mapping (string=>uint8) private IssuesToTime;
    mapping (address=>bool) private UserList;
    mapping (address=>uint256[]) private AddressToIds;

    StakeTokens StakeToken;
    RewardTokens RewardToken;
    // Modified to uint8 and made constant
    uint8 private constant STAKEPRICE=5;
    uint8 private constant REWARDPRICE=2;

    bytes32 public constant VERIFIER = keccak256("VERIFIER");


    constructor() Ownable(msg.sender){
           IssuesToTime["rescue"]= 30 seconds;   
           // Accident should have greater priority than injury
           IssuesToTime["accident"] = 2 minutes;
           IssuesToTime["injury"]= 3 minutes;

           IssuesToTime["animalabuse"] = 4 minutes;         
    }

    ///////// Modifiers /////////

    modifier stakecoins(){
        StakeToken.approve(address(this), STAKEPRICE);
        require(StakeToken.transferFrom(msg.sender,address(this), STAKEPRICE),"YOU DON'T HAVE ENOUGH STAKE COINS");
        _;
    }

    modifier onlyVerified(){
        require(hasRole(VERIFIER, msg.sender), "Caller is not a VERIFIER");
        _;
    }
    
    ///////// Private Functions /////////
   
    // Using constants for prices
    function RewardForRescue(address _user) private {
        StakeToken.transfer(_user,STAKEPRICE);
        RewardToken.mint(_user, REWARDPRICE);
    }

    ///////// Owner Functions /////////
    
    function GrantVerifyAccess(address _Verifier) public onlyOwner{
        _grantRole(VERIFIER, _Verifier);
    }
    // Added a function to revoke verify access
    function RevokeVerifyAccess(address _Verifier) public onlyOwner{
        _revokeRole(VERIFIER, _Verifier);
    }
    
    function InitialiseCoins(StakeTokens _stakecoins,RewardTokens _rewardcoins)public onlyOwner{
        StakeToken=_stakecoins;
        RewardToken=_rewardcoins;
    }

    ///////// VERIFIER Functions /////////

    // _fake makes more sense than issueDetail
    function IssueVerify(bool _fake, uint256 id) external onlyVerified {
        require(id <= issues.length, "Invalid issue ID");

        require(issues[id-1].status == IssueStatus.pending, "Issue already verified");
        issues[id-1].fakeissue = _fake;
        if (!_fake) {
            issues[id-1].status = IssueStatus.completed;

            RewardForRescue(issues[id-1].user);
            issues[id-1].rewardstatus=RewardStatus.successfull;
            // Added issues[id-1] to emit to provide more information
            emit Status(issues[id-1],issues[id-1].status,issues[id-1].rewardstatus);
        }
        else{
            issues[id-1].status=IssueStatus.fake;
            issues[id-1].rewardstatus=RewardStatus.failed;
            // Added issues[id-1] to emit to provide more information
            emit Status(issues[id-1],issues[id-1].status,issues[id-1].rewardstatus);

        }
    }

    ///////// User Functions /////////

    function newUser() public {
        require(UserList[msg.sender]==false,"You are already a user");
        UserList[msg.sender]=true;
        // New user provided with 5 tokens as mentioned in docs instead of 10
        StakeToken.mint(msg.sender, STAKEPRICE);
        emit newuser(msg.sender);
    }

    function IssueRescue(string memory rescuetype, uint256 _phoneNo,string memory _address)public stakecoins {
        Issue memory issue = Issue({
            user: msg.sender,
            Id: issues.length+1,
            phoneno: _phoneNo,
            addres: _address,
            fakeissue: false,
            time: IssuesToTime[rescuetype],
            timestamp: block.timestamp,
            status: IssueStatus.pending,
            rewardstatus:RewardStatus.pending
        });
        AddressToIds[msg.sender].push(issues.length+1);

        issues.push(issue);
        // time and status already defined in _issue
        emit IssueRose(issue);
    }

    function CheckAndReward(uint256 id) public {
        require(id <= issues.length, "Invalid issue ID");
        require(issues[id-1].user == msg.sender, "You are not the owner of the issue!");

        if (block.timestamp > issues[id-1].timestamp + issues[id-1].time) {
            issues[id-1].status = IssueStatus.unattended;
            RewardForRescue(issues[id-1].user);
            issues[id-1].rewardstatus=RewardStatus.successfull;
            emit Status(issues[id-1],issues[id-1].status,issues[id-1].rewardstatus);
        }
        else{
            issues[id-1].rewardstatus=RewardStatus.pending;
            revert("Status Pending!");
        }
    }

    ///////// View Functions /////////
    function CheckverifierAccess() public view returns(bool){
       return hasRole(VERIFIER, msg.sender);
    }

    function checkOwner() public view returns(bool){
        return msg.sender==owner();
    }
    
    function getstakebalance() public view returns(uint256) {
        return StakeToken.balanceOf(msg.sender);
    }

    function getrewardbalance() public view returns(uint256) {
        return RewardToken.balanceOf(msg.sender);
    }

    function isAUser() public view returns (bool) {
        return UserList[msg.sender];
    }

    // Removed check for verifier role, blockchain is transparent, better to implement a related check on frontend 
    function getIssues() public view returns(Issue[] memory) {
        return issues;
    }
    
    function getCheckAndReward() public view returns (uint256[] memory) {
        return AddressToIds[msg.sender];
    }
 
}