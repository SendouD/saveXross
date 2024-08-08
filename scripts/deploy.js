const { ethers } = require("hardhat");

async function main() {
    const [deployer] = await ethers.getSigners();

    console.log(
    "Deploying contracts with the account:",
    deployer.address
    );

    const Bluexross = await ethers.getContractFactory("Bluexross");
    const Stakecoin = await ethers.getContractFactory("stakecoin");
    const Rewardcoin = await ethers.getContractFactory("rewardcoin");
    const blueContract = await Bluexross.deploy();
    const stakeContract = await Bluexross.deploy();
    const rewardContract = await Bluexross.deploy();

    await stakeContract.deployed();
    await rewardContract.deployed();
    await blueContract.deployed();

    await blueContract.InitialiseCoins(stakeContract.address,rewardContract.address)
    await stakeContract.GrantMinterAccess(blueContract.address)
    await rewardContract.GrantMinterAccess(blueContract.address)

}

main() 
    .catch((error) => {
        console.error(error);
        process.exitCode = 1;
    })