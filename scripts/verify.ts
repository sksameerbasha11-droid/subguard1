import { run } from "hardhat";
import * as fs from "fs";
import * as path from "path";

async function main() {
  const deploymentPath = path.join(__dirname, "../deployments/mst-testnet.json");
  if (!fs.existsSync(deploymentPath)) {
    console.error("No deployment found at deployments/mst-testnet.json");
    process.exit(1);
  }

  const deployment = JSON.parse(fs.readFileSync(deploymentPath, "utf-8"));
  console.log(`Verifying SubGuard contract at ${deployment.contractAddress} on MST Testnet...`);

  try {
    await run("verify:verify", {
      address: deployment.contractAddress,
      constructorArguments: [],
    });
    console.log("Contract verified successfully!");
  } catch (err: any) {
    console.log("Verification output:", err.message);
  }
}

main().catch((error) => {
  console.error("Verification script error:", error);
  process.exitCode = 1;
});
