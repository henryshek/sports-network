import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Users, Search, Plus } from 'lucide-react'
import { Club, SportType } from '@/types'
import { clubApi } from '@/api'

interface ClubsProps {
  onSelectClub?: (clubId: string) => void
}

const SPORTS: { value: SportType; label: string; emoji: string }[] = [
  { value: 'basketball', label: 'Basketball', emoji: '🏀' },
  { value: 'soccer', label: 'Soccer', emoji: '⚽' },
  { value: 'tennis', label: 'Tennis', emoji: '🎾' },
  { value: 'volleyball', label: 'Volleyball', emoji: '🏐' },
  { value: 'badminton', label: 'Badminton', emoji: '🏸' },
  { value: 'cricket', label: 'Cricket', emoji: '🏏' },
  { value: 'baseball', label: 'Baseball', emoji: '⚾' },
  { value: 'running', label: 'Running', emoji: '🏃' },
  { value: 'cycling', label: 'Cycling', emoji: '🚴' },
  { value: 'swimming', label: 'Swimming', emoji: '🏊' },
]

export default function Clubs({}: ClubsProps) {
  const [clubs, setClubs] = useState<Club[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedSport, setSelectedSport] = useState<SportType | ''>('')
  const [activeTab, setActiveTab] = useState<'all' | 'my'>('all')

  useEffect(() => {
    const fetchClubs = async () => {
      try {
        const response = await clubApi.getAll()
        setClubs(response.data)
      } catch (error) {
        console.error('Failed to fetch clubs:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchClubs()
  }, [])

  const filteredClubs = clubs.filter(club => {
    const matchesSearch = club.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesSport = !selectedSport || club.sport === selectedSport
    const matchesTab = activeTab === 'all' || club.members.includes('user1')
    return matchesSearch && matchesSport && matchesTab
  })

  const getSportEmoji = (sport: SportType) => {
    return SPORTS.find(s => s.value === sport)?.emoji || '⚽'
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-muted">Loading clubs...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-foreground">Clubs</h1>
          <Link to="/clubs/create" className="bg-primary text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:opacity-90 transition">
            <Plus size={20} />
            Create Club
          </Link>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-8 border-b border-border">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-4 py-2 font-semibold transition ${
              activeTab === 'all'
                ? 'text-primary border-b-2 border-primary'
                : 'text-muted hover:text-foreground'
            }`}
          >
            All Clubs
          </button>
          <button
            onClick={() => setActiveTab('my')}
            className={`px-4 py-2 font-semibold transition ${
              activeTab === 'my'
                ? 'text-primary border-b-2 border-primary'
                : 'text-muted hover:text-foreground'
            }`}
          >
            My Clubs
          </button>
        </div>

        {/* Search and Filters */}
        <div className="bg-surface rounded-xl p-6 mb-8 border border-border">
          <div className="flex flex-col gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 text-muted" size={20} />
              <input
                type="text"
                placeholder="Search clubs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div className="flex gap-2 flex-wrap">
              <button
                onClick={() => setSelectedSport('')}
                className={`px-4 py-2 rounded-lg transition ${
                  selectedSport === '' ? 'bg-primary text-white' : 'bg-background border border-border text-foreground hover:bg-surface'
                }`}
              >
                All Sports
              </button>
              {SPORTS.map(sport => (
                <button
                  key={sport.value}
                  onClick={() => setSelectedSport(sport.value)}
                  className={`px-4 py-2 rounded-lg transition flex items-center gap-2 ${
                    selectedSport === sport.value ? 'bg-primary text-white' : 'bg-background border border-border text-foreground hover:bg-surface'
                  }`}
                >
                  <span>{sport.emoji}</span>
                  {sport.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Clubs Grid */}
        {filteredClubs.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted text-lg">No clubs found. Try adjusting your filters.</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredClubs.map(club => (
              <Link
                key={club.id}
                to={`/clubs/${club.id}`}
                className="bg-surface rounded-xl overflow-hidden border border-border hover:shadow-lg transition"
              >
                <div className="bg-gradient-to-r from-primary/20 to-primary/10 p-6 h-32 flex items-end">
                  <div className="text-4xl">{getSportEmoji(club.sport)}</div>
                </div>
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-foreground mb-2 line-clamp-2">{club.name}</h3>
                  <p className="text-sm text-muted mb-4 line-clamp-2">{club.description}</p>
                  
                  <div className="flex items-center gap-2 text-sm text-muted mb-4">
                    <Users size={16} />
                    <span>{club.members.length} members</span>
                  </div>

                  <div className="flex gap-2">
                    {club.isPrivate && (
                      <span className="text-xs font-semibold px-3 py-1 rounded-full bg-warning/10 text-warning">
                        Private
                      </span>
                    )}
                    {club.members.includes('user1') && (
                      <span className="text-xs font-semibold px-3 py-1 rounded-full bg-success/10 text-success">
                        Joined
                      </span>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
