const hre = require("hardhat");

async function main() {
  const [deployer] = await ethers.getSigners();

  // Set the deployer's address as the owner address
  const ownerAddress = deployer.address;
  console.log(ownerAddress);
  // Set the goal for the contract
  const goal = ethers.utils.parseEther("0.004");
  const Assessment = await hre.ethers.getContractFactory("Lock");
  const assessment = await Assessment.deploy(ownerAddress, goal, {
    gasLimit: 1000000, // Adjust gas limit as needed
  });

  console.log(`A contract deployed to ${assessment.address}`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
