const hre = require("hardhat");

async function main() {
  // Compile contracts (skipped if already compiled)
  await hre.run("compile");

  const Factory = await hre.ethers.getContractFactory("PolyHopCharacter");
  const contract = await Factory.deploy();

  await contract.waitForDeployment();

  console.log("PolyHopCharacter deployed to:", await contract.getAddress());
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
}); 