const { ethers } = require("hardhat");

async function main() {
    const [deployer] = await ethers.getSigners();

    console.log(
    "Deploying contracts with the account:",
    deployer.address
    );

    const Bluexross = await ethers.getContractFactory("Bluexross");
    const Stakecoin = await ethers.getContractFactory("StakeTokens");
    const Rewardcoin = await ethers.getContractFactory("RewardTokens");
    const blueContract = await Bluexross.deploy();
    const stakeContract = await Stakecoin.deploy();
    const rewardContract = await Rewardcoin.deploy();

    await stakeContract.deployed();
    await rewardContract.deployed();
    await blueContract.deployed();

    await blueContract.InitialiseCoins(stakeContract.address,rewardContract.address)
    await stakeContract.GrantMinterAccess(blueContract.address)
    await rewardContract.GrantMinterAccess(blueContract.address)

    console.log("Bluexross-contract-address: " + blueContract.address)
    console.log("stake-contract-address: " + stakeContract.address)
    console.log("reward-contract-address: " + rewardContract.address)
}

main() 
    .catch((error) => {
        console.error(error);
        process.exitCode = 1;
    })