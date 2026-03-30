import { ethers } from "hardhat";

interface DeployedAddresses {
  complianceOracle: string;
  agentRegistry: string;
  rwaVault: string;
  rwaRouter: string;
}

async function main() {
  console.log("Deploying RWA Agent Contracts to BNB Chain Testnet...\n");

  const [deployer] = await ethers.getSigners();
  console.log(`Deploying contracts with account: ${deployer.address}`);
  console.log(`Account balance: ${ethers.formatEther(await ethers.provider.getBalance(deployer.address))} BNB\n`);

  const deployedAddresses: DeployedAddresses = {
    complianceOracle: "",
    agentRegistry: "",
    rwaVault: "",
    rwaRouter: "",
  };

  // ======== 1. Deploy ComplianceOracle ========
  console.log("1. Deploying ComplianceOracle...");
  const ComplianceOracle = await ethers.getContractFactory("ComplianceOracle");
  const complianceOracle = await ComplianceOracle.deploy();
  await complianceOracle.waitForDeployment();
  deployedAddresses.complianceOracle = await complianceOracle.getAddress();
  console.log(`   ComplianceOracle deployed to: ${deployedAddresses.complianceOracle}\n`);

  // ======== 2. Deploy AgentRegistry ========
  console.log("2. Deploying AgentRegistry...");
  const AgentRegistry = await ethers.getContractFactory("AgentRegistry");
  const agentRegistry = await AgentRegistry.deploy();
  await agentRegistry.waitForDeployment();
  deployedAddresses.agentRegistry = await agentRegistry.getAddress();
  console.log(`   AgentRegistry deployed to: ${deployedAddresses.agentRegistry}\n`);

  // ======== 3. Deploy RWAVault ========
  console.log("3. Deploying RWAVault...");
  const RWAVault = await ethers.getContractFactory("RWAVault");
  const rwaVault = await RWAVault.deploy();
  await rwaVault.waitForDeployment();
  deployedAddresses.rwaVault = await rwaVault.getAddress();
  console.log(`   RWAVault deployed to: ${deployedAddresses.rwaVault}\n`);

  // ======== 4. Deploy RWARouter ========
  console.log("4. Deploying RWARouter...");
  const RWARouter = await ethers.getContractFactory("RWARouter");
  const rwaRouter = await RWARouter.deploy();
  await rwaRouter.waitForDeployment();
  deployedAddresses.rwaRouter = await rwaRouter.getAddress();
  console.log(`   RWARouter deployed to: ${deployedAddresses.rwaRouter}\n`);

  // ======== 5. Configure Contracts ========
  console.log("5. Configuring contracts...\n");

  // Set agent in RWAVault
  console.log("   Setting agent in RWAVault...");
  let tx = await rwaVault.setAgent(deployer.address);
  await tx.wait();
  console.log("   Agent set successfully\n");

  // Set compliance oracle in RWARouter
  console.log("   Setting compliance oracle in RWARouter...");
  tx = await rwaRouter.setComplianceOracle(deployedAddresses.complianceOracle);
  await tx.wait();
  console.log("   Compliance oracle set successfully\n");

  // ======== 6. Setup RWA Token Support ========
  console.log("6. Setting up RWA token support...\n");

  // Example token addresses (BSC testnet)
  const tokens: { [key: string]: { address: string; priceFeed: string } } = {
    USDY: {
      address: "0x0000000000000000000000000000000000000001", // Placeholder
      priceFeed: "0x0000000000000000000000000000000000000002", // Placeholder
    },
    BUIDL: {
      address: "0x0000000000000000000000000000000000000003", // Placeholder
      priceFeed: "0x0000000000000000000000000000000000000004", // Placeholder
    },
    PAXG: {
      address: "0x0000000000000000000000000000000000000005", // Placeholder
      priceFeed: "0x0000000000000000000000000000000000000006", // Placeholder
    },
    slisBNB: {
      address: "0x0000000000000000000000000000000000000007", // Placeholder
      priceFeed: "0x0000000000000000000000000000000000000008", // Placeholder
    },
    lisUSD: {
      address: "0x0000000000000000000000000000000000000009", // Placeholder
      priceFeed: "0x000000000000000000000000000000000000000a", // Placeholder
    },
    ankrBNB: {
      address: "0x000000000000000000000000000000000000000b", // Placeholder
      priceFeed: "0x000000000000000000000000000000000000000c", // Placeholder
    },
  };

  console.log("   Adding supported RWA tokens:");
  for (const [name, config] of Object.entries(tokens)) {
    console.log(`     - ${name}`);
    // In production, use real token and price feed addresses
    // tx = await rwaVault.addSupportedToken(config.address, config.priceFeed);
    // await tx.wait();
  }
  console.log("   Note: Use real token addresses in production\n");

  // ======== 7. Setup Compliance ========
  console.log("7. Setting up compliance...\n");

  console.log("   Whitelisting deployer account...");
  tx = await complianceOracle.whitelist(deployer.address);
  await tx.wait();
  console.log(`   Deployer whitelisted\n`);

  // ======== 8. Summary ========
  console.log("========================================");
  console.log("Deployment Complete!");
  console.log("========================================\n");

  console.log("Deployed Contract Addresses:");
  console.log(`ComplianceOracle: ${deployedAddresses.complianceOracle}`);
  console.log(`AgentRegistry:    ${deployedAddresses.agentRegistry}`);
  console.log(`RWAVault:         ${deployedAddresses.rwaVault}`);
  console.log(`RWARouter:        ${deployedAddresses.rwaRouter}\n`);

  console.log("Next Steps:");
  console.log("1. Update token addresses in RWAVault with real token contracts");
  console.log("2. Configure Chainlink price feeds for each RWA token");
  console.log("3. Register agents in AgentRegistry with stakes");
  console.log("4. Update compliance KYC statuses as needed");
  console.log("5. Configure custom swap routes in RWARouter");
  console.log("6. Test deposit/withdrawal flows");

  // ======== 9. Save deployment info ========
  const fs = require("fs");
  const deploymentInfo = {
    network: "bsc-testnet",
    timestamp: new Date().toISOString(),
    deployer: deployer.address,
    contracts: deployedAddresses,
  };

  fs.writeFileSync(
    "deployment.json",
    JSON.stringify(deploymentInfo, null, 2)
  );
  console.log("\nDeployment info saved to deployment.json");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
