// SPDX-License-Identifier: MIT
// Compatible with OpenZeppelin Contracts ^5.0.0
pragma solidity ^0.8.20;
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "./RewardTokens.sol";
import "./StakeTokens.sol";
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
    Issue[] issues;
    event IssueRised(Issue _issue,uint256 Time,string status);
    event newuser(address indexed _user);
    event Status(string status,string Rewardstatus);
    mapping (string=>uint8) private IssuestoTime;
    mapping (address=>bool) private UserList;
   
    

   
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
    function newUser(address _user)public{
        require(UserList[_user]==false,"You are already a user ;[[");
        UserList[_user]=true;
        StakeToken.mint(_user, 5);
        emit newuser(_user);
    }
    function getbalance(address _user)public view returns(uint256) {
        return StakeToken.balanceOf(_user);
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
        Issue memory issue = Issue({
            user: msg.sender,
            Id: issues.length+1,
            phoneno: phoneNo,
            address: addres,
            fakeissue: false,
            time: time,
            timestamp: block.timestamp,
            status: "pending",
            rewardstatus:"pending"
        });
        issues.push(issue);
        console.log(issues.length);
        
         
        emit IssueRised(issue,time,"pending");
    }
    function IssueVerify(bool issueDetail, uint256 id) external {
        require(hasRole(VERIFIER, msg.sender), "Caller is not a VERIFIER");
        require(id <= issues.length, "Invalid issue ID");

        Issue storage issue = issues[id-1];
        require(keccak256(bytes(issue.status)) == keccak256(bytes("pending")), "Issue already verified");

        issue.fakeissue = issueDetail;
        if (!issueDetail) {
            issue.status = "completed";

            RewardForRescue(issue.user);
            issue.rewardstatus="Reward successfull";
            emit Status(issue.status,issue.rewardstatus);
        }
        else{
            issue.status="fake issue";
             issue.rewardstatus="stake coin is gone :]] ";

            emit Status(issue.status,issue.rewardstatus);

        }
    }
   
    function RewardForRescue(address _user)private {
        StakeToken.transfer(_user,5);
        RewardToken.mint(_user, 2);
    }

    function CheckAndReward(uint256 id) public {
        require(id <= issues.length, "Invalid issue ID");

        Issue storage issue = issues[id-1];
        
       

        if (block.timestamp > issue.timestamp + issue.time) {
            issue.status = "unattended";
            RewardForRescue(issue.user);
             issue.rewardstatus="Reward successfull";
            emit Status(issue.status,issue.rewardstatus);
        }
        else{
              issue.rewardstatus="Ruko Jaara Sabar Karo ;]]";
            emit Status(issue.status,issue.rewardstatus);
        }
    }


 
}