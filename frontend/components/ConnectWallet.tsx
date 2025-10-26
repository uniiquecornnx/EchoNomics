'use client';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useWallet } from '../src/hooks/useWallet';
import { useEffect, useState } from 'react';

export default function ConnectWallet() {
  const { isConnected, shortAddress } = useWallet();
  const [mounted, setMounted] = useState(false);

  // Prevent hydration mismatch by only rendering wallet state on client
  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="flex items-center space-x-2">
      <ConnectButton showBalance={false} chainStatus="none" />
      {mounted && isConnected && shortAddress && (
        <span className="text-sm text-green-400 bitcount-normal">
          Connected: {shortAddress}
        </span>
      )}
    </div>
  );
}
