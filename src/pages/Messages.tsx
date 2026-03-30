import { useState, useEffect } from 'react'
import { Send, Plus } from 'lucide-react'
import { Chat, User } from '@/types'
import { messageApi } from '@/api'

interface MessagesProps {
  user: User
}

export default function Messages({ user }: MessagesProps) {
  const [chats, setChats] = useState<Chat[]>([])
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null)
  const [messageText, setMessageText] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchChats = async () => {
      try {
        const response = await messageApi.getChats()
        setChats(response.data)
        if (response.data.length > 0) {
          setSelectedChat(response.data[0])
        }
      } catch (error) {
        console.error('Failed to fetch chats:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchChats()
  }, [])

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedChat || !messageText.trim()) return

    try {
      await messageApi.sendMessage(selectedChat.id, messageText)
      setMessageText('')
      // Refresh chat
      const response = await messageApi.getChat(selectedChat.id)
      setSelectedChat(response.data)
    } catch (error) {
      console.error('Failed to send message:', error)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-muted">Loading messages...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto h-screen flex">
        {/* Chat List */}
        <div className="w-full md:w-80 bg-surface border-r border-border flex flex-col">
          <div className="p-4 border-b border-border flex justify-between items-center">
            <h2 className="text-xl font-bold text-foreground">Messages</h2>
            <button className="p-2 hover:bg-background rounded-lg transition">
              <Plus size={20} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto">
            {chats.length === 0 ? (
              <div className="p-4 text-center text-muted">
                <p>No conversations yet</p>
              </div>
            ) : (
              chats.map(chat => (
                <button
                  key={chat.id}
                  onClick={() => setSelectedChat(chat)}
                  className={`w-full p-4 border-b border-border text-left transition ${
                    selectedChat?.id === chat.id
                      ? 'bg-primary/10 border-l-4 border-l-primary'
                      : 'hover:bg-background'
                  }`}
                >
                  <p className="font-semibold text-foreground">{chat.name || 'Direct Message'}</p>
                  <p className="text-sm text-muted truncate">
                    {chat.messages[chat.messages.length - 1]?.content || 'No messages yet'}
                  </p>
                </button>
              ))
            )}
          </div>
        </div>

        {/* Chat View */}
        <div className="hidden md:flex flex-1 flex-col">
          {selectedChat ? (
            <>
              {/* Chat Header */}
              <div className="p-4 border-b border-border bg-surface">
                <h3 className="text-lg font-semibold text-foreground">{selectedChat.name || 'Direct Message'}</h3>
                <p className="text-sm text-muted">{selectedChat.participants.length} participants</p>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {selectedChat.messages.length === 0 ? (
                  <div className="text-center text-muted py-8">
                    <p>No messages yet. Start the conversation!</p>
                  </div>
                ) : (
                  selectedChat.messages.map((msg, i) => (
                    <div
                      key={i}
                      className={`flex ${msg.senderId === user.id ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-xs px-4 py-2 rounded-lg ${
                          msg.senderId === user.id
                            ? 'bg-primary text-white'
                            : 'bg-surface border border-border text-foreground'
                        }`}
                      >
                        <p className="text-sm">{msg.content}</p>
                        <p className={`text-xs mt-1 ${msg.senderId === user.id ? 'text-white/70' : 'text-muted'}`}>
                          {new Date(msg.createdAt).toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Message Input */}
              <form onSubmit={handleSendMessage} className="p-4 border-t border-border bg-surface">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={messageText}
                    onChange={(e) => setMessageText(e.target.value)}
                    placeholder="Type a message..."
                    className="flex-1 px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                  <button
                    type="submit"
                    className="bg-primary text-white p-2 rounded-lg hover:opacity-90 transition"
                  >
                    <Send size={20} />
                  </button>
                </div>
              </form>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-muted">
              <p>Select a conversation to start messaging</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
