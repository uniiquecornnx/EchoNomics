import React from 'react';
import CrossChainTip from '../components/CrossChainTip';
import { useNexusBridge } from '../src/hooks/useNexusBridge';

export default function NexusDemo() {
  const {
    bridgeStatus,
    isRelayActive,
    recentTips,
    isLoading,
    error,
    isConnected,
    canSendTips,
  } = useNexusBridge();

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Avail Nexus Cross-Chain Demo</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Bridge Status */}
          <div className="bg-gray-800 rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Bridge Status</h2>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span>Connection Status</span>
                <div className="flex items-center space-x-2">
                  <div className={`w-3 h-3 rounded-full ${
                    isConnected ? 'bg-green-500' : 'bg-red-500'
                  }`} />
                  <span className="text-sm">
                    {isConnected ? 'Connected' : 'Disconnected'}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span>Relay Active</span>
                <div className="flex items-center space-x-2">
                  <div className={`w-3 h-3 rounded-full ${
                    isRelayActive ? 'bg-green-500' : 'bg-yellow-500'
                  }`} />
                  <span className="text-sm">
                    {isRelayActive ? 'Active' : 'Inactive'}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span>Can Send Tips</span>
                <div className="flex items-center space-x-2">
                  <div className={`w-3 h-3 rounded-full ${
                    canSendTips ? 'bg-green-500' : 'bg-red-500'
                  }`} />
                  <span className="text-sm">
                    {canSendTips ? 'Yes' : 'No'}
                  </span>
                </div>
              </div>

              {isLoading && (
                <div className="text-center py-4">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500 mx-auto mb-2"></div>
                  <p className="text-sm text-gray-400">Loading bridge status...</p>
                </div>
              )}

              {error && (
                <div className="p-3 bg-red-900 border border-red-700 rounded text-red-200 text-sm">
                  {error}
                </div>
              )}
            </div>

            {bridgeStatus && (
              <div className="mt-4 p-3 bg-gray-700 rounded">
                <h3 className="text-sm font-medium mb-2">Detailed Status</h3>
                <div className="text-xs text-gray-300 space-y-1">
                  <div>Base Sepolia: {bridgeStatus.baseSepoliaStatus}</div>
                  <div>Avail: {bridgeStatus.availStatus}</div>
                  {bridgeStatus.lastRelayTime && (
                    <div>Last Relay: {new Date(bridgeStatus.lastRelayTime).toLocaleString()}</div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Cross-Chain Tip Component */}
          <CrossChainTip 
            streamerAddress="0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6"
            streamerName="Demo Streamer"
            className="w-full"
          />
        </div>

        {/* Recent Tips */}
        {recentTips.length > 0 && (
          <div className="mt-8 bg-gray-800 rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Recent Cross-Chain Tips</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {recentTips.slice(0, 6).map((tip, index) => (
                <div key={index} className="bg-gray-700 p-4 rounded">
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-sm font-medium text-blue-400">
                      {tip.amount} ETH
                    </span>
                    <span className="text-xs text-gray-400">
                      {new Date(tip.timestamp).toLocaleTimeString()}
                    </span>
                  </div>
                  <p className="text-sm text-gray-300 mb-2">{tip.message}</p>
                  <div className="text-xs text-gray-500">
                    <div>From: {tip.from.slice(0, 6)}...{tip.from.slice(-4)}</div>
                    <div>To: {tip.to.slice(0, 6)}...{tip.to.slice(-4)}</div>
                    <div>Tx: {tip.originalTxHash.slice(0, 10)}...</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Instructions */}
        <div className="mt-8 bg-blue-900 border border-blue-700 rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">How Cross-Chain Tipping Works</h2>
          <div className="text-sm text-blue-200 space-y-2">
            <p>1. <strong>Send Tip on Base Sepolia:</strong> Users send tips using the TipJar contract on Base Sepolia</p>
            <p>2. <strong>Event Detection:</strong> The Nexus bridge listens for TipSent events on Base Sepolia</p>
            <p>3. <strong>Cross-Chain Relay:</strong> Tip data is automatically relayed to Avail chain using Nexus SDK</p>
            <p>4. <strong>Avail Integration:</strong> The tip is recorded on Avail chain for cross-chain tip tracking</p>
            <p>5. <strong>Real-time Updates:</strong> All tip data is stored in Supabase for analytics and display</p>
          </div>
        </div>
      </div>
    </div>
  );
}
