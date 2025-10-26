import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Player from '../../components/Player'
import { supabase } from '../../lib/supabaseClient'
import Chat from '../../components/Chat'
import TipJar from '../../components/TipJar'
import CrossChainTip from '../../components/CrossChainTip'

interface StreamData {
  id: string
  title: string
  slug: string
  playbackId: string
  hlsPlaybackUrl: string
  thumbnailUrl?: string
  streamer_wallet_address?: string
}

const StreamViewer: React.FC = () => {
  const router = useRouter()
  const { slug } = router.query
  
  const [streamData, setStreamData] = useState<StreamData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!slug) return

    const fetchStream = async () => {
      try {
        setIsLoading(true)
        setError(null)

        const { data, error } = await supabase
          .from('streams')
          .select('*')
          .eq('slug', slug)
          .single()

        if (error) {
          console.error('Error fetching stream:', error)
          setError('Stream not found')
          return
        }

        if (!data) {
          setError('Stream not found')
          return
        }

        setStreamData({
          id: data.id,
          title: data.title,
          slug: data.slug,
          playbackId: data.playback_id,
          hlsPlaybackUrl: data.playback_url,
          thumbnailUrl: data.thumbnail_url,
          streamer_wallet_address: data.streamer_wallet_address
        })

      } catch (err) {
        console.error('Error:', err)
        setError('Failed to load stream')
      } finally {
        setIsLoading(false)
      }
    }

    fetchStream()
  }, [slug])

  if (isLoading) {
    return (
      <div className="min-h-screen retro-gradient-bg text-green-400 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-400 mx-auto mb-4"></div>
          <p className="bitcount-normal retro-text-glow">Loading stream...</p>
        </div>
      </div>
    )
  }

  if (error || !streamData) {
    return (
      <div className="min-h-screen retro-gradient-bg text-green-400 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4 bitcount-normal retro-text-glow">Stream Not Found</h1>
          <p className="text-green-300 mb-6 bitcount-normal">{error || 'The stream you are looking for does not exist.'}</p>
          <button
            onClick={() => router.push('/')}
            className="px-6 py-2 bg-gradient-to-r from-green-500 to-cyan-500 hover:from-green-400 hover:to-cyan-400 text-black rounded-lg font-bold transition-all duration-300 retro-glow bitcount-normal"
          >
            Go Home
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen retro-gradient-bg text-green-400">
      <div className="max-w-7xl mx-auto p-6">
        {/* Stream Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2 bitcount-normal retro-text-glow">{streamData.title}</h1>
          <p className="text-green-300 bitcount-normal">Stream ID: {streamData.slug}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Stream Area */}
          <div className="lg:col-span-2 space-y-6">
            {/* Video Player */}
            <div className="bg-black rounded-lg overflow-hidden border border-green-500 retro-border-glow">
              <Player
                playbackUrl={streamData.hlsPlaybackUrl}
                autoPlay={true}
                muted={false}
                controls={true}
                className="w-full aspect-video"
              />
            </div>

            {/* Stream Info */}
            <div className="bg-black border border-green-500 rounded-lg p-6 retro-border-glow">
              <h2 className="text-xl font-bold mb-4 bitcount-normal retro-text-glow">Stream Information</h2>
              <div className="space-y-2 text-sm bitcount-normal">
                <div className="flex justify-between">
                  <span className="text-green-300">Title:</span>
                  <span className="text-green-400">{streamData.title}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-green-300">Stream ID:</span>
                  <span className="text-green-400 bitcount-normal">{streamData.slug}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-green-300">Playback ID:</span>
                  <span className="text-green-400 bitcount-normal text-xs">{streamData.playbackId}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Chat */}
            <div className="bg-black border border-green-500 rounded-lg p-6 retro-border-glow">
              <h3 className="text-lg font-bold mb-4 bitcount-normal retro-text-glow">Live Chat</h3>
              <Chat streamId={streamData.id} />
            </div>

            {/* Tipping */}
            <div className="space-y-4">
              {/* Direct TipJar */}
              <TipJar
                streamId={streamData.id}
                streamerName={streamData.title}
                className="w-full"
              />

              {/* Cross-Chain Tipping */}
              <CrossChainTip
                streamerAddress={streamData.streamer_wallet_address || "0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6"}
                streamerName={streamData.title}
                className="w-full"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default StreamViewer