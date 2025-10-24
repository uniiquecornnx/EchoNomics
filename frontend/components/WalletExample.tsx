'use client';
import { useWallet, useWalletAddress, useWalletConnection } from '../src/hooks/useWallet';
import ConnectWallet from './ConnectWallet';
import WalletStatus from './WalletStatus';

export default function WalletExample() {
  // Different ways to access wallet state
  const wallet = useWallet();
  const address = useWalletAddress();
  const { isConnected, isConnecting } = useWalletConnection();

  return (
    <div className="p-6 bg-gray-100 rounded-lg">
      <h2 className="text-xl font-bold mb-4">Wallet Integration Example</h2>
      
      {/* Connect/Disconnect Button */}
      <div className="mb-4">
        <ConnectWallet />
      </div>

      {/* Wallet Status */}
      <div className="mb-4">
        <WalletStatus />
      </div>

      {/* Detailed Wallet Info */}
      <div className="bg-white p-4 rounded border">
        <h3 className="font-semibold mb-2">Wallet State:</h3>
        <ul className="text-sm space-y-1">
          <li><strong>Connected:</strong> {isConnected ? 'Yes' : 'No'}</li>
          <li><strong>Connecting:</strong> {isConnecting ? 'Yes' : 'No'}</li>
          <li><strong>Address:</strong> {address || 'Not connected'}</li>
          <li><strong>Short Address:</strong> {wallet.shortAddress || 'Not connected'}</li>
        </ul>
      </div>

      {/* Example of conditional rendering based on wallet state */}
      {isConnected && (
        <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded">
          <p className="text-green-800">
            ✅ Wallet is connected! You can now interact with smart contracts.
          </p>
        </div>
      )}

      {!isConnected && (
        <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded">
          <p className="text-yellow-800">
            ⚠️ Please connect your wallet to access Web3 features.
          </p>
        </div>
      )}
    </div>
  );
}
