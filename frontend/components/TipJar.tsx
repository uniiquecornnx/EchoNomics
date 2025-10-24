'use client';
import React, { useState, useEffect } from 'react';
import { useTipJar } from '../src/hooks/useTipJar';
import { useWallet } from '../src/hooks/useWallet';

interface TipJarProps {
  streamId?: string;
  streamSlug?: string;
  streamerName?: string;
  className?: string;
}

export default function TipJar({ 
  streamId, 
  streamSlug, 
  streamerName = 'Streamer',
  className = '' 
}: TipJarProps) {
  const { isConnected, address } = useWallet();
  const {
    isLoading,
    isPending,
    isConfirming,
    isConfirmed,
    error,
    hash,
    recentTips,
    sendTipByStreamId,
    sendTipByStreamSlug,
    getRecentTips,
  } = useTipJar();

  const [tipAmount, setTipAmount] = useState('');
  const [tipMessage, setTipMessage] = useState('');
  const [isSending, setIsSending] = useState(false);

  // Load recent tips when component mounts
  useEffect(() => {
    if (streamId) {
      getRecentTips(streamId).catch(console.error);
    }
  }, [streamId, getRecentTips]);

  const handleSendTip = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isConnected) {
      alert('Please connect your wallet to send tips');
      return;
    }

    if (!tipAmount || !tipMessage.trim()) {
      alert('Please enter both amount and message');
      return;
    }

    try {
      setIsSending(true);

      if (streamId) {
        await sendTipByStreamId(streamId, tipMessage.trim(), tipAmount);
      } else if (streamSlug) {
        await sendTipByStreamSlug(streamSlug, tipMessage.trim(), tipAmount);
      } else {
        throw new Error('Either streamId or streamSlug must be provided');
      }

      // Reset form
      setTipAmount('');
      setTipMessage('');
      
      // Reload recent tips
      if (streamId) {
        await getRecentTips(streamId);
      }

      alert('Tip sent successfully!');
    } catch (error) {
      console.error('Failed to send tip:', error);
      alert(`Failed to send tip: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsSending(false);
    }
  };

  const presetAmounts = ['0.001', '0.005', '0.01', '0.05', '0.1'];

  const formatAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  const formatAmount = (amountWei: string) => {
    return (parseFloat(amountWei) / 1e18).toFixed(4);
  };

  return (
    <div className={`bg-gray-800 rounded-lg p-6 ${className}`}>
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-white mb-2">
          Tip {streamerName}
        </h3>
        <p className="text-sm text-gray-400">
          Send ETH tips directly to the streamer's wallet
        </p>
      </div>

      {/* Transaction Status */}
      {(isPending || isConfirming) && (
        <div className="mb-4 p-3 bg-blue-900 border border-blue-700 rounded">
          <div className="flex items-center space-x-2">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-400"></div>
            <span className="text-blue-200 text-sm">
              {isPending ? 'Transaction pending...' : 'Confirming transaction...'}
            </span>
          </div>
          {hash && (
            <div className="text-xs text-blue-300 mt-1">
              Tx: {formatAddress(hash)}
            </div>
          )}
        </div>
      )}

      {isConfirmed && (
        <div className="mb-4 p-3 bg-green-900 border border-green-700 rounded">
          <div className="text-green-200 text-sm">
            ✅ Tip sent successfully!
          </div>
          {hash && (
            <div className="text-xs text-green-300 mt-1">
              Tx: {formatAddress(hash)}
            </div>
          )}
        </div>
      )}

      {/* Error Display */}
      {error && (
        <div className="mb-4 p-3 bg-red-900 border border-red-700 rounded text-red-200 text-sm">
          {error}
        </div>
      )}

      {/* Tip Form */}
      {isConnected ? (
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
            disabled={isSending || isLoading || !tipAmount || !tipMessage.trim()}
            className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
          >
            {isSending || isLoading ? 'Sending Tip...' : 'Send Tip'}
          </button>
        </form>
      ) : (
        <div className="text-center py-4">
          <p className="text-gray-400 mb-2">Connect your wallet to send tips</p>
          <div className="text-xs text-gray-500">
            Tips are sent directly to the streamer's wallet
          </div>
        </div>
      )}

      {/* Recent Tips */}
      {recentTips.length > 0 && (
        <div className="mt-6">
          <h4 className="text-sm font-medium text-gray-300 mb-3">Recent Tips</h4>
          <div className="space-y-2 max-h-32 overflow-y-auto">
            {recentTips.slice(0, 5).map((tip, index) => (
              <div key={index} className="text-xs text-gray-400 bg-gray-700 p-2 rounded">
                <div className="flex justify-between">
                  <span className="text-blue-400">{formatAmount(tip.amount_wei)} ETH</span>
                  <span>{new Date(tip.created_at).toLocaleTimeString()}</span>
                </div>
                <div className="text-gray-500 truncate">{tip.message || 'No message'}</div>
                <div className="text-gray-600">
                  From: {formatAddress(tip.from_address)}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
