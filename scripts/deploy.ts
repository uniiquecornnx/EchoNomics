import { execSync } from "child_process";
import * as readline from "readline";
import * as fs from "fs";
import * as path from "path";

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
  console.log("\n🚀 Custom Token Deployment on Base Sepolia");
  console.log("=" .repeat(60));
  
  // Get user input
  const userInput = await askQuestion(
    "\n📝 Enter your token name (e.g., orange, banana, myproject): "
  );
  
  if (!userInput.trim()) {
    console.log("❌ Token name cannot be empty!");
    rl.close();
    process.exit(1);
  }
  
  const tokenName = userInput.trim();
  const tokenSymbol = generateSymbol(tokenName);
  
  // Ask for supply
  const supplyInput = await askQuestion(
    `💰 Enter initial supply (press Enter for 1,000,000): `
  );
  
  rl.close();
  
  const initialSupply = supplyInput.trim() 
    ? parseInt(supplyInput) 
    : 1000000;
  
  if (isNaN(initialSupply) || initialSupply <= 0) {
    console.log("❌ Invalid supply amount!");
    process.exit(1);
  }
  
  console.log("\n📊 Token Configuration:");
  console.log("=" .repeat(60));
  console.log(`🏷️  User Input: "${tokenName}"`);
  console.log(`🪙 Token Name: ${tokenName} Token`);
  console.log(`🔤 Symbol: ${tokenSymbol}`);
  console.log(`💵 Initial Supply: ${initialSupply.toLocaleString()} ${tokenSymbol}`);
  console.log("=" .repeat(60));
  
  // Create parameters file for Ignition
  const parametersDir = path.join(__dirname, "..", "ignition", "parameters");
  const parametersFile = path.join(parametersDir, "baseSepolia.json");
  
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
  
  // Deploy using Hardhat Ignition
  console.log("\n🔨 Deploying with Hardhat Ignition...");
  console.log(`📤 Passing "${tokenName}" to smart contract...\n`);
  
  try {
    const result = execSync(
      `npx hardhat ignition deploy ignition/modules/Token.ts --network baseSepolia --parameters ${parametersFile}`,
      { 
        encoding: 'utf-8',
        stdio: 'inherit'
      }
    );
    
    console.log("\n🎉 Deployment complete!");
    console.log(`Your "${tokenName}" token is now live on Base Sepolia!`);
    console.log("\nCheck the ignition/deployments folder for contract addresses.");
    
  } catch (error) {
    console.error("\n❌ Deployment failed:");
    console.error(error);
    process.exit(1);
  }
}

main();