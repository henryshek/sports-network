import { useState, useEffect } from 'react'
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
  type: 'individual' | 'group' | 'announcement'
  participantId?: string
  participantName: string
  groupMembers?: string[]
  messages: Message[]
  lastMessage?: string
  isGroup?: boolean
}

interface MessagesProps {
  user?: User
  selectedClubChatId?: string | null
  selectedClubChatName?: string | null
}

type MessageTab = 'all' | 'individual' | 'group' | 'announcement'

export default function Messages({ user, selectedClubChatId, selectedClubChatName }: MessagesProps) {
  const [chats, setChats] = useState<ChatRoom[]>([
    {
      id: 'chat_1',
      type: 'individual',
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
      type: 'individual',
      participantId: 'user3',
      participantName: 'Bob Smith',
      messages: [
        { id: '1', senderId: 'user3', text: 'Are you coming to the tennis match?', timestamp: '9:15 AM' },
        { id: '2', senderId: 'user1', text: 'Yes, I will be there!', timestamp: '9:20 AM' },
      ],
      lastMessage: 'Yes, I will be there!',
    },
    {
      id: 'group_1',
      type: 'group',
      participantName: 'Basketball Club',
      groupMembers: ['user1', 'user2', 'user3', 'user4'],
      messages: [
        { id: '1', senderId: 'user2', text: 'Game this weekend?', timestamp: '2:15 PM' },
        { id: '2', senderId: 'user3', text: 'Count me in!', timestamp: '2:20 PM' },
      ],
      lastMessage: 'Count me in!',
      isGroup: true,
    },
  ])

  const [selectedChat, setSelectedChat] = useState<ChatRoom | null>(chats[0])
  const [messageText, setMessageText] = useState('')
  const [showNewChat, setShowNewChat] = useState(false)
  const [activeTab, setActiveTab] = useState<MessageTab>('all')

  useEffect(() => {
    if (selectedClubChatId) {
      const clubChat = chats.find(c => c.id === selectedClubChatId)
      if (clubChat) {
        setSelectedChat(clubChat)
      } else {
        // If club chat doesn't exist, create it
        const newClubChat: ChatRoom = {
          id: selectedClubChatId,
          type: 'group',
          participantName: selectedClubChatName || `Club Chat ${selectedClubChatId}`,
          groupMembers: user ? [user.id] : [],
          messages: [],
          isGroup: true,
        }
        setChats([...chats, newClubChat])
        setSelectedChat(newClubChat)
      }
    }
  }, [selectedClubChatId, selectedClubChatName, chats, user])

  const filteredChats = chats.filter(chat => {
    if (activeTab === 'all') return true
    return chat.type === activeTab
  })

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

    const existingChat = chats.find(c => c.type === 'individual' && c.participantId === userId)
    if (existingChat) {
      setSelectedChat(existingChat)
      setShowNewChat(false)
      return
    }

    const newChat: ChatRoom = {
      id: `chat_${Date.now()}`,
      type: 'individual',
      participantId: userId,
      participantName: user.name,
      messages: [],
    }

    setChats([...chats, newChat])
    setSelectedChat(newChat)
    setShowNewChat(false)
  }

  const handleCreateGroupChat = (groupName: string) => {
    const newGroupChat: ChatRoom = {
      id: `group_${Date.now()}`,
      type: 'group',
      participantName: groupName,
      groupMembers: ['user1'],
      messages: [],
      isGroup: true,
    }

    setChats([...chats, newGroupChat])
    setSelectedChat(newGroupChat)
    setShowNewChat(false)
  }

  const handleDeleteChat = (chatId: string) => {
    setChats(chats.filter(c => c.id !== chatId))
    if (selectedChat?.id === chatId) {
      setSelectedChat(null)
    }
  }

  const getChatIcon = (type: string) => {
    switch (type) {
      case 'group':
        return '👥'
      case 'announcement':
        return '📢'
      default:
        return '💬'
    }
  }

  return (
    <div className="flex flex-col h-screen bg-background pb-24 md:pb-0">
      {/* Desktop Layout */}
      <div className="hidden md:flex flex-1 overflow-hidden">
        {/* Chat List Sidebar */}
        <div className="w-80 border-r border-border bg-surface flex flex-col">
          <div className="p-4 border-b border-border">
            <h2 className="text-xl font-bold text-foreground mb-4">Messages</h2>
            
            {/* Tabs */}
            <div className="flex gap-2 mb-4 overflow-x-auto">
              {(['all', 'individual', 'group', 'announcement'] as MessageTab[]).map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-3 py-1 rounded-full text-sm whitespace-nowrap transition ${
                    activeTab === tab
                      ? 'bg-primary text-white'
                      : 'bg-background text-foreground hover:bg-border'
                  }`}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </div>

            <button
              onClick={() => setShowNewChat(!showNewChat)}
              className="w-full py-2 bg-primary text-white rounded-lg hover:opacity-90 transition font-semibold"
            >
              + New Chat
            </button>
          </div>

          {/* New Chat Modal */}
          {showNewChat && (
            <div className="p-4 border-b border-border bg-background">
              <h3 className="font-semibold text-foreground mb-3">Start a conversation</h3>
              <div className="space-y-2 max-h-48 overflow-y-auto mb-4">
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
              <input
                type="text"
                placeholder="Create group chat..."
                onKeyPress={(e) => {
                  if (e.key === 'Enter' && e.currentTarget.value.trim()) {
                    handleCreateGroupChat(e.currentTarget.value)
                    e.currentTarget.value = ''
                  }
                }}
                className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm"
              />
            </div>
          )}

          {/* Chat List */}
          <div className="flex-1 overflow-y-auto">
            {filteredChats.length > 0 ? (
              filteredChats.map(chat => (
                <div
                  key={chat.id}
                  className={`border-b border-border hover:bg-background transition group ${
                    selectedChat?.id === chat.id ? 'bg-background' : ''
                  }`}
                >
                  <button
                    onClick={() => setSelectedChat(chat)}
                    className="w-full text-left p-4"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="text-lg">{getChatIcon(chat.type)}</span>
                          <p className="font-semibold text-foreground">{chat.participantName}</p>
                        </div>
                        <p className="text-sm text-muted line-clamp-1">{chat.lastMessage || 'No messages yet'}</p>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          handleDeleteChat(chat.id)
                        }}
                        className="opacity-0 group-hover:opacity-100 text-red-500 hover:text-red-700 transition text-sm"
                      >
                        ✕
                      </button>
                    </div>
                  </button>
                </div>
              ))
            ) : (
              <div className="p-4 text-center text-muted">
                <p>No {activeTab === 'all' ? 'conversations' : activeTab} yet</p>
              </div>
            )}
          </div>
        </div>

        {/* Chat Window */}
        <div className="flex-1 flex flex-col">
          {selectedChat ? (
            <>
              {/* Header */}
              <div className="p-4 border-b border-border bg-surface flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center font-bold">
                    {selectedChat.participantName[0]}
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">{selectedChat.participantName}</p>
                    <p className="text-xs text-muted">
                      {selectedChat.isGroup ? `${selectedChat.groupMembers?.length || 0} members` : 'Online'}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => handleDeleteChat(selectedChat.id)}
                  className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition"
                  title="Delete chat"
                >
                  🗑️
                </button>
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
      </div>

      {/* Mobile Layout */}
      <div className="md:hidden flex flex-col flex-1 overflow-hidden">
        {selectedChat ? (
          <>
            {/* Header */}
            <div className="p-4 border-b border-border bg-surface flex items-center justify-between">
              <div className="flex items-center gap-3 flex-1">
                <button
                  onClick={() => setSelectedChat(null)}
                  className="text-primary hover:opacity-70 text-lg"
                >
                  ←
                </button>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-foreground truncate">{selectedChat.participantName}</p>
                  <p className="text-xs text-muted">
                    {selectedChat.isGroup ? `${selectedChat.groupMembers?.length || 0} members` : 'Online'}
                  </p>
                </div>
              </div>
              <button
                onClick={() => handleDeleteChat(selectedChat.id)}
                className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition"
                title="Delete chat"
              >
                🗑️
              </button>
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
                placeholder="Message..."
                className="flex-1 px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-primary text-white rounded-lg hover:opacity-90 transition text-sm"
              >
                Send
              </button>
            </form>
          </>
        ) : (
          <>
            {/* Header */}
            <div className="p-4 border-b border-border bg-surface flex items-center justify-between">
              <h2 className="text-xl font-bold text-foreground">Messages</h2>
              <button
                onClick={() => setShowNewChat(!showNewChat)}
                className="p-2 hover:bg-background rounded-lg transition"
              >
                ✏️
              </button>
            </div>

            {/* Tabs */}
            <div className="px-4 pt-3 pb-2 border-b border-border bg-background flex gap-2 overflow-x-auto">
              {(['all', 'individual', 'group', 'announcement'] as MessageTab[]).map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-3 py-1 rounded-full text-sm whitespace-nowrap transition ${
                    activeTab === tab
                      ? 'bg-primary text-white'
                      : 'bg-surface text-foreground'
                  }`}
                >
                  {tab === 'all' ? 'All' : tab === 'individual' ? '1:1' : tab === 'group' ? 'Group' : 'Announce'}
                </button>
              ))}
            </div>

            {/* New Chat Modal */}
            {showNewChat && (
              <div className="p-4 border-b border-border bg-background">
                <h3 className="font-semibold text-foreground mb-3">Start a conversation</h3>
                <div className="space-y-2 max-h-40 overflow-y-auto mb-4">
                  {Object.entries(mockUsers)
                    .filter(([id]) => id !== 'user1')
                    .map(([userId, userData]) => (
                      <button
                        key={userId}
                        onClick={() => handleStartNewChat(userId)}
                        className="w-full text-left p-3 hover:bg-surface rounded-lg transition"
                      >
                        <p className="font-medium text-foreground text-sm">{userData.name}</p>
                        <p className="text-xs text-muted">{userData.sports?.join(', ') || 'Athlete'}</p>
                      </button>
                    ))}
                </div>
                <input
                  type="text"
                  placeholder="Create group chat..."
                  onKeyPress={(e) => {
                    if (e.key === 'Enter' && e.currentTarget.value.trim()) {
                      handleCreateGroupChat(e.currentTarget.value)
                      e.currentTarget.value = ''
                    }
                  }}
                  className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                />
              </div>
            )}

            {/* Chat List */}
            <div className="flex-1 overflow-y-auto">
              {filteredChats.length > 0 ? (
                filteredChats.map(chat => (
                  <div
                    key={chat.id}
                    className="border-b border-border hover:bg-background transition group"
                  >
                    <button
                      onClick={() => setSelectedChat(chat)}
                      className="w-full text-left p-4"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="text-lg">{getChatIcon(chat.type)}</span>
                            <p className="font-semibold text-foreground truncate">{chat.participantName}</p>
                          </div>
                          <p className="text-sm text-muted line-clamp-1">{chat.lastMessage || 'No messages yet'}</p>
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            handleDeleteChat(chat.id)
                          }}
                          className="opacity-0 group-hover:opacity-100 text-red-500 hover:text-red-700 transition text-sm ml-2"
                        >
                          ✕
                        </button>
                      </div>
                    </button>
                  </div>
                ))
              ) : (
                <div className="p-4 text-center text-muted">
                  <p>No {activeTab === 'all' ? 'conversations' : activeTab} yet</p>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
