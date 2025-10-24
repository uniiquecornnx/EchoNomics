'use client';
import React, { useState } from 'react';
import { useNexusBridge } from '../src/hooks/useNexusBridge';
import { useTipJar } from '../src/hooks/useTipJar';

interface CrossChainTipProps {
  streamerAddress: string;
  streamerName: string;
  className?: string;
}

export default function CrossChainTip({ 
  streamerAddress, 
  streamerName, 
  className = '' 
}: CrossChainTipProps) {
  const {
    bridgeStatus,
    isRelayActive,
    recentTips: nexusRecentTips,
    isLoading: nexusLoading,
    error: nexusError,
    sendTip: nexusSendTip,
    isConnected: nexusConnected,
    canSendTips: nexusCanSendTips,
  } = useNexusBridge();

  const {
    isLoading: tipJarLoading,
    isPending,
    isConfirming,
    isConfirmed,
    error: tipJarError,
    hash,
    sendTip: tipJarSendTip,
  } = useTipJar();

  const [tipAmount, setTipAmount] = useState('');
  const [tipMessage, setTipMessage] = useState('');
  const [isSending, setIsSending] = useState(false);

  const handleSendTip = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!tipAmount || !tipMessage.trim()) {
      return;
    }

    try {
      setIsSending(true);
      
      // Send tip using TipJar contract
      await tipJarSendTip({
        streamerAddress,
        message: tipMessage.trim(),
        amount: tipAmount,
      });
      
      // Reset form
      setTipAmount('');
      setTipMessage('');
      
      alert('Tip sent successfully! It will be relayed to Avail chain.');
    } catch (error) {
      console.error('Failed to send tip:', error);
      alert('Failed to send tip. Please try again.');
    } finally {
      setIsSending(false);
    }
  };

  const presetAmounts = ['0.001', '0.005', '0.01', '0.05'];

  return (
    <div className={`bg-gray-800 rounded-lg p-6 ${className}`}>
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-white mb-2">
          Cross-Chain Tip to {streamerName}
        </h3>
        <p className="text-sm text-gray-400">
          Send tips from Base Sepolia to Avail chain
        </p>
      </div>

      {/* Bridge Status */}
      <div className="mb-4 p-3 bg-gray-700 rounded">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-300">Bridge Status</span>
          <div className="flex items-center space-x-2">
            <div className={`w-2 h-2 rounded-full ${
              nexusConnected ? 'bg-green-500' : 'bg-red-500'
            }`} />
            <span className="text-xs text-gray-400">
              {nexusConnected ? 'Connected' : 'Disconnected'}
            </span>
          </div>
        </div>
        
        {bridgeStatus && (
          <div className="text-xs text-gray-400 space-y-1">
            <div>Base Sepolia: {bridgeStatus.baseSepoliaStatus}</div>
            <div>Avail: {bridgeStatus.availStatus}</div>
            {bridgeStatus.lastRelayTime && (
              <div>Last Relay: {new Date(bridgeStatus.lastRelayTime).toLocaleString()}</div>
            )}
          </div>
        )}
      </div>

      {/* Error Display */}
      {(nexusError || tipJarError) && (
        <div className="mb-4 p-3 bg-red-900 border border-red-700 rounded text-red-200 text-sm">
          {nexusError || tipJarError}
        </div>
      )}

      {/* Tip Form */}
      {nexusCanSendTips ? (
        <form onSubmit={handleSendTip} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Tip Amount (ETH)
            </label>
            <div className="flex space-x-2 mb-2">
              {presetAmounts.map((amount) => (
                <button
                  key={amount}
                  type="button"
                  onClick={() => setTipAmount(amount)}
                  className="px-3 py-1 text-xs bg-gray-700 hover:bg-gray-600 text-white rounded transition-colors"
                >
                  {amount}
                </button>
              ))}
            </div>
            <input
              type="number"
              step="0.001"
              min="0"
              value={tipAmount}
              onChange={(e) => setTipAmount(e.target.value)}
              placeholder="0.001"
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Message
            </label>
            <textarea
              value={tipMessage}
              onChange={(e) => setTipMessage(e.target.value)}
              placeholder="Great stream! Keep it up!"
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
              rows={3}
              maxLength={200}
              required
            />
            <div className="text-xs text-gray-400 mt-1">
              {tipMessage.length}/200 characters
            </div>
          </div>

          <button
            type="submit"
            disabled={isSending || tipJarLoading || isPending || isConfirming || !tipAmount || !tipMessage.trim()}
            className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
          >
            {isSending || tipJarLoading || isPending || isConfirming ? 'Sending Tip...' : 'Send Cross-Chain Tip'}
          </button>
        </form>
      ) : (
        <div className="text-center py-4">
          <p className="text-gray-400 mb-2">
            {!isRelayActive ? 'Bridge not active' : 'Connect wallet to send tips'}
          </p>
          <div className="text-xs text-gray-500">
            Tips will be sent on Base Sepolia and relayed to Avail chain
          </div>
        </div>
      )}

      {/* Recent Tips */}
      {nexusRecentTips.length > 0 && (
        <div className="mt-6">
          <h4 className="text-sm font-medium text-gray-300 mb-3">Recent Tips</h4>
          <div className="space-y-2 max-h-32 overflow-y-auto">
            {nexusRecentTips.slice(0, 3).map((tip, index) => (
              <div key={index} className="text-xs text-gray-400 bg-gray-700 p-2 rounded">
                <div className="flex justify-between">
                  <span>{tip.amount} ETH</span>
                  <span>{new Date(tip.timestamp).toLocaleTimeString()}</span>
                </div>
                <div className="text-gray-500 truncate">{tip.message}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
