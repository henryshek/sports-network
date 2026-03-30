import { useState } from 'react'
import { mockUsers } from '@/mockData'
import { User } from '@/types'

interface Message {
  id: string
  senderId: string
  text: string
  timestamp: string
}

interface ChatRoom {
  id: string
  participantId: string
  participantName: string
  messages: Message[]
  lastMessage?: string
}

interface MessagesProps {
  user?: User
}

export default function Messages({}: MessagesProps) {
  const [chats, setChats] = useState<ChatRoom[]>([
    {
      id: 'chat_1',
      participantId: 'user2',
      participantName: 'Alice Johnson',
      messages: [
        { id: '1', senderId: 'user2', text: 'Hey! Want to play basketball?', timestamp: '10:30 AM' },
        { id: '2', senderId: 'user1', text: 'Sure! When?', timestamp: '10:32 AM' },
        { id: '3', senderId: 'user2', text: 'Tomorrow at 6 PM at the park', timestamp: '10:33 AM' },
      ],
      lastMessage: 'Tomorrow at 6 PM at the park',
    },
    {
      id: 'chat_2',
      participantId: 'user3',
      participantName: 'Bob Smith',
      messages: [
        { id: '1', senderId: 'user3', text: 'Are you coming to the tennis match?', timestamp: '9:15 AM' },
        { id: '2', senderId: 'user1', text: 'Yes, I will be there!', timestamp: '9:20 AM' },
      ],
      lastMessage: 'Yes, I will be there!',
    },
  ])

  const [selectedChat, setSelectedChat] = useState<ChatRoom | null>(chats[0])
  const [messageText, setMessageText] = useState('')
  const [showNewChat, setShowNewChat] = useState(false)

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedChat || !messageText.trim()) return

    const newMessage: Message = {
      id: `msg_${Date.now()}`,
      senderId: 'user1',
      text: messageText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    }

    const updatedChat = {
      ...selectedChat,
      messages: [...selectedChat.messages, newMessage],
      lastMessage: messageText,
    }

    setChats(chats.map(c => (c.id === selectedChat.id ? updatedChat : c)))
    setSelectedChat(updatedChat)
    setMessageText('')
  }

  const handleStartNewChat = (userId: string) => {
    const user = mockUsers[userId as keyof typeof mockUsers]
    if (!user) return

    const existingChat = chats.find(c => c.participantId === userId)
    if (existingChat) {
      setSelectedChat(existingChat)
      setShowNewChat(false)
      return
    }

    const newChat: ChatRoom = {
      id: `chat_${Date.now()}`,
      participantId: userId,
      participantName: user.name,
      messages: [],
    }

    setChats([...chats, newChat])
    setSelectedChat(newChat)
    setShowNewChat(false)
  }

  return (
    <div className="flex h-screen bg-background pb-24 md:pb-0">
      {/* Chat List */}
      <div className="w-full md:w-80 border-r border-border bg-surface flex flex-col">
        <div className="p-4 border-b border-border flex items-center justify-between">
          <h2 className="text-xl font-bold text-foreground">Messages</h2>
          <button
            onClick={() => setShowNewChat(!showNewChat)}
            className="p-2 hover:bg-background rounded-lg transition"
          >
            ✏️
          </button>
        </div>

        {/* New Chat Modal */}
        {showNewChat && (
          <div className="p-4 border-b border-border bg-background">
            <h3 className="font-semibold text-foreground mb-3">Start a conversation</h3>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {Object.entries(mockUsers)
                .filter(([id]) => id !== 'user1')
                .map(([userId, userData]) => (
                  <button
                    key={userId}
                    onClick={() => handleStartNewChat(userId)}
                    className="w-full text-left p-3 hover:bg-surface rounded-lg transition"
                  >
                    <p className="font-medium text-foreground">{userData.name}</p>
                    <p className="text-sm text-muted">{userData.sports?.join(', ') || 'Athlete'}</p>
                  </button>
                ))}
            </div>
          </div>
        )}

        {/* Chat List */}
        <div className="flex-1 overflow-y-auto">
          {chats.length > 0 ? (
            chats.map(chat => (
              <button
                key={chat.id}
                onClick={() => setSelectedChat(chat)}
                className={`w-full text-left p-4 border-b border-border hover:bg-background transition ${
                  selectedChat?.id === chat.id ? 'bg-background' : ''
                }`}
              >
                <p className="font-semibold text-foreground">{chat.participantName}</p>
                <p className="text-sm text-muted line-clamp-1">{chat.lastMessage || 'No messages yet'}</p>
              </button>
            ))
          ) : (
            <div className="p-4 text-center text-muted">
              <p>No conversations yet</p>
              <button
                onClick={() => setShowNewChat(true)}
                className="mt-2 text-primary hover:underline text-sm"
              >
                Start a conversation
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Chat Window */}
      <div className="hidden md:flex flex-1 flex-col">
        {selectedChat ? (
          <>
            {/* Header */}
            <div className="p-4 border-b border-border bg-surface flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center font-bold">
                {selectedChat.participantName[0]}
              </div>
              <div>
                <p className="font-semibold text-foreground">{selectedChat.participantName}</p>
                <p className="text-xs text-muted">Online</p>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {selectedChat.messages.map(msg => (
                <div
                  key={msg.id}
                  className={`flex ${msg.senderId === 'user1' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-xs px-4 py-2 rounded-lg ${
                      msg.senderId === 'user1'
                        ? 'bg-primary text-white'
                        : 'bg-surface text-foreground border border-border'
                    }`}
                  >
                    <p className="text-sm">{msg.text}</p>
                    <p className={`text-xs mt-1 ${msg.senderId === 'user1' ? 'text-white/70' : 'text-muted'}`}>
                      {msg.timestamp}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Input */}
            <form onSubmit={handleSendMessage} className="p-4 border-t border-border bg-surface flex gap-2">
              <input
                type="text"
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
                placeholder="Type a message..."
                className="flex-1 px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <button
                type="submit"
                className="px-6 py-2 bg-primary text-white rounded-lg hover:opacity-90 transition"
              >
                Send
              </button>
            </form>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-muted">
            <p>Select a conversation to start messaging</p>
          </div>
        )}
      </div>

      {/* Mobile Chat View */}
      <div className="md:hidden flex-1 flex flex-col">
        {selectedChat ? (
          <>
            {/* Header */}
            <div className="p-4 border-b border-border bg-surface flex items-center gap-3">
              <button
                onClick={() => setSelectedChat(null)}
                className="text-primary hover:opacity-70"
              >
                ← Back
              </button>
              <div className="flex-1">
                <p className="font-semibold text-foreground">{selectedChat.participantName}</p>
                <p className="text-xs text-muted">Online</p>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {selectedChat.messages.map(msg => (
                <div
                  key={msg.id}
                  className={`flex ${msg.senderId === 'user1' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-xs px-4 py-2 rounded-lg ${
                      msg.senderId === 'user1'
                        ? 'bg-primary text-white'
                        : 'bg-surface text-foreground border border-border'
                    }`}
                  >
                    <p className="text-sm">{msg.text}</p>
                    <p className={`text-xs mt-1 ${msg.senderId === 'user1' ? 'text-white/70' : 'text-muted'}`}>
                      {msg.timestamp}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Input */}
            <form onSubmit={handleSendMessage} className="p-4 border-t border-border bg-surface flex gap-2">
              <input
                type="text"
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
                placeholder="Type a message..."
                className="flex-1 px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-primary text-white rounded-lg hover:opacity-90 transition"
              >
                Send
              </button>
            </form>
          </>
        ) : (
          <div className="flex-1 flex flex-col">
            <div className="p-4 border-b border-border bg-surface flex items-center justify-between">
              <h2 className="text-xl font-bold text-foreground">Messages</h2>
              <button
                onClick={() => setShowNewChat(!showNewChat)}
                className="p-2 hover:bg-background rounded-lg transition"
              >
                ✏️
              </button>
            </div>
            {showNewChat && (
              <div className="p-4 border-b border-border bg-background">
                <h3 className="font-semibold text-foreground mb-3">Start a conversation</h3>
                <div className="space-y-2">
                  {Object.entries(mockUsers)
                    .filter(([id]) => id !== 'user1')
                    .map(([userId, userData]) => (
                      <button
                        key={userId}
                        onClick={() => handleStartNewChat(userId)}
                        className="w-full text-left p-3 hover:bg-surface rounded-lg transition"
                      >
                        <p className="font-medium text-foreground">{userData.name}</p>
                        <p className="text-sm text-muted">{userData.sports?.join(', ') || 'Athlete'}</p>
                      </button>
                    ))}
                </div>
              </div>
            )}
            <div className="flex-1 overflow-y-auto">
              {chats.map(chat => (
                <button
                  key={chat.id}
                  onClick={() => setSelectedChat(chat)}
                  className="w-full text-left p-4 border-b border-border hover:bg-background transition"
                >
                  <p className="font-semibold text-foreground">{chat.participantName}</p>
                  <p className="text-sm text-muted line-clamp-1">{chat.lastMessage || 'No messages yet'}</p>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
