import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";
import * as readline from "readline";

// Helper function to get user input
function askQuestion(question: string): Promise<string> {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });
  
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      rl.close();
      resolve(answer);
    });
  });
}

// Generate symbol from name
function generateSymbol(name: string): string {
  return name.substring(0, Math.min(4, name.length)).toUpperCase();
}

// This is the new Hardhat 3 Ignition Module
export default buildModule("CustomTokenModule", (m) => {
  // Get parameters with defaults
  const tokenName = m.getParameter("tokenName", "MyToken");
  const tokenSymbol = m.getParameter("tokenSymbol", "MTK");
  const initialSupply = m.getParameter("initialSupply", 1000000);

  console.log(`\n📊 Deploying with:`);
  console.log(`   Name: ${tokenName} Token`);
  console.log(`   Symbol: ${tokenSymbol}`);
  console.log(`   Supply: ${initialSupply}\n`);

  // Deploy the token
  const token = m.contract("CustomToken", [tokenName, tokenSymbol, initialSupply]);

  return { token };
});