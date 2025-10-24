'use client';
import { useWallet as useWalletContext } from '../contexts/WalletContext';

export function useWallet() {
  return useWalletContext();
}

// Additional utility hooks for common wallet operations
export function useWalletAddress() {
  const { address } = useWallet();
  return address;
}

export function useWalletConnection() {
  const { isConnected, isConnecting } = useWallet();
  return { isConnected, isConnecting };
}

export function useWalletActions() {
  const { disconnect } = useWallet();
  return { disconnect };
}
