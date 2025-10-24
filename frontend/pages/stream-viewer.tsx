import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Chat from '../components/Chat'
import TipJar from '../components/TipJar'
import CrossChainTip from '../components/CrossChainTip'
import ConnectWallet from '../components/ConnectWallet'
import { useWallet } from '../src/hooks/useWallet'

const StreamViewer: React.FC = () => {
  const router = useRouter()
  const { isConnected, address } = useWallet()
  
  const [selectedGenre, setSelectedGenre] = useState('All')
  const [isLive, setIsLive] = useState(true)
  const [chatMessages, setChatMessages] = useState([
    { id: 1, user: 'CryptoFan123', message: 'Hello everyone!', timestamp: '2:30 PM' },
    { id: 2, user: 'TraderMike', message: 'Amazing stream!', timestamp: '2:31 PM' },
    { id: 3, user: 'DeFiLover', message: 'Hi there!', timestamp: '2:32 PM' },
    { id: 4, user: 'MoonBoy', message: '$100', timestamp: '2:33 PM' }
  ])
  const [newMessage, setNewMessage] = useState('')
  const [tipAmount, setTipAmount] = useState('')

  const genres = [
    'All',
    'Gaming',
    'DeFi',
    'Sports', 
    'Dance',
    'Boxing',
    'Others'
  ]

  const trendingTokens = [
    { symbol: '$MATH', change: '+12.5%' },
    { symbol: '$SUNNY', change: '+8.3%' },
    { symbol: '$CAT', change: '+15.2%' }
  ]

  const mockStreamData = {
    id: 'stream-123',
    title: 'Live Trading Session',
    slug: 'live-trading',
    streamer_wallet_address: '0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6',
    streamer_name: 'CryptoTrader'
  }

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault()
    if (newMessage.trim()) {
      const message = {
        id: chatMessages.length + 1,
        user: 'You',
        message: newMessage,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
      setChatMessages([...chatMessages, message])
      setNewMessage('')
    }
  }

  const handleSendTip = (e: React.FormEvent) => {
    e.preventDefault()
    if (tipAmount) {
      alert(`Tip of ${tipAmount} ETH sent! (This is a mock)`)
      setTipAmount('')
    }
  }

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 bg-gradient-to-br from-purple-900/20 via-black to-blue-900/20"></div>
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-purple-600/10 via-transparent to-transparent"></div>
      
      {/* Header */}
      <div className="relative bg-black/80 backdrop-blur-xl border-b border-purple-500/20 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2 bg-gradient-to-r from-green-400 to-emerald-500 px-4 py-2 rounded-full">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-green-400 font-bold text-sm">TRENDING</span>
                <svg className="w-4 h-4 text-green-400 animate-bounce" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M3.293 9.707a1 1 0 010-1.414l6-6a1 1 0 011.414 0l6 6a1 1 0 01-1.414 1.414L11 5.414V17a1 1 0 11-2 0V5.414L4.707 9.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
            
            <div className="flex space-x-3">
              {trendingTokens.map((token, index) => (
                <button
                  key={index}
                  className="group relative px-4 py-2 bg-gradient-to-r from-purple-600/20 to-pink-600/20 hover:from-purple-500/30 hover:to-pink-500/30 rounded-full border border-purple-500/30 hover:border-purple-400/50 transition-all duration-300 hover:scale-105"
                >
                  <span className="text-white font-semibold text-sm">{token.symbol}</span>
                  <span className="ml-2 text-green-400 text-xs font-medium">{token.change}</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 bg-gradient-to-r from-purple-600/20 to-blue-600/20 px-4 py-2 rounded-full border border-purple-500/30">
              <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></div>
              <span className="text-xs text-purple-300">Contract:</span>
              <span className="text-sm font-mono text-white">{mockStreamData.streamer_wallet_address.slice(0, 6)}...{mockStreamData.streamer_wallet_address.slice(-4)}</span>
            </div>
            <ConnectWallet />
          </div>
        </div>
      </div>

      <div className="flex h-screen relative">
        {/* Left Sidebar - Genres */}
        <div className="w-64 bg-black/60 backdrop-blur-xl border-r border-purple-500/20 p-6">
          <div className="mb-8">
            <div className="relative">
              <select
                value={selectedGenre}
                onChange={(e) => setSelectedGenre(e.target.value)}
                className="w-full bg-gradient-to-r from-purple-600/20 to-pink-600/20 border border-purple-500/30 rounded-xl px-4 py-3 text-white appearance-none focus:outline-none focus:border-purple-400/50 transition-all duration-300"
              >
                {genres.map((genre) => (
                  <option key={genre} value={genre} className="bg-black">{genre}</option>
                ))}
              </select>
              <svg className="absolute right-4 top-4 w-4 h-4 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>

          <div className="space-y-3">
            {genres.slice(1).map((genre, index) => (
              <button
                key={genre}
                onClick={() => setSelectedGenre(genre)}
                className={`group relative w-full text-left px-4 py-4 rounded-xl transition-all duration-300 transform hover:scale-105 ${
                  selectedGenre === genre 
                    ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg shadow-purple-500/25' 
                    : 'bg-gradient-to-r from-gray-800/50 to-gray-700/50 hover:from-purple-600/20 hover:to-pink-600/20 text-gray-300 hover:text-white border border-gray-600/30 hover:border-purple-500/50'
                }`}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="flex items-center justify-between">
                  <span className="font-semibold">{genre}</span>
                  {selectedGenre === genre && (
                    <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                  )}
                </div>
                <div className={`absolute inset-0 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${
                  selectedGenre === genre ? 'opacity-100' : ''
                }`}></div>
              </button>
            ))}
          </div>
        </div>

        {/* Main Content - Live Stream */}
        <div className="flex-1 flex flex-col relative">
          {/* Stream Header */}
          <div className="bg-black/60 backdrop-blur-xl border-b border-purple-500/20 px-6 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-white to-purple-300 bg-clip-text text-transparent">
                  {mockStreamData.title}
                </h1>
                <p className="text-purple-300 text-sm">by {mockStreamData.streamer_name}</p>
              </div>
              <div className="flex items-center space-x-6">
                <div className="flex items-center space-x-3">
                  <div className={`w-3 h-3 rounded-full ${isLive ? 'bg-red-500 animate-pulse shadow-lg shadow-red-500/50' : 'bg-gray-500'}`}></div>
                  <span className="text-sm font-bold text-white">{isLive ? 'LIVE' : 'OFFLINE'}</span>
                </div>
                <div className="flex space-x-3">
                  <button className="group relative px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 rounded-xl text-sm font-bold text-white transition-all duration-300 hover:scale-105 shadow-lg shadow-green-500/25">
                    <span className="relative z-10">LIVE</span>
                    <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-emerald-400 rounded-xl opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
                  </button>
                  <button className="group relative px-6 py-3 bg-gradient-to-r from-purple-600/20 to-pink-600/20 hover:from-purple-500/30 hover:to-pink-500/30 border border-purple-500/30 hover:border-purple-400/50 rounded-xl text-sm font-bold text-white transition-all duration-300 hover:scale-105">
                    <span className="relative z-10">CHART</span>
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </button>
                  <button className="group relative px-6 py-3 bg-gradient-to-r from-blue-600/20 to-cyan-600/20 hover:from-blue-500/30 hover:to-cyan-500/30 border border-blue-500/30 hover:border-blue-400/50 rounded-xl text-sm font-bold text-white transition-all duration-300 hover:scale-105">
                    <span className="relative z-10">BUY/SELL</span>
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Video Player */}
          <div className="flex-1 bg-black relative overflow-hidden">
            {/* Animated background pattern */}
            <div className="absolute inset-0 bg-gradient-to-br from-purple-900/10 via-transparent to-blue-900/10"></div>
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-purple-600/5 via-transparent to-transparent"></div>
            
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className="relative mb-6">
                  <div className="w-20 h-20 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center mx-auto shadow-2xl shadow-purple-500/25">
                    <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="absolute inset-0 w-20 h-20 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full mx-auto animate-ping opacity-20"></div>
                </div>
                <p className="text-purple-300 text-lg font-medium">Live stream will appear here</p>
                <p className="text-sm text-gray-400 mt-2">Stream ID: {mockStreamData.slug}</p>
              </div>
            </div>
            
            {/* Live indicator */}
            <div className="absolute top-6 left-6 bg-gradient-to-r from-red-600 to-pink-600 px-4 py-2 rounded-full shadow-lg shadow-red-500/25">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                <span className="text-white font-bold text-sm">● LIVE</span>
              </div>
            </div>

            {/* Floating elements */}
            <div className="absolute top-1/4 right-8 w-2 h-2 bg-purple-400 rounded-full animate-pulse"></div>
            <div className="absolute bottom-1/4 left-12 w-1 h-1 bg-pink-400 rounded-full animate-ping"></div>
            <div className="absolute top-1/3 left-1/4 w-1.5 h-1.5 bg-blue-400 rounded-full animate-pulse"></div>
          </div>
        </div>

        {/* Right Sidebar - Chat and Tipping */}
        <div className="w-80 bg-black/60 backdrop-blur-xl border-l border-purple-500/20 flex flex-col">
          {/* Chat Section */}
          <div className="flex-1 flex flex-col">
            <div className="p-6 border-b border-purple-500/20">
              <h2 className="text-xl font-bold bg-gradient-to-r from-white to-purple-300 bg-clip-text text-transparent">
                CHAT
              </h2>
            </div>
            
            {/* Chat Messages */}
            <div className="flex-1 p-4 overflow-y-auto space-y-4">
              {chatMessages.map((msg, index) => (
                <div key={msg.id} className="group flex items-start space-x-3 p-3 rounded-xl bg-gradient-to-r from-purple-600/10 to-pink-600/10 hover:from-purple-600/20 hover:to-pink-600/20 border border-purple-500/20 hover:border-purple-400/40 transition-all duration-300"
                     style={{ animationDelay: `${index * 100}ms` }}>
                  <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-xs font-bold text-white shadow-lg">
                    {msg.user.charAt(0)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="text-sm font-bold text-purple-300">{msg.user}</span>
                      <span className="text-xs text-gray-400">{msg.timestamp}</span>
                    </div>
                    <p className="text-sm text-white">{msg.message}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Chat Input */}
            <div className="p-4 border-t border-purple-500/20">
              <form onSubmit={handleSendMessage} className="flex space-x-3">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type a message..."
                  className="flex-1 bg-gradient-to-r from-purple-600/20 to-pink-600/20 border border-purple-500/30 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-purple-400/50 transition-all duration-300"
                />
                <button
                  type="submit"
                  className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 rounded-xl text-white font-bold transition-all duration-300 hover:scale-105 shadow-lg shadow-purple-500/25"
                >
                  Send
                </button>
              </form>
            </div>
          </div>

          {/* Tipping Section */}
          <div className="border-t border-purple-500/20 p-6">
            <h3 className="text-xl font-bold bg-gradient-to-r from-white to-green-300 bg-clip-text text-transparent mb-6">
              Send Tip
            </h3>
            
            {/* Beautiful Tip Form */}
            <form onSubmit={handleSendTip} className="space-y-4">
              <div>
                <label className="block text-sm text-purple-300 mb-2 font-semibold">Amount (ETH)</label>
                <input
                  type="number"
                  step="0.001"
                  value={tipAmount}
                  onChange={(e) => setTipAmount(e.target.value)}
                  placeholder="0.1"
                  className="w-full bg-gradient-to-r from-green-600/20 to-emerald-600/20 border border-green-500/30 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-green-400/50 transition-all duration-300"
                />
              </div>
              <button
                type="submit"
                className="group relative w-full py-4 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white rounded-xl font-bold transition-all duration-300 hover:scale-105 shadow-lg shadow-green-500/25"
              >
                <span className="relative z-10 flex items-center justify-center space-x-2">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                  <span>Send Tip</span>
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-emerald-400 rounded-xl opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
              </button>
            </form>

            {/* Contract Address */}
            <div className="mt-6 p-4 bg-gradient-to-r from-purple-600/10 to-blue-600/10 rounded-xl border border-purple-500/20">
              <p className="text-xs text-purple-300 mb-2 font-semibold">Streamer Contract:</p>
              <p className="text-sm font-mono break-all text-white bg-black/20 px-3 py-2 rounded-lg">
                {mockStreamData.streamer_wallet_address}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default StreamViewer
