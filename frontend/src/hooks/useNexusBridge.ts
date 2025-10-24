'use client';
import { useState, useEffect, useCallback } from 'react';
import { useAccount } from 'wagmi';
import { nexusBridge, startTipRelay, sendCrossChainTip, getBridgeStatus } from '../../lib/nexus';

interface TipData {
  from: string;
  to: string;
  amount: string;
  message: string;
  timestamp: string;
  originalTxHash: string;
}

interface BridgeStatus {
  isConnected: boolean;
  baseSepoliaStatus: 'connected' | 'disconnected' | 'error';
  availStatus: 'connected' | 'disconnected' | 'error';
  lastRelayTime?: string;
}

export function useNexusBridge() {
  const { address } = useAccount();
  const [bridgeStatus, setBridgeStatus] = useState<BridgeStatus | null>(null);
  const [isRelayActive, setIsRelayActive] = useState(false);
  const [recentTips, setRecentTips] = useState<TipData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Initialize bridge and start tip relay
  const initializeBridge = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Start the tip relay
      await startTipRelay();
      setIsRelayActive(true);

      // Get initial bridge status
      const status = await getBridgeStatus();
      setBridgeStatus(status);

      console.log('Nexus bridge initialized successfully');
    } catch (err) {
      console.error('Failed to initialize bridge:', err);
      setError(err instanceof Error ? err.message : 'Failed to initialize bridge');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Send cross-chain tip
  const sendTip = useCallback(async (
    to: string,
    message: string,
    amount: string
  ) => {
    if (!address) {
      throw new Error('No wallet connected');
    }

    try {
      setIsLoading(true);
      setError(null);

      // Use the Nexus bridge to send cross-chain tip
      const result = await sendCrossChainTip(to, message, amount);
      
      // Add to recent tips
      const tipData: TipData = {
        from: address,
        to,
        amount,
        message,
        timestamp: new Date().toISOString(),
        originalTxHash: result.txHash,
      };
      
      setRecentTips(prev => [tipData, ...prev.slice(0, 9)]); // Keep last 10 tips
      
      return result;
    } catch (err) {
      console.error('Failed to send tip:', err);
      setError(err instanceof Error ? err.message : 'Failed to send tip');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [address]);

  // Get bridge status
  const refreshStatus = useCallback(async () => {
    try {
      const status = await getBridgeStatus();
      setBridgeStatus(status);
    } catch (err) {
      console.error('Failed to get bridge status:', err);
    }
  }, []);

  // Initialize bridge on mount
  useEffect(() => {
    initializeBridge();
  }, [initializeBridge]);

  // Refresh status periodically
  useEffect(() => {
    const interval = setInterval(refreshStatus, 30000); // Every 30 seconds
    return () => clearInterval(interval);
  }, [refreshStatus]);

  return {
    // State
    bridgeStatus,
    isRelayActive,
    recentTips,
    isLoading,
    error,
    
    // Actions
    sendTip,
    refreshStatus,
    initializeBridge,
    
    // Utilities
    isConnected: bridgeStatus?.isConnected || false,
    canSendTips: !!address && isRelayActive,
  };
}
