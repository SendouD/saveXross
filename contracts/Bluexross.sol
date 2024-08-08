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
    
    constructor() Ownable(msg.sender){
           IssuestoTime["rescue"]=1 minutes;   
           IssuestoTime["injury"]=2 minutes;
           IssuestoTime["accident"]=3 minutes;
           IssuestoTime["animalabuse"]=4 minutes;         
    }
    
    bytes32 public constant VERIFIER = keccak256("VERIFIER");

    struct Issue{
        address user;
        uint256 Id;
        string phoneno;
        string addres;
        bool fakeissue;
        uint256 time;
        uint256 timestamp;
        string status;
        string rewardstatus;
    }
    Issue[] public issues;

    event IssueRised(Issue _issue,uint256 Time,string status);
    event newuser(address indexed _user);
    event Status(string status,string Rewardstatus);
    mapping (string=>uint8) private IssuestoTime;
    mapping (address=>bool) private UserList;
    mapping (address=>uint256[]) private AddresstoIds;
   
    StakeTokens StakeToken;
    RewardTokens RewardToken;
    uint256 private stakeprice=5;


    modifier stakecoins(){
        console.log(msg.sender);
        console.log(address(this));
        StakeToken.approve(address(this), 5);
        require(StakeToken.transferFrom(msg.sender,address(this), stakeprice),"YOU DON'T HAVE ENOUGH STAKE COINS");
        _;

    }
    function newUser()public{
        require(UserList[msg.sender]==false,"You are already a user ;[[");
        UserList[msg.sender]=true;
        StakeToken.mint(msg.sender, 5);
        emit newuser(msg.sender);
    }
    function getstakebalance()public view returns(uint256) {
        console.log(msg.sender);
        return StakeToken.balanceOf(msg.sender);
    }
      function getrewardbalance()public view returns(uint256) {
        return RewardToken.balanceOf(msg.sender);
    }
    
    function GrantVerifyAccess(address _Verifier) public onlyOwner{
        _grantRole(VERIFIER, _Verifier);
    }
    function InitialiseCoins(StakeTokens _stakecoins,RewardTokens _rewardcoins)public onlyOwner{
        StakeToken=_stakecoins;
        RewardToken=_rewardcoins;
    }
    function IssueRescue(string memory rescuetype,string memory phoneNo,string memory addres)public stakecoins {
       
        uint256 time=IssuestoTime[rescuetype];
        console.log(issues.length);
        Issue memory issue = Issue({
            user: msg.sender,
            Id: issues.length+1,
            phoneno: phoneNo,
            addres: addres,
            fakeissue: false,
            time: time,
            timestamp: block.timestamp,
            status: "pending",
            rewardstatus:"pending"
        });
        AddresstoIds[msg.sender].push(issues.length+1);

        issues.push(issue);
         
        emit IssueRised(issue,time,"pending");
    }
    
    function IssueVerify(bool issueDetail, uint256 id) external {
        require(hasRole(VERIFIER, msg.sender), "Caller is not a VERIFIER");
        require(id <= issues.length, "Invalid issue ID");

        require(keccak256(bytes(issues[id-1].status)) == keccak256(bytes("pending")), "Issue already verified");

        issues[id-1].fakeissue = issueDetail;
        if (!issueDetail) {
            issues[id-1].status = "completed";

            RewardForRescue(issues[id-1].user);
            issues[id-1].rewardstatus="Reward successfull";
            emit Status(issues[id-1].status,issues[id-1].rewardstatus);
        }
        else{
            issues[id-1].status="fake issue";
            issues[id-1].rewardstatus="stake coin is gone :]] ";

            emit Status(issues[id-1].status,issues[id-1].rewardstatus);

        }
    }

    function getIssues() public view returns(Issue[] memory) {
        require(hasRole(VERIFIER, msg.sender), "Caller is not a VERIFIER");
        return issues;
    }
   
    function RewardForRescue(address _user)private {
        StakeToken.transfer(_user,5);
        RewardToken.mint(_user, 2);
    }

    function getCheckAndReward() public view returns (uint256[] memory) {
        return AddresstoIds[msg.sender];
    }

    function CheckAndReward(uint256 id) public {
        require(id <= issues.length, "Invalid issue ID");

        require(issues[id-1].user == msg.sender, "You are not the owner of the issue!");

        if (block.timestamp > issues[id-1].timestamp + issues[id-1].time) {
            console.log("HITTTT");
            issues[id-1].status = "unattended";
            RewardForRescue(issues[id-1].user);
            issues[id-1].rewardstatus="Reward successfull";
            emit Status(issues[id-1].status,issues[id-1].rewardstatus);
        }
        else{
            issues[id-1].rewardstatus="pending";
            emit Status(issues[id-1].status,issues[id-1].rewardstatus);
        }
    }


 
}