import { useState } from 'react'
import { User, Club } from '@/types'
import { ArrowLeft, Settings, Users, Shield, Edit2, Trash2, Check, X } from 'lucide-react'

interface ClubSettingsProps {
  club: Club
  user: User
  onBack: () => void
  onUpdateClub: (updatedClub: Club) => void
}

export default function ClubSettings({ club, user, onBack, onUpdateClub }: ClubSettingsProps) {
  const [activeTab, setActiveTab] = useState<'general' | 'members' | 'requests'>('general')
  const [isEditing, setIsEditing] = useState(false)
  const [editedClub, setEditedClub] = useState<Club>(club)
  const [pendingRequests, setPendingRequests] = useState(club.membershipRequests || [])

  // Check if user is admin or organizer
  const isAdmin = club.admins.includes(user.id)
  const isOrganizer = club.organizers.includes(user.id)
  const isCreator = club.creatorId === user.id
  const hasPermission = isAdmin || isOrganizer || isCreator

  if (!hasPermission) {
    return (
      <div className="max-w-4xl mx-auto">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-primary hover:text-primary/80 mb-6"
        >
          <ArrowLeft size={20} />
          Back
        </button>
        <div className="bg-error/10 border border-error rounded-lg p-8 text-center">
          <p className="text-error font-semibold">Access Denied</p>
          <p className="text-muted text-sm mt-2">Only admins and organizers can access club settings</p>
        </div>
      </div>
    )
  }

  const handleSaveChanges = () => {
    onUpdateClub(editedClub)
    setIsEditing(false)
  }

  const handleApproveRequest = (requestId: string) => {
    const request = pendingRequests.find(r => r.id === requestId)
    if (request) {
      // Add user to members
      const updatedClub = {
        ...editedClub,
        members: [...editedClub.members, request.userId],
        membershipRequests: pendingRequests.map(r =>
          r.id === requestId ? { ...r, status: 'approved' as const } : r
        )
      }
      setEditedClub(updatedClub)
      setPendingRequests(updatedClub.membershipRequests || [])
    }
  }

  const handleRejectRequest = (requestId: string) => {
    const updatedRequests = pendingRequests.map(r =>
      r.id === requestId ? { ...r, status: 'rejected' as const } : r
    )
    setPendingRequests(updatedRequests)
    setEditedClub({
      ...editedClub,
      membershipRequests: updatedRequests
    })
  }

  const handleRemoveMember = (memberId: string) => {
    const updatedClub = {
      ...editedClub,
      members: editedClub.members.filter(m => m !== memberId)
    }
    setEditedClub(updatedClub)
  }

  const handlePromoteToAdmin = (memberId: string) => {
    const updatedClub = {
      ...editedClub,
      admins: [...editedClub.admins, memberId]
    }
    setEditedClub(updatedClub)
  }

  const handlePromoteToOrganizer = (memberId: string) => {
    const updatedClub = {
      ...editedClub,
      organizers: [...editedClub.organizers, memberId]
    }
    setEditedClub(updatedClub)
  }

  return (
    <div className="max-w-4xl mx-auto pb-20">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-primary hover:text-primary/80"
        >
          <ArrowLeft size={20} />
          Back
        </button>
        <div>
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
            <Settings size={32} />
            Club Settings
          </h1>
          <p className="text-muted text-sm mt-1">{club.name}</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 mb-8 border-b border-border">
        <button
          onClick={() => setActiveTab('general')}
          className={`px-4 py-3 font-semibold transition ${
            activeTab === 'general'
              ? 'text-primary border-b-2 border-primary'
              : 'text-muted hover:text-foreground'
          }`}
        >
          General Settings
        </button>
        <button
          onClick={() => setActiveTab('members')}
          className={`px-4 py-3 font-semibold transition flex items-center gap-2 ${
            activeTab === 'members'
              ? 'text-primary border-b-2 border-primary'
              : 'text-muted hover:text-foreground'
          }`}
        >
          <Users size={18} />
          Members ({editedClub.members.length})
        </button>
        <button
          onClick={() => setActiveTab('requests')}
          className={`px-4 py-3 font-semibold transition flex items-center gap-2 ${
            activeTab === 'requests'
              ? 'text-primary border-b-2 border-primary'
              : 'text-muted hover:text-foreground'
          }`}
        >
          <Shield size={18} />
          Join Requests ({pendingRequests.filter(r => r.status === 'pending').length})
        </button>
      </div>

      {/* General Settings Tab */}
      {activeTab === 'general' && (
        <div className="bg-white rounded-lg border border-border p-8 space-y-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-foreground">Club Information</h2>
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition"
            >
              <Edit2 size={18} />
              {isEditing ? 'Cancel' : 'Edit'}
            </button>
          </div>

          {/* Club Name */}
          <div>
            <label className="block text-sm font-semibold text-foreground mb-2">Club Name</label>
            <input
              type="text"
              value={editedClub.name}
              onChange={(e) => setEditedClub({ ...editedClub, name: e.target.value })}
              disabled={!isEditing}
              className="w-full px-4 py-2 border border-border rounded-lg bg-surface disabled:opacity-50"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-semibold text-foreground mb-2">Description</label>
            <textarea
              value={editedClub.description}
              onChange={(e) => setEditedClub({ ...editedClub, description: e.target.value })}
              disabled={!isEditing}
              className="w-full px-4 py-2 border border-border rounded-lg bg-surface disabled:opacity-50 h-32"
            />
          </div>

          {/* Privacy Setting */}
          <div>
            <label className="block text-sm font-semibold text-foreground mb-2">Privacy</label>
            <select
              value={editedClub.isPrivate ? 'private' : 'public'}
              onChange={(e) => setEditedClub({ ...editedClub, isPrivate: e.target.value === 'private' })}
              disabled={!isEditing}
              className="w-full px-4 py-2 border border-border rounded-lg bg-surface disabled:opacity-50"
            >
              <option value="public">Public - Anyone can join</option>
              <option value="private">Private - Invite only</option>
            </select>
          </div>

          {/* Save Button */}
          {isEditing && (
            <div className="flex gap-3 pt-4">
              <button
                onClick={handleSaveChanges}
                className="flex-1 px-4 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition font-semibold flex items-center justify-center gap-2"
              >
                <Check size={18} />
                Save Changes
              </button>
              <button
                onClick={() => {
                  setEditedClub(club)
                  setIsEditing(false)
                }}
                className="flex-1 px-4 py-3 bg-surface text-foreground rounded-lg hover:bg-border transition font-semibold flex items-center justify-center gap-2"
              >
                <X size={18} />
                Cancel
              </button>
            </div>
          )}
        </div>
      )}

      {/* Members Tab */}
      {activeTab === 'members' && (
        <div className="space-y-4">
          {editedClub.members.length === 0 ? (
            <div className="bg-surface rounded-lg p-8 text-center">
              <p className="text-muted">No members yet</p>
            </div>
          ) : (
            editedClub.members.map((memberId) => (
              <div key={memberId} className="bg-white rounded-lg border border-border p-4 flex items-center justify-between">
                <div>
                  <p className="font-semibold text-foreground">Member ID: {memberId}</p>
                  <div className="flex gap-2 mt-2">
                    {editedClub.admins.includes(memberId) && (
                      <span className="text-xs px-2 py-1 bg-error/10 text-error rounded-full font-semibold">Admin</span>
                    )}
                    {editedClub.organizers.includes(memberId) && (
                      <span className="text-xs px-2 py-1 bg-warning/10 text-warning rounded-full font-semibold">Organizer</span>
                    )}
                  </div>
                </div>
                <div className="flex gap-2">
                  {!editedClub.admins.includes(memberId) && (
                    <button
                      onClick={() => handlePromoteToAdmin(memberId)}
                      className="px-3 py-2 bg-primary/10 text-primary rounded-lg hover:bg-primary/20 transition text-sm font-semibold"
                    >
                      Make Admin
                    </button>
                  )}
                  {!editedClub.organizers.includes(memberId) && (
                    <button
                      onClick={() => handlePromoteToOrganizer(memberId)}
                      className="px-3 py-2 bg-warning/10 text-warning rounded-lg hover:bg-warning/20 transition text-sm font-semibold"
                    >
                      Make Organizer
                    </button>
                  )}
                  <button
                    onClick={() => handleRemoveMember(memberId)}
                    className="px-3 py-2 bg-error/10 text-error rounded-lg hover:bg-error/20 transition"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Join Requests Tab */}
      {activeTab === 'requests' && (
        <div className="space-y-4">
          {pendingRequests.filter(r => r.status === 'pending').length === 0 ? (
            <div className="bg-surface rounded-lg p-8 text-center">
              <p className="text-muted">No pending join requests</p>
            </div>
          ) : (
            pendingRequests
              .filter(r => r.status === 'pending')
              .map((request) => (
                <div key={request.id} className="bg-white rounded-lg border border-border p-4 flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-foreground">{request.userName}</p>
                    <p className="text-sm text-muted">Requested {new Date(request.requestedAt).toLocaleDateString()}</p>
                  </div>
                  <div className="flex gap-3">
                    <button
                      onClick={() => handleApproveRequest(request.id)}
                      className="px-4 py-2 bg-success text-white rounded-lg hover:bg-success/90 transition font-semibold flex items-center gap-2"
                    >
                      <Check size={18} />
                      Approve
                    </button>
                    <button
                      onClick={() => handleRejectRequest(request.id)}
                      className="px-4 py-2 bg-error text-white rounded-lg hover:bg-error/90 transition font-semibold flex items-center gap-2"
                    >
                      <X size={18} />
                      Reject
                    </button>
                  </div>
                </div>
              ))
          )}

          {/* Approved Requests */}
          {pendingRequests.filter(r => r.status === 'approved').length > 0 && (
            <div className="mt-8">
              <h3 className="text-lg font-bold text-foreground mb-4">Approved Requests</h3>
              <div className="space-y-2">
                {pendingRequests
                  .filter(r => r.status === 'approved')
                  .map((request) => (
                    <div key={request.id} className="bg-success/5 rounded-lg p-3 flex items-center gap-2">
                      <Check size={18} className="text-success" />
                      <span className="text-sm text-foreground">{request.userName} - Approved</span>
                    </div>
                  ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
