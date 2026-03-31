import { useState } from 'react'
import { Club, User } from '@/types'
import { mockUsers } from '@/mockData'
import { Settings, Users, Calendar, Edit, Trash2, Plus } from 'lucide-react'

interface ClubAdminProps {
  club: Club
  user: User
  onBack: () => void
}

export default function ClubAdmin({ club, user, onBack }: ClubAdminProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'members' | 'events' | 'settings'>('overview')
  const [editingName, setEditingName] = useState(false)
  const [clubName, setClubName] = useState(club.name)
  const [clubDescription, setClubDescription] = useState(club.description)

  const isAdmin = club.admins.includes(user.id)
  const isOrganizer = club.organizers.includes(user.id)

  const handleSaveChanges = () => {
    // Save club changes
    alert('Club updated successfully!')
    setEditingName(false)
  }

  const handleRemoveMember = (memberId: string) => {
    alert(`Removed ${mockUsers[memberId as keyof typeof mockUsers]?.name} from the club`)
  }

  const handlePromoteToOrganizer = (memberId: string) => {
    alert(`Promoted ${mockUsers[memberId as keyof typeof mockUsers]?.name} to organizer`)
  }

  return (
    <div className="space-y-6 pb-20">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary/10 to-primary/5 rounded-2xl p-8">
        <button
          onClick={onBack}
          className="mb-4 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition"
        >
          ← Back
        </button>
        <h1 className="text-4xl font-bold text-foreground mb-2">Club Administration</h1>
        <p className="text-lg text-muted">{club.name}</p>
      </div>

      {/* Admin Info */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-center gap-2 mb-2">
          <Settings size={20} className="text-blue-600" />
          <span className="font-semibold text-blue-900">Your Role:</span>
        </div>
        <div className="text-sm text-blue-800">
          {isAdmin && <p>✓ You are an Admin</p>}
          {isOrganizer && <p>✓ You are an Organizer</p>}
          {!isAdmin && !isOrganizer && <p>You don't have admin/organizer permissions</p>}
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-2 border-b border-border">
        {(['overview', 'members', 'events', 'settings'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-3 font-semibold transition ${
              activeTab === tab
                ? 'border-b-2 border-primary text-primary'
                : 'text-muted hover:text-foreground'
            }`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Club Info Card */}
          <div className="bg-white rounded-lg border border-border p-6">
            <h2 className="text-2xl font-bold text-foreground mb-4 flex items-center gap-2">
              <span>📋</span> Club Information
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-muted mb-2">Club Name</label>
                {editingName ? (
                  <input
                    type="text"
                    value={clubName}
                    onChange={(e) => setClubName(e.target.value)}
                    className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:border-primary"
                  />
                ) : (
                  <p className="text-lg text-foreground">{clubName}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-muted mb-2">Description</label>
                {editingName ? (
                  <textarea
                    value={clubDescription}
                    onChange={(e) => setClubDescription(e.target.value)}
                    className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:border-primary"
                    rows={3}
                  />
                ) : (
                  <p className="text-foreground">{clubDescription}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-muted mb-2">Sport Type</label>
                <p className="text-lg text-foreground capitalize">{club.sport}</p>
              </div>

              <div>
                <label className="block text-sm font-semibold text-muted mb-2">Privacy</label>
                <p className="text-lg text-foreground">{club.isPrivate ? 'Private' : 'Public'}</p>
              </div>

              <div className="flex gap-2 pt-4">
                {editingName ? (
                  <>
                    <button
                      onClick={handleSaveChanges}
                      className="flex-1 bg-primary text-white py-2 rounded-lg hover:bg-primary/90 transition font-semibold"
                    >
                      Save Changes
                    </button>
                    <button
                      onClick={() => setEditingName(false)}
                      className="flex-1 bg-border text-foreground py-2 rounded-lg hover:bg-border/80 transition font-semibold"
                    >
                      Cancel
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => setEditingName(true)}
                    className="flex-1 bg-primary text-white py-2 rounded-lg hover:bg-primary/90 transition font-semibold flex items-center justify-center gap-2"
                  >
                    <Edit size={18} /> Edit Club
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Statistics */}
            <div className="grid grid-cols-3 gap-4">
            <div className="bg-blue-50 rounded-lg p-4 text-center">
              <p className="text-3xl font-bold text-blue-600">{club.members.length}</p>
              <p className="text-sm text-blue-700 mt-1">Members</p>
            </div>
            <div className="bg-green-50 rounded-lg p-4 text-center">
              <p className="text-3xl font-bold text-green-600">{club.events?.length || 0}</p>
              <p className="text-sm text-green-700 mt-1">Events</p>
            </div>
            <div className="bg-purple-50 rounded-lg p-4 text-center">
              <p className="text-3xl font-bold text-purple-600">{club.admins.length}</p>
              <p className="text-sm text-purple-700 mt-1">Admins</p>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'members' && (
        <div className="bg-white rounded-lg border border-border p-6">
          <h2 className="text-2xl font-bold text-foreground mb-4 flex items-center gap-2">
            <Users size={24} /> Members ({club.members.length})
          </h2>

          <div className="space-y-3">
            {club.members.map((memberId) => {
              const member = mockUsers[memberId as keyof typeof mockUsers]
              const isAdmin = club.admins.includes(memberId)
              const isOrganizer = club.organizers.includes(memberId)

              return (
                <div key={memberId} className="flex items-center justify-between p-4 bg-surface rounded-lg border border-border">
                  <div className="flex items-center gap-3 flex-1">
                    <span className="text-2xl">{member?.avatar}</span>
                    <div>
                      <p className="font-semibold text-foreground">{member?.name}</p>
                      <div className="flex gap-2 mt-1">
                        {isAdmin && <span className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded">Admin</span>}
                        {isOrganizer && <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">Organizer</span>}
                      </div>
                    </div>
                  </div>

                  {isAdmin && (
                    <div className="flex gap-2">
                      {!isOrganizer && (
                        <button
                          onClick={() => handlePromoteToOrganizer(memberId)}
                          className="px-3 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition text-sm font-semibold"
                        >
                          Make Organizer
                        </button>
                      )}
                      {memberId !== user.id && (
                        <button
                          onClick={() => handleRemoveMember(memberId)}
                          className="px-3 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200 transition"
                        >
                          <Trash2 size={16} />
                        </button>
                      )}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      )}

      {activeTab === 'events' && (
        <div className="bg-white rounded-lg border border-border p-6">
          <h2 className="text-2xl font-bold text-foreground mb-4 flex items-center gap-2">
            <Calendar size={24} /> Club Events ({club.events?.length || 0})
          </h2>

          {club.events && club.events.length > 0 ? (
            <div className="space-y-3">
              {club.events?.map((event) => (
                <div key={event.id} className="p-4 bg-surface rounded-lg border border-border">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold text-foreground text-lg">{event.title}</h3>
                      <p className="text-sm text-muted mt-1">📅 {event.date} at {event.time}</p>
                      <p className="text-sm text-muted">📍 {event.location}</p>
                      <p className="text-sm text-muted mt-2">👥 {event.currentParticipants}/{event.maxParticipants} participants</p>
                    </div>
                    <div className="flex gap-2">
                      <button className="p-2 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition">
                        <Edit size={18} />
                      </button>
                      <button className="p-2 bg-red-100 text-red-700 rounded hover:bg-red-200 transition">
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
             ) : (
            <div className="text-center py-8">
              <p className="text-muted">No events scheduled yet</p>
              <button className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition flex items-center justify-center gap-2 mx-auto">
                <Plus size={18} /> Create Event
              </button>
            </div>
          )}
        </div>
      )}

      {activeTab === 'settings' && (
        <div className="space-y-6">
          <div className="bg-white rounded-lg border border-border p-6">
            <h2 className="text-2xl font-bold text-foreground mb-4 flex items-center gap-2">
              <Settings size={24} /> Club Settings
            </h2>

            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-surface rounded-lg border border-border">
                <div>
                  <p className="font-semibold text-foreground">Private Club</p>
                  <p className="text-sm text-muted">Only invited members can join</p>
                </div>
                <input type="checkbox" checked={club.isPrivate} className="w-5 h-5" />
              </div>

              <div className="flex items-center justify-between p-4 bg-surface rounded-lg border border-border">
                <div>
                  <p className="font-semibold text-foreground">Allow Chat</p>
                  <p className="text-sm text-muted">Members can chat in the club</p>
                </div>
                <input type="checkbox" defaultChecked className="w-5 h-5" />
              </div>

              <div className="flex items-center justify-between p-4 bg-surface rounded-lg border border-border">
                <div>
                  <p className="font-semibold text-foreground">Require Approval</p>
                  <p className="text-sm text-muted">New members need admin approval</p>
                </div>
                <input type="checkbox" className="w-5 h-5" />
              </div>

              <button className="w-full mt-6 px-4 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition font-semibold">
                Save Settings
              </button>
            </div>
          </div>

          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <h3 className="text-lg font-bold text-red-900 mb-2">Danger Zone</h3>
            <p className="text-sm text-red-800 mb-4">These actions cannot be undone</p>
            <button className="w-full px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition font-semibold">
              Delete Club
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
