import { execSync } from "child_process";
import * as readline from "readline";
import * as fs from "fs";
import * as path from "path";
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Create readline interface
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Helper function to get user input
function askQuestion(question: string): Promise<string> {
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      resolve(answer);
    });
  });
}

// Generate symbol from name
function generateSymbol(name: string): string {
  return name.substring(0, Math.min(4, name.length)).toUpperCase();
}

async function main() {
  console.log("\n🚀 Custom Token Deployment on LOCAL Hardhat Network");
  console.log("=" .repeat(60));
  
  // Get token name
  const userInput = await askQuestion(
    "\n📝 Enter your token name (e.g., Orange, Banana, MyProject): "
  );
  
  if (!userInput.trim()) {
    console.log("❌ Token name cannot be empty!");
    rl.close();
    process.exit(1);
  }
  
  const tokenName = userInput.trim();
  
  // Get token symbol
  const symbolInput = await askQuestion(
    `🔤 Enter token symbol (e.g., ORAN, BANA) or press Enter for auto-generated: `
  );
  
  const tokenSymbol = symbolInput.trim() 
    ? symbolInput.trim().toUpperCase() 
    : generateSymbol(tokenName);
  
  // Get initial supply
  const supplyInput = await askQuestion(
    `💰 Enter initial supply (press Enter for 1,000,000): `
  );
  
  const initialSupply = supplyInput.trim() 
    ? parseInt(supplyInput) 
    : 1000000;
  
  if (isNaN(initialSupply) || initialSupply <= 0) {
    console.log("❌ Invalid supply amount!");
    rl.close();
    process.exit(1);
  }
  
  console.log("\n📊 Token Configuration:");
  console.log("=" .repeat(60));
  console.log(`🏷️  Token Name: "${tokenName}"`);
  console.log(`🪙 Full Name: ${tokenName} Token`);
  console.log(`🔤 Symbol: ${tokenSymbol}`);
  console.log(`💵 Initial Supply: ${initialSupply.toLocaleString()} ${tokenSymbol}`);
  console.log("=" .repeat(60));
  
  // Ask if user wants to deploy a new token
  const deployChoice = await askQuestion(
    "\n🔄 Do you want to deploy this token on LOCAL Hardhat? (y/n): "
  );
  
  // NOW close the readline interface after all questions
  rl.close();
  
  const deployNew = deployChoice.trim().toLowerCase() === 'y' || deployChoice.trim().toLowerCase() === 'yes';
  
  if (!deployNew) {
    console.log("\n✅ Deployment cancelled.");
    process.exit(0);
  }
  
  // Clear previous LOCAL deployment to force a new one
  const deploymentsDir = path.join(__dirname, "..", "ignition", "deployments", "chain-31337");
  if (fs.existsSync(deploymentsDir)) {
    console.log("\n🗑️  Clearing previous LOCAL deployment cache...");
    fs.rmSync(deploymentsDir, { recursive: true, force: true });
  }
  
  // Create parameters file for Ignition
  const parametersDir = path.join(__dirname, "..", "ignition", "parameters");
  const parametersFile = path.join(parametersDir, "local.json");
  
  // Ensure directory exists
  if (!fs.existsSync(parametersDir)) {
    fs.mkdirSync(parametersDir, { recursive: true });
  }
  
  // Write parameters
  const parameters = {
    "CustomTokenModule": {
      "tokenName": tokenName,
      "tokenSymbol": tokenSymbol,
      "initialSupply": initialSupply
    }
  };
  
  fs.writeFileSync(parametersFile, JSON.stringify(parameters, null, 2));
  console.log("\n✓ Parameters saved for Ignition deployment");
  
  // Deploy using Hardhat Ignition on LOCAL network
  console.log("\n🔨 Deploying with Hardhat Ignition on LOCAL network...");
  console.log(`📤 Passing "${tokenName}" to smart contract...\n`);
  
  try {
    execSync(
      `npx hardhat ignition deploy ignition/modules/Token.ts --parameters ${parametersFile}`,
      { 
        encoding: 'utf-8',
        stdio: 'inherit'
      }
    );
    
    console.log("\n🎉 Deployment complete on LOCAL Hardhat Network!");
    console.log(`Your "${tokenName}" token is deployed locally!`);
    console.log("\n📁 Check ignition/deployments/chain-31337/deployed_addresses.json for the contract address.");
    console.log("\n⚠️  Note: This deployment is temporary and will be lost when you stop Hardhat.");
    
  } catch (error) {
    console.error("\n❌ Deployment failed:");
    console.error(error);
    process.exit(1);
  }
}

main();