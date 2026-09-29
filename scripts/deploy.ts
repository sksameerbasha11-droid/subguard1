import hre from "hardhat";
import * as fs from "fs";
import * as path from "path";

const { ethers } = hre;

async function main() {
  console.log("--------------------------------------------------");
  console.log("SubGuard: Deploying Smart Contract to MST Testnet");
  console.log("--------------------------------------------------");

  const [deployer] = await ethers.getSigners();
  if (deployer) {
    console.log("Deployer Address:", deployer.address);
  }

  const SubGuardFactory = await ethers.getContractFactory("SubGuard");
  const subGuard = await SubGuardFactory.deploy();
  await subGuard.waitForDeployment();

  const contractAddress = await subGuard.getAddress();
  console.log("SubGuard Contract successfully deployed to:", contractAddress);

  const deploymentData = {
    network: "MST Testnet",
    chainId: 8277,
    contractAddress,
    deployer: deployer ? deployer.address : "Unknown",
    timestamp: new Date().toISOString(),
  };

  const deploymentsDir = path.join(__dirname, "../deployments");
  if (!fs.existsSync(deploymentsDir)) {
    fs.mkdirSync(deploymentsDir, { recursive: true });
  }

  fs.writeFileSync(
    path.join(deploymentsDir, "mst-testnet.json"),
    JSON.stringify(deploymentData, null, 2)
  );

  console.log("Saved deployment metadata to deployments/mst-testnet.json");
}

main().catch((error) => {
  console.error("Deployment failed:", error);
  process.exitCode = 1;
});
