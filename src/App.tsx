import { useState, useEffect } from 'react'
import { User, Club } from './types'
import Login from './pages/Login'
import Home from './pages/Home'
import Events from './pages/Events'
import EventDetail from './pages/EventDetail'
import CreateEvent from './pages/CreateEvent'
import Clubs from './pages/Clubs'
import ClubDetail from './pages/ClubDetail'
import ClubSettings from './pages/ClubSettings'
import Messages from './pages/Messages'
import Profile from './pages/Profile'
import MapView from './pages/MapView'
import Trending from './pages/Trending'
import Saved from './pages/Saved'
import Nearby from './pages/Nearby'
import { MyEventsPage } from './pages/MyEvents'
import { ClubAdminRequestsPage } from './pages/ClubAdminRequests'
import { EventManagementPage } from './pages/EventManagement'
import { LogOut, Home as HomeIcon, Calendar, Users, MessageSquare, User as UserIcon, Map } from 'lucide-react'
import { mockEvents } from './mockData'
import { Event } from './types'

type Page = 'home' | 'events' | 'event-detail' | 'create-event' | 'clubs' | 'club-detail' | 'club-settings' | 'messages' | 'profile' | 'map' | 'trending' | 'saved' | 'nearby' | 'my-events' | 'club-admin-requests' | 'event-management'

export default function App() {
  const [user, setUser] = useState<User | null>(null)
  const [currentPage, setCurrentPage] = useState<Page>('home')
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null)
  const [selectedClubId, setSelectedClubId] = useState<string | null>(null)
  const [selectedClub, setSelectedClub] = useState<Club | null>(null)
  const [events, setEvents] = useState<Event[]>(mockEvents)
  const [selectedClubChatId, setSelectedClubChatId] = useState<string | null>(null)
  const [selectedClubChatName, setSelectedClubChatName] = useState<string | null>(null)
  const [selectedIndividualChatId, setSelectedIndividualChatId] = useState<string | null>(null)
  const [selectedIndividualChatName, setSelectedIndividualChatName] = useState<string | null>(null)
  const [selectedIndividualChatUserId, setSelectedIndividualChatUserId] = useState<string | null>(null)
  const [joinedEventIds, setJoinedEventIds] = useState<string[]>(() => {
    const stored = localStorage.getItem('joinedEventIds')
    return stored ? JSON.parse(stored) : []
  })

  // Persist joinedEventIds to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('joinedEventIds', JSON.stringify(joinedEventIds))
  }, [joinedEventIds])

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) {
      // Try to restore user session
      const savedUser = localStorage.getItem('user')
      if (savedUser) {
        setUser(JSON.parse(savedUser))
      }
    }
  }, [])

  const handleLoginSuccess = (userData: User) => {
    setUser(userData)
    localStorage.setItem('user', JSON.stringify(userData))
    setCurrentPage('home')
  }

  const handleLogout = () => {
    setUser(null)
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setCurrentPage('home')
  }

  const navigateToEventDetail = (eventId: string) => {
    setSelectedEventId(eventId)
    setCurrentPage('event-detail')
  }

  const navigateToClubDetail = (clubId: string) => {
    setSelectedClubId(clubId)
    setCurrentPage('club-detail')
  }

  const handleEventCreated = (newEvent: Event) => {
    setEvents([...events, newEvent])
  }

  if (!user) {
    return <Login onLoginSuccess={handleLoginSuccess} />
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-white border-b border-border sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-white font-bold">⚽</span>
            </div>
            <h1 className="text-2xl font-bold text-foreground hidden sm:inline">Sports Social</h1>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted">Welcome, {user.name}</span>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 bg-error/10 text-error rounded-lg hover:bg-error/20 transition"
            >
              <LogOut size={18} />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {currentPage === 'home' && (
          <Home
            user={user}
            joinedEventIds={joinedEventIds}
            onJoinEvent={(eventId) => setJoinedEventIds([...joinedEventIds, eventId])}
            onLeaveEvent={(eventId) => setJoinedEventIds(joinedEventIds.filter(id => id !== eventId))}
            onNavigate={(page) => {
              if (page === 'events') setCurrentPage('events')
              else if (page === 'clubs') setCurrentPage('clubs')
              else if (page === 'map') setCurrentPage('map')
              else if (page === 'messages') setCurrentPage('messages')
              else if (page === 'profile') setCurrentPage('profile')
              else if (page === 'trending') setCurrentPage('trending')
              else if (page === 'saved') setCurrentPage('saved')
              else if (page === 'nearby') setCurrentPage('nearby')
              else if (page === 'create-event') setCurrentPage('create-event')
            }}
            onEventDetails={navigateToEventDetail}
          />
        )}
        {currentPage === 'events' && <Events onSelectEvent={navigateToEventDetail} onCreateEvent={() => setCurrentPage('create-event')} onEventManagement={() => setCurrentPage('event-management')} />}
        {currentPage === 'event-detail' && selectedEventId && (
          <EventDetail
            eventId={selectedEventId}
            user={user}
            joinedEventIds={joinedEventIds}
            onJoinEvent={(eventId) => setJoinedEventIds([...joinedEventIds, eventId])}
            onLeaveEvent={(eventId) => setJoinedEventIds(joinedEventIds.filter(id => id !== eventId))}
            onBack={() => setCurrentPage('events')}
            onEventUpdate={(updatedEvent) => {
              setEvents(events.map(e => e.id === updatedEvent.id ? updatedEvent : e))
            }}
            onMessageOrganizer={(organizerId, organizerName) => {
              // Create or open chat with organizer
              console.log('onMessageOrganizer called:', organizerId, organizerName)
              setSelectedIndividualChatId(`chat_${organizerId}`)
              setSelectedIndividualChatName(organizerName)
              setSelectedIndividualChatUserId(organizerId)
              setCurrentPage('messages')
            }}
          />
        )}
        {currentPage === 'create-event' && (
          <CreateEvent onBack={() => setCurrentPage('events')} user={user} onEventCreated={handleEventCreated} />
        )}
        {currentPage === 'map' && <MapView onSelectEvent={navigateToEventDetail} />}
        {currentPage === 'clubs' && <Clubs onSelectClub={navigateToClubDetail} onClubAdmin={() => setCurrentPage('club-admin-requests')} />}
        {currentPage === 'club-detail' && selectedClubId && (
          <ClubDetail
            clubId={selectedClubId}
            user={user}
            onBack={() => setCurrentPage('clubs')}
            onClubChat={(clubId, clubName) => {
              console.log('onClubChat called:', clubId, clubName)
              setSelectedClubChatId(clubId)
              setSelectedClubChatName(clubName)
              setCurrentPage('messages')
              console.log('State after setting:', { clubId, clubName })
            }}
          />
        )}
        {currentPage === 'club-settings' && selectedClub && (
          <ClubSettings
            club={selectedClub}
            user={user}
            onBack={() => setCurrentPage('club-detail')}
            onUpdateClub={(updatedClub) => {
              setSelectedClub(updatedClub)
              alert('Club settings updated successfully!')
            }}
          />
        )}
        {currentPage === 'messages' && (
          <Messages
            user={user}
            selectedClubChatId={selectedClubChatId}
            selectedClubChatName={selectedClubChatName}
            selectedIndividualChatId={selectedIndividualChatId}
            selectedIndividualChatName={selectedIndividualChatName}
            selectedIndividualChatUserId={selectedIndividualChatUserId}
          />
        )}
        {currentPage === 'profile' && <Profile user={user} onLogout={handleLogout} />}
        {currentPage === 'trending' && <Trending onEventDetails={navigateToEventDetail} onClubDetails={navigateToClubDetail} />}
        {currentPage === 'saved' && <Saved onEventDetails={navigateToEventDetail} onClubDetails={navigateToClubDetail} />}
        {currentPage === 'nearby' && <Nearby onEventDetails={navigateToEventDetail} onClubDetails={navigateToClubDetail} />}
        {currentPage === 'my-events' && <MyEventsPage onBack={() => setCurrentPage('home')} />}
        {currentPage === 'club-admin-requests' && <ClubAdminRequestsPage onBack={() => setCurrentPage('clubs')} />}
        {currentPage === 'event-management' && <EventManagementPage onBack={() => setCurrentPage('events')} />}
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-around">
          <button
            onClick={() => {
              setCurrentPage('home')
              setSelectedEventId(null)
              setSelectedClubId(null)
              setSelectedClub(null)
            }}
            className={`flex flex-col items-center gap-1 py-4 px-4 transition ${
              currentPage === 'home'
                ? 'text-primary border-t-2 border-primary'
                : 'text-muted hover:text-foreground'
            }`}
          >
            <HomeIcon size={24} />
            <span className="text-xs">Home</span>
          </button>
          <button
            onClick={() => setCurrentPage('events')}
            className={`flex flex-col items-center gap-1 py-4 px-4 transition ${
              currentPage === 'events'
                ? 'text-primary border-t-2 border-primary'
                : 'text-muted hover:text-foreground'
            }`}
          >
            <Calendar size={24} />
            <span className="text-xs">Events</span>
          </button>
          <button
            onClick={() => setCurrentPage('clubs')}
            className={`flex flex-col items-center gap-1 py-4 px-4 transition ${
              currentPage === 'clubs'
                ? 'text-primary border-t-2 border-primary'
                : 'text-muted hover:text-foreground'
            }`}
          >
            <Users size={24} />
            <span className="text-xs">Clubs</span>
          </button>
          <button
            onClick={() => setCurrentPage('messages')}
            className={`flex flex-col items-center gap-1 py-4 px-4 transition ${
              currentPage === 'messages'
                ? 'text-primary border-t-2 border-primary'
                : 'text-muted hover:text-foreground'
            }`}
          >
            <MessageSquare size={24} />
            <span className="text-xs">Messages</span>
          </button>
          <button
            onClick={() => setCurrentPage('map')}
            className={`flex flex-col items-center gap-1 py-4 px-4 transition ${
              currentPage === 'map'
                ? 'text-primary border-t-2 border-primary'
                : 'text-muted hover:text-foreground'
            }`}
          >
            <Map size={24} />
            <span className="text-xs">Map</span>
          </button>
          <button
            onClick={() => setCurrentPage('profile')}
            className={`flex flex-col items-center gap-1 py-4 px-4 transition ${
              currentPage === 'profile'
                ? 'text-primary border-t-2 border-primary'
                : 'text-muted hover:text-foreground'
            }`}
          >
            <UserIcon size={24} />
            <span className="text-xs">Profile</span>
          </button>
        </div>
      </nav>

      {/* Padding for bottom nav */}
      <div className="h-24" />
    </div>
  )
}
