'use client';
import React, { useState } from 'react';
import { useWallet } from '../src/hooks/useWallet';
import ConnectWallet from './ConnectWallet';
import Chat from './Chat';
import TipJar from './TipJar';
import Player from './Player';

interface StreamLayoutProps {
  streamId?: string;
  streamSlug?: string;
  streamerName?: string;
  streamTitle?: string;
  streamDescription?: string;
  isLive?: boolean;
  playbackUrl?: string;
  showVideoPlayer?: boolean;
}

export default function StreamLayoutWithPlayer({
  streamId = 'default-stream',
  streamSlug,
  streamerName = 'Streamer',
  streamTitle = 'Live Stream',
  streamDescription = 'Join the conversation and support the streamer!',
  isLive = true,
  playbackUrl,
  showVideoPlayer = false
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
          <div className="p-6 border-b border-green-500">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 flex items-center justify-center">
                <img src="/logo.svg" alt="EchoNomics Logo" className="w-full h-full" />
              </div>
              <span className="text-green-400 font-bold text-lg bitcount-normal retro-text-glow">EchoNomics</span>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2">
            <button
              onClick={() => setActiveTab('home')}
              className={`w-full flex items-center space-x-2 px-2 py-2 rounded transition-all duration-300 bitcount-bold ${
                activeTab === 'home' ? 'bg-green-500 text-black' : '!bg-black text-green-400 hover:text-green-300'
              }`}
            >
              <div className="w-4 h-4 flex items-center justify-center">
                <img src="/icons/home.png" alt="Home" className="w-full h-full" onError={(e) => {(e.target as HTMLImageElement).style.display='none';}} />
              </div>
              <span className="text-sm">Home</span>
            </button>

            <button
              onClick={() => setActiveTab('streams')}
              className={`w-full flex items-center space-x-2 px-2 py-2 rounded transition-all duration-300 bitcount-bold ${
                activeTab === 'streams' ? 'bg-green-500 text-black' : 'bg-black text-green-400 hover:text-green-300'
              }`}
            >
              <div className="w-4 h-4 flex items-center justify-center">
                <img src="/icons/livestreams.png" alt="Livestreams" className="w-full h-full" onError={(e) => {(e.target as HTMLImageElement).style.display='none';}} />
              </div>
              <span className="text-sm">Livestreams</span>
            </button>

            <button
              onClick={() => setActiveTab('advanced')}
              className={`w-full flex items-center space-x-2 px-2 py-2 rounded transition-all duration-300 bitcount-bold ${
                activeTab === 'advanced' ? 'bg-green-500 text-black' : 'bg-black text-green-400 hover:text-green-300'
              }`}
            >
              <div className="w-4 h-4 flex items-center justify-center">
                <img src="/icons/advanced.png" alt="Advanced" className="w-full h-full" onError={(e) => {(e.target as HTMLImageElement).style.display='none';}} />
              </div>
              <span className="text-sm">Advanced</span>
            </button>

            <button
              onClick={() => setActiveTab('chat')}
              className={`w-full flex items-center space-x-2 px-2 py-2 rounded transition-all duration-300 bitcount-bold ${
                activeTab === 'chat' ? 'bg-green-500 text-black' : 'bg-black text-green-400 hover:text-green-300'
              }`}
            >
              <div className="w-4 h-4 flex items-center justify-center">
                <img src="/icons/chat.png" alt="Chat" className="w-full h-full" onError={(e) => {(e.target as HTMLImageElement).style.display='none';}} />
              </div>
              <span className="text-sm">Chat</span>
              <span className="bg-green-500 text-black text-xs px-1 py-0.5 rounded text-xs">NEW</span>
            </button>

            <button
              onClick={() => setActiveTab('profile')}
              className={`w-full flex items-center space-x-2 px-2 py-2 rounded transition-all duration-300 bitcount-bold ${
                activeTab === 'profile' ? 'bg-green-500 text-black' : 'bg-black text-green-400 hover:text-green-300'
              }`}
            >
              <div className="w-4 h-4 flex items-center justify-center">
                <img src="/icons/profile.png" alt="Profile" className="w-full h-full" onError={(e) => {(e.target as HTMLImageElement).style.display='none';}} />
              </div>
              <span className="text-sm">Profile</span>
            </button>

            <button
              onClick={() => setActiveTab('support')}
              className={`w-full flex items-center space-x-2 px-2 py-2 rounded transition-all duration-300 bitcount-bold ${
                activeTab === 'support' ? 'bg-green-500 text-black' : 'bg-black text-green-400 hover:text-green-300'
              }`}
            >
              <div className="w-4 h-4 flex items-center justify-center">
                <img src="/icons/support.png" alt="Support" className="w-full h-full" onError={(e) => {(e.target as HTMLImageElement).style.display='none';}} />
              </div>
              <span className="text-sm">Support</span>
            </button>
          </nav>

        </div>

        {/* Center Column - Live Stream */}
        <div className="flex-1 flex flex-col">
          {/* Stream Header */}
          <div className="bg-black p-1">
            <div className="bg-black p-4">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                    <span className="text-red-500 text-sm font-bold bitcount-normal"> 🔴 LIVE NOW</span>
                  </div>
                </div>
              </div>
              
              <h1 className="text-green-400 text-2xl font-bold mb-2 bitcount-normal retro-text-glow">Predict Your Next Move with Predicto</h1>
              <div className="flex items-center space-x-4 text-green-300 text-sm bitcount-normal">
                <span className="font-bold">{streamerName}</span>
                <span className="mx-2">{address ? `${address.slice(0, 6)}...${address.slice(-4)}` : 'Anonymous'}</span>
                <span className="mx-2">2h ago</span>
              </div>
            </div>
          </div>

          {/* Stream Content */}
          <div className="flex-1 bg-black p-6 pt-0">
            {showVideoPlayer && playbackUrl ? (
              <div className="h-full border-2 border-green-500 rounded-2xl retro-border-glow overflow-hidden max-w-4xl mx-auto">
                <Player 
                  playbackUrl={playbackUrl}
                  className="h-full w-full rounded-xl"
                  autoPlay={true}
                  controls={true}
                  muted={false}
                />
              </div>
            ) : (
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
            )}
          </div>
        </div>

        {/* Right Column - Chat & Tipping */}
        <div className="w-72 bg-black border-l border-green-500 flex flex-col retro-border-glow">
          {/* Live Chat Section */}
          <div className="flex-1 p-4">
            <h3 className="text-green-400 font-bold mb-4 bitcount-normal retro-text-glow">Live Chat</h3>
            <Chat 
              streamId={streamId}
              userId={userId}
              username={username}
              className="h-96"
            />
          </div>

          {/* Action Buttons */}
          <div className="p-4 border-t border-green-500">
            <div className="space-y-3">
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