// TipJar Contract Configuration
export const TIP_JAR_CONTRACT = {
  address: '0x...', // Replace with your deployed TipJar contract address
  abi: [
    {
      "inputs": [
        {
          "internalType": "address payable",
          "name": "streamer",
          "type": "address"
        },
        {
          "internalType": "string",
          "name": "message",
          "type": "string"
        }
      ],
      "name": "sendTip",
      "outputs": [],
      "stateMutability": "payable",
      "type": "function"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "from",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "to",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "amount",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "string",
          "name": "message",
          "type": "string"
        }
      ],
      "name": "TipSent",
      "type": "event"
    }
  ] as const,
} as const;

// Contract addresses for different networks
export const TIP_JAR_ADDRESSES = {
  baseSepolia: '0x...', // Replace with your Base Sepolia deployment
  sepolia: '0x...', // Replace with your Sepolia deployment
  localhost: '0x...', // Replace with your local deployment
} as const;
