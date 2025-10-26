'use client';
import React, { useState } from 'react';
import { useWallet } from '../src/hooks/useWallet';
import ConnectWallet from './ConnectWallet';
import Chat from './Chat';
import TipJar from './TipJar';

interface StreamLayoutProps {
  streamId?: string;
  streamSlug?: string;
  streamerName?: string;
  streamTitle?: string;
  streamDescription?: string;
  isLive?: boolean;
}

export default function StreamLayout({
  streamId = 'default-stream',
  streamSlug,
  streamerName = 'Streamer',
  streamTitle = 'Live Stream',
  streamDescription = 'Join the conversation and support the streamer!',
  isLive = true
}: StreamLayoutProps) {
  const { isConnected, address } = useWallet();
  const [activeTab, setActiveTab] = useState('home');

  // Mock user data for chat
  const userId = address || 'anonymous';
  const username = address ? `${address.slice(0, 6)}...${address.slice(-4)}` : 'Anonymous';

  return (
    <div className="min-h-screen retro-gradient-bg">
      {/* Browser Header */}
      <div className="bg-black border-b border-green-500 px-4 py-2 flex justify-between items-center retro-border-glow">
        <div className="text-green-400 text-sm bitcount-medium font-bold retro-text-glow">
          echo-nomics.stream/live/{streamSlug || streamId}
        </div>
        <div className="flex items-center space-x-3">
          <button className="bg-gradient-to-r from-green-500 to-cyan-500 hover:from-green-400 hover:to-cyan-400 text-black px-4 py-1 rounded text-sm font-bold transition-all duration-300 retro-glow bitcount-medium">
            Create Stream
          </button>
          <ConnectWallet />
        </div>
      </div>

      <div className="flex h-screen">
        {/* Left Sidebar - Navigation */}
        <div className="w-72 bg-black border-r border-green-500 flex flex-col retro-border-glow">
          {/* Logo */}
          <div className="p-8 border-b border-green-500">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 flex items-center justify-center">
                <img src="/logo.svg" alt="EchoNomics Logo" className="w-full h-full" />
              </div>
              <span className="text-green-400 font-bold text-xl bitcount-medium retro-text-glow">EchoNomics</span>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-6 space-y-3">
            <button
              onClick={() => setActiveTab('home')}
              className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg transition-all duration-300 bitcount-normal ${
                activeTab === 'home' ? 'bg-green-500 text-black retro-glow' : 'bg-black text-green-400 hover:text-green-300 hover:bg-gray-900 hover:retro-border-glow'
              }`}
            >
              <div className="w-4 h-4 flex items-center justify-center">
                <img src="/icons/home.png" alt="Home" className="w-full h-full" onError={(e) => {(e.target as HTMLImageElement).style.display='none';}} />
              </div>
              <span>Home</span>
            </button>

            <button
              onClick={() => setActiveTab('streams')}
              className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg transition-all duration-300 bitcount-normal ${
                activeTab === 'streams' ? 'bg-green-500 text-black retro-glow' : 'bg-black text-green-400 hover:text-green-300 hover:bg-gray-900 hover:retro-border-glow'
              }`}
            >
              <div className="w-4 h-4 flex items-center justify-center">
                <img src="/icons/livestreams.png" alt="Livestreams" className="w-full h-full" onError={(e) => {(e.target as HTMLImageElement).style.display='none';}} />
              </div>
              <span>Livestreams</span>
            </button>

            <button
              onClick={() => setActiveTab('advanced')}
              className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg transition-all duration-300 bitcount-normal ${
                activeTab === 'advanced' ? 'bg-green-500 text-black retro-glow' : 'bg-black text-green-400 hover:text-green-300 hover:bg-gray-900 hover:retro-border-glow'
              }`}
            >
              <div className="w-4 h-4 flex items-center justify-center">
                <img src="/icons/advanced.png" alt="Advanced" className="w-full h-full" onError={(e) => {(e.target as HTMLImageElement).style.display='none';}} />
              </div>
              <span>Advanced</span>
            </button>

            <button
              onClick={() => setActiveTab('chat')}
              className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg transition-all duration-300 bitcount-normal ${
                activeTab === 'chat' ? 'bg-green-500 text-black retro-glow' : 'bg-black text-green-400 hover:text-green-300 hover:bg-gray-900 hover:retro-border-glow'
              }`}
            >
              <div className="w-4 h-4 flex items-center justify-center">
                <img src="/icons/chat.png" alt="Chat" className="w-full h-full" onError={(e) => {(e.target as HTMLImageElement).style.display='none';}} />
              </div>
              <span>Chat</span>
              <span className="bg-gradient-to-r from-green-500 to-cyan-500 text-black text-xs px-2 py-1 rounded-full font-bold retro-glow">NEW</span>
            </button>

            <button
              onClick={() => setActiveTab('profile')}
              className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg transition-all duration-300 bitcount-normal ${
                activeTab === 'profile' ? 'bg-green-500 text-black retro-glow' : 'bg-black text-green-400 hover:text-green-300 hover:bg-gray-900 hover:retro-border-glow'
              }`}
            >
              <div className="w-4 h-4 flex items-center justify-center">
                <img src="/icons/profile.png" alt="Profile" className="w-full h-full" onError={(e) => {(e.target as HTMLImageElement).style.display='none';}} />
              </div>
              <span>Profile</span>
            </button>

            <button
              onClick={() => setActiveTab('support')}
              className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg transition-all duration-300 bitcount-normal ${
                activeTab === 'support' ? 'bg-green-500 text-black retro-glow' : 'bg-black text-green-400 hover:text-green-300 hover:bg-gray-900 hover:retro-border-glow'
              }`}
            >
              <div className="w-4 h-4 flex items-center justify-center">
                <img src="/icons/support.png" alt="Support" className="w-full h-full" onError={(e) => {(e.target as HTMLImageElement).style.display='none';}} />
              </div>
              <span>Support</span>
            </button>
          </nav>

        </div>

        {/* Center Column - Live Stream */}
        <div className="flex-1 flex flex-col">
          {/* Stream Header */}
          <div className="bg-black p-1">
            <div className="bg-black p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                    <span className="text-red-500 text-sm font-bold bitcount-medium">|   LIVE NOW 🔴</span>
                  </div>
                </div>
              </div>
              
              <h1 className="text-green-400 text-2xl font-bold mb-2 bitcount-bold retro-text-glow">|    Predict Your Next Move with Predicto</h1>
              <div className="flex items-center space-x-4 text-green-300 text-sm bitcount-normal">
                
                <span className="mx-2">10 mins ago</span>
              </div>
            </div>
          </div>

          {/* Stream Content */}
          <div className="flex-1 bg-black p-6 pt-0">
            <div className="bg-black rounded-2xl h-full flex flex-col items-center justify-center border-2 border-green-500 retro-border-glow overflow-hidden p-4 max-w-4xl mx-auto">
              <video
                className="w-full h-full object-contain rounded-xl"
                controls
                autoPlay
                muted
                loop
                playsInline
              >
                <source src="/videos/demo-stream.mp4" type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </div>
          </div>
        </div>

        {/* Right Column - Chat & Tipping */}
        <div className="w-72 bg-black border-l border-green-500 flex flex-col retro-border-glow">
          {/* Live Chat Section */}
          <div className="flex-1 p-6">
            <h3 className="text-green-400 font-bold mb-6 bitcount-medium retro-text-glow">Live Chat</h3>
            <Chat 
              streamId={streamId}
              userId={userId}
              username={username}
              className="h-96"
            />
          </div>

          {/* Action Buttons */}
          <div className="p-7 border-t border-green-1500">
            <div className="space-y-190">
              <button className="w-full bg-gradient-to-r from-green-500 to-cyan-500 hover:from-green-400 hover:to-cyan-400 text-black py-3 px-4 rounded-lg font-bold transition-all duration-300 retro-glow bitcount-medium">
                Send Message
              </button>
              <button className="w-full bg-gradient-to-r from-green-500 to-cyan-500 hover:from-green-400 hover:to-cyan-400 text-black py-3 px-4 rounded-lg font-bold transition-all duration-300 retro-glow bitcount-medium">
                Send Tip
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
