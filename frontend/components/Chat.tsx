import React, { useState, useEffect, useRef } from 'react'
import { supabase } from '../lib/supabaseClient'

interface ChatMessage {
  id: string
  stream_id: string
  user_id: string
  username: string
  message: string
  created_at: string
}

interface ChatProps {
  streamId: string
  userId: string
  username: string
  className?: string
}

const Chat: React.FC<ChatProps> = ({ 
  streamId, 
  userId, 
  username, 
  className = '' 
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [isSending, setIsSending] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Scroll to bottom when new messages arrive
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // Fetch initial messages
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const { data, error } = await supabase
          .from('chat_messages')
          .select('*')
          .eq('stream_id', streamId)
          .order('created_at', { ascending: true })
          .limit(50)

        if (error) {
          console.error('Error fetching messages:', error)
          return
        }

        setMessages(data || [])
      } catch (error) {
        console.error('Error fetching messages:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchMessages()
  }, [streamId])

  // Set up real-time subscription
  useEffect(() => {
    const channel = supabase
      .channel(`chat-${streamId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'chat_messages',
          filter: `stream_id=eq.${streamId}`
        },
        (payload) => {
          const newMessage = payload.new as ChatMessage
          setMessages(prev => [...prev, newMessage])
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [streamId])

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!newMessage.trim() || isSending) return

    setIsSending(true)

    try {
      const { error } = await supabase
        .from('chat_messages')
        .insert([
          {
            stream_id: streamId,
            user_id: userId,
            username: username,
            message: newMessage.trim()
          }
        ])

      if (error) {
        console.error('Error sending message:', error)
        return
      }

      setNewMessage('')
    } catch (error) {
      console.error('Error sending message:', error)
    } finally {
      setIsSending(false)
    }
  }

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    })
  }

  if (isLoading) {
    return (
      <div className={`flex items-center justify-center h-64 bg-gray-900 rounded ${className}`}>
        <div className="text-white">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white mx-auto mb-2"></div>
          <p className="text-sm">Loading chat...</p>
        </div>
      </div>
    )
  }

  return (
    <div className={`flex flex-col h-96 bg-black border border-green-500 rounded-lg retro-border-glow ${className}`}>
      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {messages.length === 0 ? (
          <div className="text-center text-green-400 py-8 bitcount-normal">
            <p>No messages yet. Start the conversation!</p>
          </div>
        ) : (
          messages.map((message) => (
            <div
              key={message.id}
              className={`flex flex-col ${
                message.user_id === userId ? 'items-end' : 'items-start'
              }`}
            >
              <div
                className={`max-w-xs px-3 py-2 rounded-lg ${
                  message.user_id === userId
                    ? 'bg-gradient-to-r from-green-500 to-cyan-500 text-black bitcount-normal'
                    : 'bg-gray-800 text-green-400 bitcount-normal border border-green-500'
                }`}
              >
                <div className="flex items-center space-x-2 mb-1">
                  <span className="text-xs font-semibold opacity-80">
                    {message.username}
                  </span>
                  <span className="text-xs opacity-60">
                    {formatTime(message.created_at)}
                  </span>
                </div>
                <p className="text-sm">{message.message}</p>
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <form onSubmit={sendMessage} className="p-4 border-t border-green-500">
        <div className="flex space-x-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 px-3 py-2 bg-black text-green-400 rounded-lg border border-green-500 focus:outline-none focus:retro-border-glow bitcount-normal"
            disabled={isSending}
            maxLength={500}
          />
          <button
            type="submit"
            disabled={!newMessage.trim() || isSending}
            className="px-4 py-2 bg-gradient-to-r from-green-500 to-cyan-500 text-black rounded-lg hover:from-green-400 hover:to-cyan-400 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 font-bold retro-glow bitcount-normal"
          >
            {isSending ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
            ) : (
              'Send'
            )}
          </button>
        </div>
      </form>
    </div>
  )
}

export default Chat
