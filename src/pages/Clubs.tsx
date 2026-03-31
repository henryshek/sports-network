import { useState } from 'react'
import { mockClubs, mockEvents } from '@/mockData'
import { Club } from '@/types'
import { TOP_SPORTS, isTopSport } from '@/constants/sports'
import WeeklyEventsTimeline from '@/components/WeeklyEventsTimeline'

interface ClubsProps {
  onSelectClub: (clubId: string) => void
  onCreateGroupChat?: (groupName: string) => void
  user?: any
}

export default function Clubs({ onSelectClub, onCreateGroupChat }: ClubsProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedSport, setSelectedSport] = useState<string>('')
  const [clubs, setClubs] = useState<Club[]>(() => {
    const savedClubs = localStorage.getItem('clubs')
    return savedClubs ? JSON.parse(savedClubs) : mockClubs
  })
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    sport: 'basketball',
    isPrivate: false,
  })
  const [showCustomSport, setShowCustomSport] = useState(false)
  const [customSportName, setCustomSportName] = useState('')
  const [clubPhoto, setClubPhoto] = useState<string>('')
  const [backgroundPhoto, setBackgroundPhoto] = useState<string>('')
  const [userClubs, setUserClubs] = useState<string[]>(() => {
    const savedUserClubs = localStorage.getItem('userClubs')
    return savedUserClubs ? JSON.parse(savedUserClubs) : ['club1']
  })

  const topSports = TOP_SPORTS.map(s => s.toLowerCase())

  const filteredClubs = clubs.filter(club => {
    const matchesSearch =
      club.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      club.description.toLowerCase().includes(searchQuery.toLowerCase())
    
    let matchesSport = true
    if (selectedSport) {
      if (selectedSport === 'others') {
        matchesSport = !isTopSport(club.sport)
      } else {
        matchesSport = club.sport.toLowerCase() === selectedSport.toLowerCase()
      }
    }
    
    return matchesSearch && matchesSport
  })

  const handleClubPhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setClubPhoto(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleBackgroundPhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setBackgroundPhoto(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleJoinClub = (clubId: string, clubName: string) => {
    // Add club to user's clubs
    const updatedUserClubs = [...userClubs, clubId]
    setUserClubs(updatedUserClubs)
    localStorage.setItem('userClubs', JSON.stringify(updatedUserClubs))
    alert(`You have successfully joined ${clubName}!`)
  }



  const getSportEmoji = (sport: string) => {
    const emojis: Record<string, string> = {
      basketball: '🏀',
      soccer: '⚽',
      tennis: '🎾',
      volleyball: '🏐',
      badminton: '🏸',
      cricket: '🏏',
      running: '🏃',
      cycling: '🚴',
      swimming: '🏊',
      yoga: '🧘',
      pickleball: '🏓',
      others: '🏅',
    }
    return emojis[sport.toLowerCase()] || '⚽'
  }

  const handleCreateClub = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.name || !formData.description) {
      alert('Please fill in all fields')
      return
    }

    const clubSport = showCustomSport ? customSportName : formData.sport
    const newClub: Club = {
      id: `club_${Date.now()}`,
      name: formData.name,
      description: formData.description,
      sport: clubSport as any,
      isPrivate: formData.isPrivate,
      clubPhoto: clubPhoto,
      backgroundPhoto: backgroundPhoto,
      members: ['user1'],
      admins: ['user1'],
      organizers: ['user1'],
      groupChatId: `chat_${Date.now()}`,
      creator: {
        id: 'user1',
        name: 'You',
        email: 'you@example.com',
        avatar: '👤',
        bio: 'Club creator',
        sports: [],
        location: '',
        joinedDate: new Date().toISOString(),
      },
      events: [],
      membershipRequests: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      creatorId: 'user1',
    }

    const updatedClubs = [...clubs, newClub]
    setClubs(updatedClubs)
    
    // Save to localStorage for persistence
    localStorage.setItem('clubs', JSON.stringify(updatedClubs))
    
    // Automatically create a group chat for the club
    if (onCreateGroupChat) {
      onCreateGroupChat(formData.name)
    }
    
    setFormData({ name: '', description: '', sport: 'basketball', isPrivate: false })
    setShowCustomSport(false)
    setCustomSportName('')
    setClubPhoto('')
    setBackgroundPhoto('')
    setShowCreateModal(false)
    alert(`Club created successfully! Group chat "${formData.name}" has been created.`)
  }

  return (
    <div className="space-y-6 pb-24 px-4 md:px-0">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-foreground">Clubs</h1>
        <button
          onClick={() => setShowCreateModal(true)}
          className="bg-primary text-white px-4 py-2 rounded-lg hover:opacity-90 transition"
        >
          + Create Club
        </button>
      </div>

      {/* Search and Filters */}
      <div className="space-y-4">
        <input
          type="text"
          placeholder="Search clubs..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
        />

        <div className="flex gap-2 flex-wrap overflow-x-auto pb-2">
          <button
            onClick={() => setSelectedSport('')}
            className={`px-4 py-2 rounded-full transition whitespace-nowrap font-semibold ${
              !selectedSport ? 'bg-primary text-white' : 'bg-surface text-foreground hover:bg-border'
            }`}
          >
            All Sports
          </button>
          {topSports.map(sport => (
            <button
              key={sport}
              onClick={() => setSelectedSport(sport)}
              className={`px-4 py-2 rounded-full transition capitalize whitespace-nowrap ${
                selectedSport === sport ? 'bg-primary text-white' : 'bg-surface text-foreground hover:bg-border'
              }`}
            >
              {getSportEmoji(sport)} {sport}
            </button>
          ))}
          <button
            onClick={() => setSelectedSport('others')}
            className={`px-4 py-2 rounded-full transition whitespace-nowrap ${
              selectedSport === 'others' ? 'bg-primary text-white' : 'bg-surface text-foreground hover:bg-border'
            }`}
          >
            🏅 Others
          </button>
        </div>
      </div>

      {/* Clubs Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredClubs.length > 0 ? (
          filteredClubs.map(club => (
            <div
              key={club.id}
              className="bg-white rounded-lg border border-border overflow-hidden hover:shadow-lg transition"
            >
              {/* Header with Background Photo */}
              <div
                className="bg-gradient-to-r from-primary/20 to-primary/10 p-6 h-32 flex items-end bg-cover bg-center relative"
                style={club.backgroundPhoto ? { backgroundImage: `url(${club.backgroundPhoto})` } : {}}
              >
                <div className="absolute inset-0 bg-black/20"></div>
                <div className="relative z-10 flex items-center gap-3">
                  {club.clubPhoto ? (
                    <img
                      src={club.clubPhoto}
                      alt={club.name}
                      className="w-12 h-12 rounded-full object-cover border-2 border-white"
                    />
                  ) : (
                    <span className="text-4xl">{getSportEmoji(club.sport)}</span>
                  )}
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <h3 className="text-lg font-semibold text-foreground mb-2 line-clamp-2">{club.name}</h3>
                <p className="text-sm text-muted mb-4 line-clamp-2">{club.description}</p>

                {/* Stats */}
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2 text-muted">
                    <span>👥</span>
                    <span>{club.members.length} members</span>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      club.isPrivate ? 'bg-warning/10 text-warning' : 'bg-success/10 text-success'
                    }`}
                  >
                    {club.isPrivate ? 'Private' : 'Public'}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2 p-6 border-t border-border">
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    onSelectClub(club.id)
                  }}
                  className="flex-1 bg-primary text-white py-2 rounded-lg hover:bg-primary/90 transition font-semibold text-sm"
                >
                  View Club
                </button>
                {userClubs.includes(club.id) ? (
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      if (onCreateGroupChat) {
                        onCreateGroupChat(club.name)
                      }
                      alert(`Opening chat for ${club.name}...`)
                    }}
                    className="flex-1 bg-success text-white py-2 rounded-lg hover:bg-success/90 transition font-semibold text-sm"
                  >
                    💬 Chat
                  </button>
                ) : (
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      handleJoinClub(club.id, club.name)
                    }}
                    className="flex-1 bg-surface text-primary py-2 rounded-lg hover:bg-border transition font-semibold text-sm border border-primary"
                  >
                    Join
                  </button>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full text-center py-12">
            <p className="text-muted">No clubs found</p>
          </div>
        )}
      </div>

      {/* Create Club Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-8">
            <h2 className="text-2xl font-bold text-foreground mb-6">Create Club</h2>

            <form onSubmit={handleCreateClub} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Club Name *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="e.g., Basketball Enthusiasts"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Description *</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Describe your club..."
                  rows={3}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Sport (Top 11 + Others)</label>
                <select
                  value={showCustomSport ? 'custom' : formData.sport}
                  onChange={(e) => {
                    if (e.target.value === 'custom') {
                      setShowCustomSport(true)
                    } else if (e.target.value === 'others') {
                      setShowCustomSport(false)
                      setFormData({ ...formData, sport: 'Others' })
                    } else {
                      setShowCustomSport(false)
                      setFormData({ ...formData, sport: e.target.value })
                    }
                  }}
                  className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  {topSports.map(sport => (
                    <option key={sport} value={sport}>
                      {sport.charAt(0).toUpperCase() + sport.slice(1)}
                    </option>
                  ))}
                  <option value="others">Others</option>
                  <option value="custom">+ Custom Sport</option>
                </select>
              </div>

              {showCustomSport && (
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Custom Sport Name</label>
                  <input
                    type="text"
                    value={customSportName}
                    onChange={(e) => setCustomSportName(e.target.value)}
                    placeholder="e.g., Pickleball, Squash, Climbing"
                    className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Club Photo</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleClubPhotoChange}
                  className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
                {clubPhoto && (
                  <div className="mt-2 w-16 h-16 rounded-full overflow-hidden border-2 border-primary">
                    <img src={clubPhoto} alt="Club" className="w-full h-full object-cover" />
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Background Photo</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleBackgroundPhotoChange}
                  className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
                {backgroundPhoto && (
                  <div className="mt-2 w-full h-20 rounded-lg overflow-hidden border-2 border-primary">
                    <img src={backgroundPhoto} alt="Background" className="w-full h-full object-cover" />
                  </div>
                )}
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="private"
                  checked={formData.isPrivate}
                  onChange={(e) => setFormData({ ...formData, isPrivate: e.target.checked })}
                  className="w-4 h-4 rounded border-border"
                />
                <label htmlFor="private" className="text-sm text-foreground">
                  Make this club private
                </label>
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 px-4 py-2 border border-border rounded-lg text-foreground hover:bg-surface transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-primary text-white rounded-lg hover:opacity-90 transition"
                >
                  Create Club
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Weekly Events Timeline */}
      <div className="mt-12">
        <WeeklyEventsTimeline events={mockEvents} onSelectEvent={(event) => console.log('Selected event:', event)} />
      </div>
    </div>
  )
}
