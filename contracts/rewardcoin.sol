// SPDX-License-Identifier: MIT
// Compatible with OpenZeppelin Contracts ^5.0.0
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";

contract RewardTokens is ERC20, Ownable,AccessControl {
    constructor()
        ERC20("RewardTokens", "RTK")
        Ownable(msg.sender)
    {}
       bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");
        function GrantMinterAccess(address minter) public onlyOwner{
        
         _grantRole(MINTER_ROLE, minter);
    }
    function mint(address to, uint256 amount) public  {
         require(hasRole(MINTER_ROLE, msg.sender), "Caller is not a minter");
        _mint(to, amount);
    }
}