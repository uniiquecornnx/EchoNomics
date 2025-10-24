'use client';
import { useWallet } from '../src/hooks/useWallet';

export default function WalletStatus() {
  const { isConnected, isConnecting, address, shortAddress, disconnect } = useWallet();

  if (isConnecting) {
    return (
      <div className="flex items-center space-x-2">
        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
        <span className="text-sm text-gray-600">Connecting...</span>
      </div>
    );
  }

  if (!isConnected) {
    return (
      <div className="text-sm text-gray-500">
        Wallet not connected
      </div>
    );
  }

  return (
    <div className="flex items-center space-x-3">
      <div className="flex items-center space-x-2">
        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
        <span className="text-sm text-gray-700">
          Connected: {shortAddress}
        </span>
      </div>
      <button
        onClick={disconnect}
        className="text-xs text-red-600 hover:text-red-800 underline"
      >
        Disconnect
      </button>
    </div>
  );
}
