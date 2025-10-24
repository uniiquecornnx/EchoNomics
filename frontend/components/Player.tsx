import React, { useEffect, useRef, useState } from 'react'
import Hls from 'hls.js'

interface PlayerProps {
  playbackUrl: string
  className?: string
  autoPlay?: boolean
  controls?: boolean
  muted?: boolean
}

const Player: React.FC<PlayerProps> = ({
  playbackUrl,
  className = '',
  autoPlay = false,
  controls = true,
  muted = false
}) => {
  const videoRef = useRef<HTMLVideoElement>(null)
  const hlsRef = useRef<Hls | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!videoRef.current || !playbackUrl) return

    const video = videoRef.current

    // Clean up previous HLS instance
    if (hlsRef.current) {
      hlsRef.current.destroy()
      hlsRef.current = null
    }

    const initializePlayer = () => {
      setIsLoading(true)
      setError(null)

      if (Hls.isSupported()) {
        // Use HLS.js for browsers that don't support native HLS
        const hls = new Hls({
          enableWorker: true,
          lowLatencyMode: true,
          backBufferLength: 90
        })

        hlsRef.current = hls

        hls.on(Hls.Events.MEDIA_ATTACHED, () => {
          console.log('Media attached to HLS')
        })

        hls.on(Hls.Events.MANIFEST_PARSED, () => {
          console.log('Manifest parsed, starting playback')
          setIsLoading(false)
          if (autoPlay) {
            video.play().catch(console.error)
          }
        })

        hls.on(Hls.Events.ERROR, (event, data) => {
          console.error('HLS error:', data)
          setError(`Playback error: ${data.details}`)
          setIsLoading(false)
        })

        hls.attachMedia(video)
        hls.loadSource(playbackUrl)
      } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
        // Use native HLS support (Safari)
        video.src = playbackUrl
        video.addEventListener('loadedmetadata', () => {
          setIsLoading(false)
          if (autoPlay) {
            video.play().catch(console.error)
          }
        })
        video.addEventListener('error', () => {
          setError('Failed to load video stream')
          setIsLoading(false)
        })
      } else {
        setError('HLS playback not supported in this browser')
        setIsLoading(false)
      }
    }

    initializePlayer()

    // Cleanup on unmount
    return () => {
      if (hlsRef.current) {
        hlsRef.current.destroy()
        hlsRef.current = null
      }
    }
  }, [playbackUrl, autoPlay])

  const handlePlay = () => {
    if (videoRef.current) {
      videoRef.current.play().catch(console.error)
    }
  }

  const handlePause = () => {
    if (videoRef.current) {
      videoRef.current.pause()
    }
  }

  if (error) {
    return (
      <div className={`flex items-center justify-center bg-gray-900 text-white p-8 rounded ${className}`}>
        <div className="text-center">
          <p className="text-red-400 mb-2">Playback Error</p>
          <p className="text-sm text-gray-300">{error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className={`relative bg-black rounded overflow-hidden ${className}`}>
      <video
        ref={videoRef}
        className="w-full h-full"
        controls={controls}
        muted={muted}
        playsInline
        preload="metadata"
      />
      
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="text-white text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-2"></div>
            <p className="text-sm">Loading stream...</p>
          </div>
        </div>
      )}
    </div>
  )
}

export default Player
