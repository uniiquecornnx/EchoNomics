import React, { useState, useRef } from 'react'
import { supabase } from '../../lib/supabaseClient'
import CrossChainTip from '../../components/CrossChainTip'
import TipJar from '../../components/TipJar'

interface StreamData {
  id: string
  title: string
  slug: string
  ingestUrl: string
  streamKey: string
  playbackUrl: string
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
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setError('Please select an image file')
        return
      }
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError('Image must be smaller than 5MB')
        return
      }
      
      setThumbnailFile(file)
      
      // Create preview
      const reader = new FileReader()
      reader.onload = (e) => {
        setThumbnailPreview(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const uploadThumbnail = async (streamId: string): Promise<string | null> => {
    if (!thumbnailFile) return null

    try {
      const fileExt = thumbnailFile.name.split('.').pop()
      const fileName = `${streamId}-thumbnail.${fileExt}`
      const filePath = `thumbnails/${fileName}`

      const { error: uploadError } = await supabase.storage
        .from('stream-assets')
        .upload(filePath, thumbnailFile, {
          cacheControl: '3600',
          upsert: false
        })

      if (uploadError) {
        console.error('Upload error:', uploadError)
        return null
      }

      const { data } = supabase.storage
        .from('stream-assets')
        .getPublicUrl(filePath)

      return data.publicUrl
    } catch (error) {
      console.error('Error uploading thumbnail:', error)
      return null
    }
  }

  const createStream = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSuccess(null)
    setIsCreating(true)

    try {
      // Create stream via API
      const response = await fetch('/api/create-stream', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: formData.title,
          slug: formData.slug
        })
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Failed to create stream')
      }

      let thumbnailUrl = null
      
      // Upload thumbnail if provided
      if (thumbnailFile) {
        setIsUploading(true)
        thumbnailUrl = await uploadThumbnail(result.stream.id)
        setIsUploading(false)
      }

      setStreamData({
        id: result.stream.id,
        title: result.stream.title,
        slug: result.stream.slug,
        ingestUrl: result.stream.ingestUrl,
        streamKey: result.stream.streamKey,
        playbackUrl: result.stream.playbackUrl,
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
      console.error('Error creating stream:', error)
      setError(error instanceof Error ? error.message : 'Failed to create stream')
    } finally {
      setIsCreating(false)
    }
  }

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setSuccess(`${label} copied to clipboard!`)
      setTimeout(() => setSuccess(null), 3000)
    }).catch(() => {
      setError('Failed to copy to clipboard')
    })
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Streamer Dashboard</h1>
        
        {/* Success/Error Messages */}
        {success && (
          <div className="mb-6 p-4 bg-green-600 text-white rounded-lg">
            {success}
          </div>
        )}
        
        {error && (
          <div className="mb-6 p-4 bg-red-600 text-white rounded-lg">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Create Stream Form */}
          <div className="bg-gray-800 rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-6">Create New Stream</h2>
            
            <form onSubmit={createStream} className="space-y-6">
              <div>
                <label htmlFor="title" className="block text-sm font-medium mb-2">
                  Stream Title *
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-blue-500"
                  placeholder="Enter stream title"
                />
              </div>

              <div>
                <label htmlFor="slug" className="block text-sm font-medium mb-2">
                  Stream Slug *
                </label>
                <input
                  type="text"
                  id="slug"
                  name="slug"
                  value={formData.slug}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-blue-500"
                  placeholder="stream-slug"
                />
                <p className="text-xs text-gray-400 mt-1">
                  This will be used in the stream URL
                </p>
              </div>

              <div>
                <label htmlFor="thumbnail" className="block text-sm font-medium mb-2">
                  Thumbnail (Optional)
                </label>
                <input
                  ref={fileInputRef}
                  type="file"
                  id="thumbnail"
                  accept="image/*"
                  onChange={handleThumbnailChange}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-blue-500"
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
                <p className="text-xs text-gray-400 mt-1">
                  Max 5MB, JPG/PNG recommended
                </p>
              </div>

              <button
                type="submit"
                disabled={isCreating || isUploading || !formData.title || !formData.slug}
                className="w-full py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isCreating ? 'Creating Stream...' : 
                 isUploading ? 'Uploading Thumbnail...' : 
                 'Create Stream'}
              </button>
            </form>
          </div>

          {/* OBS Settings */}
          {streamData && (
            <div className="bg-gray-800 rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-6">OBS Settings</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    RTMP Ingest URL
                  </label>
                  <div className="flex">
                    <input
                      type="text"
                      value={streamData.ingestUrl}
                      readOnly
                      className="flex-1 px-3 py-2 bg-gray-700 border border-gray-600 rounded-l-lg focus:outline-none"
                    />
                    <button
                      onClick={() => copyToClipboard(streamData.ingestUrl, 'RTMP URL')}
                      className="px-3 py-2 bg-blue-600 hover:bg-blue-700 rounded-r-lg transition-colors"
                    >
                      Copy
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Stream Key
                  </label>
                  <div className="flex">
                    <input
                      type="text"
                      value={streamData.streamKey}
                      readOnly
                      className="flex-1 px-3 py-2 bg-gray-700 border border-gray-600 rounded-l-lg focus:outline-none"
                    />
                    <button
                      onClick={() => copyToClipboard(streamData.streamKey, 'Stream Key')}
                      className="px-3 py-2 bg-blue-600 hover:bg-blue-700 rounded-r-lg transition-colors"
                    >
                      Copy
                    </button>
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-700">
                  <h3 className="font-medium mb-2">OBS Setup Instructions:</h3>
                  <ol className="text-sm text-gray-300 space-y-1">
                    <li>1. Open OBS Studio</li>
                    <li>2. Go to Settings → Stream</li>
                    <li>3. Set Service to "Custom"</li>
                    <li>4. Paste the RTMP URL above</li>
                    <li>5. Paste the Stream Key above</li>
                    <li>6. Click "OK" and start streaming!</li>
                  </ol>
                </div>

                <div className="pt-4 border-t border-gray-700">
                  <h3 className="font-medium mb-2">Stream Info:</h3>
                  <div className="text-sm text-gray-300 space-y-1">
                    <p><strong>Title:</strong> {streamData.title}</p>
                    <p><strong>Slug:</strong> {streamData.slug}</p>
                    <p><strong>Playback URL:</strong> 
                      <a 
                        href={streamData.playbackUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-400 hover:text-blue-300 ml-1"
                      >
                        View Stream
                      </a>
                    </p>
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
    </div>
  )
}

export default StreamerDashboard
