import React, { useState, useRef } from 'react'
import { supabase } from '../../lib/supabaseClient'
import CrossChainTip from '../../components/CrossChainTip'
import TipJar from '../../components/TipJar'

interface StreamData {
  id: string
  title: string
  slug: string
  streamKey: string
  playbackId: string
  rtmpIngestUrl: string
  hlsPlaybackUrl: string
  thumbnailUrl?: string
}

const StreamerDashboard: React.FC = () => {
  const [streamData, setStreamData] = useState<StreamData | null>(null)
  const [isCreating, setIsCreating] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  
  const [formData, setFormData] = useState({
    title: '',
    slug: ''
  })
  
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null)
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    
    // Auto-generate slug from title
    if (name === 'title') {
      const slug = value
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .trim()
      setFormData(prev => ({
        ...prev,
        slug: slug
      }))
    }
  }

  const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setThumbnailFile(file)
      const reader = new FileReader()
      reader.onload = (e) => {
        setThumbnailPreview(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const uploadThumbnail = async (streamId: string) => {
    if (!thumbnailFile) return null

    try {
      const fileExt = thumbnailFile.name.split('.').pop()
      const fileName = `${streamId}.${fileExt}`
      
      const { data, error } = await supabase.storage
        .from('thumbnails')
        .upload(fileName, thumbnailFile, {
          cacheControl: '3600',
          upsert: true
        })

      if (error) throw error

      const { data: { publicUrl } } = supabase.storage
        .from('thumbnails')
        .getPublicUrl(fileName)

      return publicUrl
    } catch (error) {
      console.error('Error uploading thumbnail:', error)
      throw error
    }
  }

  const handleCreateStream = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.title || !formData.slug) {
      setError('Please fill in all required fields')
      return
    }

    try {
      setIsCreating(true)
      setError(null)
      setSuccess(null)

      // Call the API route to create stream (using simple mock for now)
      const response = await fetch('/api/create-stream-simple', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: formData.title,
          slug: formData.slug,
        }),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Failed to create stream')
      }

      // Upload thumbnail if provided
      let thumbnailUrl = null
      if (thumbnailFile) {
        setIsUploading(true)
        try {
          thumbnailUrl = await uploadThumbnail(result.stream.id)
        } catch (uploadError) {
          console.error('Thumbnail upload failed:', uploadError)
        } finally {
          setIsUploading(false)
        }
      }

      // Update local state with stream data
      setStreamData({
        id: result.stream.id,
        title: result.stream.title,
        slug: result.stream.slug,
        streamKey: result.stream.streamKey,
        playbackId: result.stream.playbackId,
        rtmpIngestUrl: result.stream.ingestUrl,
        hlsPlaybackUrl: result.stream.playbackUrl,
        thumbnailUrl: thumbnailUrl || undefined
      })

      setSuccess('Stream created successfully!')
      
      // Reset form
      setFormData({ title: '', slug: '' })
      setThumbnailFile(null)
      setThumbnailPreview(null)
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }

    } catch (error) {
      console.error('Error:', error)
      setError(error instanceof Error ? error.message : 'An unexpected error occurred')
    } finally {
      setIsCreating(false)
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    setSuccess('Copied to clipboard!')
    setTimeout(() => setSuccess(null), 2000)
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Streamer Dashboard</h1>
        
        {error && (
          <div className="mb-6 p-4 bg-red-900 border border-red-700 rounded text-red-200">
            {error}
          </div>
        )}
        
        {success && (
          <div className="mb-6 p-4 bg-green-900 border border-green-700 rounded text-green-200">
            {success}
          </div>
        )}

        {/* Create Stream Form */}
        {!streamData && (
          <div className="bg-gray-800 rounded-lg p-6 mb-8">
            <h2 className="text-xl font-semibold mb-4">Create New Stream</h2>
            
            <form onSubmit={handleCreateStream} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Stream Title *
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="Enter stream title"
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Stream Slug *
                </label>
                <input
                  type="text"
                  name="slug"
                  value={formData.slug}
                  onChange={handleInputChange}
                  placeholder="stream-slug"
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Thumbnail (optional)
                </label>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleThumbnailChange}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-700"
                />
                {thumbnailPreview && (
                  <div className="mt-2">
                    <img
                      src={thumbnailPreview}
                      alt="Thumbnail preview"
                      className="w-32 h-20 object-cover rounded"
                    />
                  </div>
                )}
              </div>

              <button
                type="submit"
                disabled={isCreating || isUploading}
                className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
              >
                {isCreating ? 'Creating Stream...' : 
                 isUploading ? 'Uploading Thumbnail...' : 'Create Stream'}
              </button>
            </form>
          </div>
        )}

        {/* Stream Configuration */}
        {streamData && (
          <div className="space-y-6">
            <div className="bg-gray-800 rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4">Stream Configuration</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    RTMP Ingest URL
                  </label>
                  <div className="flex">
                    <input
                      type="text"
                      value={streamData.rtmpIngestUrl}
                      readOnly
                      className="flex-1 px-3 py-2 bg-gray-700 border border-gray-600 rounded-l-lg text-white"
                    />
                    <button
                      onClick={() => copyToClipboard(streamData.rtmpIngestUrl)}
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-r-lg"
                    >
                      Copy
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Stream Key
                  </label>
                  <div className="flex">
                    <input
                      type="text"
                      value={streamData.streamKey}
                      readOnly
                      className="flex-1 px-3 py-2 bg-gray-700 border border-gray-600 rounded-l-lg text-white"
                    />
                    <button
                      onClick={() => copyToClipboard(streamData.streamKey)}
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-r-lg"
                    >
                      Copy
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Playback URL
                  </label>
                  <div className="flex">
                    <input
                      type="text"
                      value={streamData.hlsPlaybackUrl}
                      readOnly
                      className="flex-1 px-3 py-2 bg-gray-700 border border-gray-600 rounded-l-lg text-white"
                    />
                    <button
                      onClick={() => copyToClipboard(streamData.hlsPlaybackUrl)}
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-r-lg"
                    >
                      Copy
                    </button>
                  </div>
                </div>
              </div>

              <div className="mt-6 p-4 bg-blue-900 border border-blue-700 rounded">
                <h3 className="text-lg font-semibold mb-2">OBS Studio Setup</h3>
                <div className="text-sm text-blue-200 space-y-2">
                  <p>1. Open OBS Studio</p>
                  <p>2. Go to Settings → Stream</p>
                  <p>3. Set Service to "Custom"</p>
                  <p>4. Set Server to: <code className="bg-blue-800 px-1 rounded">{streamData.rtmpIngestUrl}</code></p>
                  <p>5. Set Stream Key to: <code className="bg-blue-800 px-1 rounded">{streamData.streamKey}</code></p>
                  <p>6. Click "Start Streaming"</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tipping Section */}
        {streamData && (
          <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Direct TipJar */}
            <TipJar
              streamId={streamData.id}
              streamerName={streamData.title}
              className="w-full"
            />

            {/* Cross-Chain Tipping */}
            <CrossChainTip
              streamerAddress="0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6" // Replace with actual streamer address
              streamerName={streamData.title}
              className="w-full"
            />
          </div>
        )}
      </div>
    </div>
  )
}

export default StreamerDashboard
