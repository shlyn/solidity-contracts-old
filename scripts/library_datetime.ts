import { ethers } from "hardhat";

async function main() {
  const Contract = await ethers.getContractFactory("DateTime");
  const contract = await Contract.deploy();

  await contract.deployed();
  console.log(`The contract deployed to ${contract.address}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});