import { useState } from 'react'
import { User } from '@/types'
import { Mail, MapPin, Trophy, Users, LogOut, Camera, Shield, Heart } from 'lucide-react'
import { mockClubs } from '@/mockData'

interface ProfileProps {
  user: User
  onLogout: () => void
  onSelectClub?: (clubId: string) => void
}

export default function Profile({ user, onLogout, onSelectClub }: ProfileProps) {
  const [profilePicture, setProfilePicture] = useState<string>(user.profilePicture || '')
  const [previewImage, setPreviewImage] = useState<string | null>(null)

  // Get clubs where user is admin
  const adminClubs = mockClubs.filter(club => club.admins.includes(user.id))
  
  // Get clubs where user is member but not admin
  const memberClubs = mockClubs.filter(club => club.members.includes(user.id) && !club.admins.includes(user.id))

  const handleProfilePictureChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        const result = reader.result as string
        setProfilePicture(result)
        setPreviewImage(result)
        // In a real app, you would upload this to a server
        localStorage.setItem(`profile_picture_${user.id}`, result)
      }
      reader.readAsDataURL(file)
    }
  }

  const getSportEmoji = (sport: string) => {
    const emojis: Record<string, string> = {
      basketball: '🏀',
      soccer: '⚽',
      tennis: '🎾',
      volleyball: '🏐',
      badminton: '🏸',
      cricket: '🏏',
      baseball: '⚾',
      running: '🏃',
      cycling: '🚴',
      swimming: '🏊',
      yoga: '🧘',
      pickleball: '🏓',
    }
    return emojis[sport.toLowerCase()] || '⚽'
  }

  return (
    <div className="max-w-2xl mx-auto pb-20 px-4 md:px-0">
      {/* Profile Header */}
      <div className="bg-gradient-to-r from-primary/10 to-primary/5 rounded-2xl p-8 mb-8">
        <div className="flex items-center gap-6">
          {/* Profile Picture with Upload */}
          <div className="relative">
            <div className="w-24 h-24 bg-primary rounded-full flex items-center justify-center text-4xl overflow-hidden border-4 border-white shadow-lg">
              {previewImage || profilePicture ? (
                <img
                  src={previewImage || profilePicture}
                  alt={user.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                '👤'
              )}
            </div>
            <label
              htmlFor="profile-picture-input"
              className="absolute bottom-0 right-0 bg-primary text-white p-2 rounded-full cursor-pointer hover:bg-primary/90 transition shadow-lg"
            >
              <Camera size={16} />
              <input
                id="profile-picture-input"
                type="file"
                accept="image/*"
                onChange={handleProfilePictureChange}
                className="hidden"
              />
            </label>
          </div>

          <div className="flex-1">
            <h1 className="text-3xl font-bold text-foreground">{user.name}</h1>
            <p className="text-muted flex items-center gap-2">
              <Mail size={16} /> {user.email}
            </p>
            <button
              onClick={onLogout}
              className="mt-3 flex items-center gap-2 text-error hover:text-error/80 transition font-semibold"
            >
              <LogOut size={16} /> Logout
            </button>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid md:grid-cols-3 gap-4 mb-8">
        {[
          { icon: Trophy, label: 'Events Joined', value: user.totalActivitiesParticipated || '0' },
          { icon: Users, label: 'Clubs', value: (adminClubs.length + memberClubs.length).toString() },
          { icon: MapPin, label: 'Location', value: user.location || 'Not Set' }
        ].map((stat, i) => {
          const Icon = stat.icon
          return (
            <div key={i} className="bg-surface rounded-xl p-6 border border-border text-center">
              <Icon size={32} className="text-primary mx-auto mb-2" />
              <p className="text-sm text-muted">{stat.label}</p>
              <p className="text-2xl font-bold text-foreground">{stat.value}</p>
            </div>
          )
        })}
      </div>

      {/* About */}
      <div className="bg-surface rounded-xl p-6 border border-border mb-8">
        <h2 className="text-xl font-bold text-foreground mb-4">About</h2>
        <p className="text-muted mb-4">
          {user.bio || 'Sports enthusiast passionate about connecting with other athletes and building community through sports.'}
        </p>
        <div className="space-y-3">
          <div>
            <p className="text-sm text-muted">Favorite Sports</p>
            <p className="font-semibold text-foreground">{user.sports?.join(', ') || 'Not Set'}</p>
          </div>
          <div>
            <p className="text-sm text-muted">Skill Level</p>
            <p className="font-semibold text-foreground capitalize">{user.skillLevel || 'Not Set'}</p>
          </div>
          <div>
            <p className="text-sm text-muted">Member Since</p>
            <p className="font-semibold text-foreground">
              {user.joinedDate || user.createdAt ? new Date(user.joinedDate || user.createdAt || '').toLocaleDateString() : 'January 2026'}
            </p>
          </div>
        </div>
      </div>

      {/* Skill Stats */}
      {user.skillStats && user.skillStats.length > 0 && (
        <div className="bg-surface rounded-xl p-6 border border-border mb-8">
          <h2 className="text-xl font-bold text-foreground mb-4">Skill Stats by Sport</h2>
          <div className="space-y-4">
            {user.skillStats.map((stat, i) => (
              <div key={i} className="flex justify-between items-center pb-4 border-b border-border last:border-b-0">
                <div>
                  <p className="font-semibold text-foreground capitalize">{stat.sport}</p>
                  <p className="text-sm text-muted">
                    {stat.activitiesParticipated} activities • {stat.skillLevel}
                  </p>
                </div>
                {stat.averageRating && (
                  <div className="text-right">
                    <p className="font-semibold text-foreground">⭐ {stat.averageRating.toFixed(1)}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Admin Clubs */}
      {adminClubs.length > 0 && (
        <div className="bg-surface rounded-xl p-6 border border-border mb-8">
          <h2 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
            <Shield size={20} className="text-error" />
            Clubs I Admin ({adminClubs.length})
          </h2>
          <div className="space-y-3">
            {adminClubs.map(club => (
              <div
                key={club.id}
                onClick={() => onSelectClub?.(club.id)}
                className="p-4 bg-error/5 border border-error/20 rounded-lg hover:bg-error/10 transition cursor-pointer flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{getSportEmoji(club.sport)}</span>
                  <div>
                    <p className="font-semibold text-foreground">{club.name}</p>
                    <p className="text-sm text-muted">{club.members.length} members</p>
                  </div>
                </div>
                <span className="text-error font-semibold flex items-center gap-1">
                  <Shield size={16} /> Admin
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Member Clubs */}
      {memberClubs.length > 0 && (
        <div className="bg-surface rounded-xl p-6 border border-border mb-8">
          <h2 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
            <Heart size={20} className="text-success" />
            Clubs I'm a Member ({memberClubs.length})
          </h2>
          <div className="space-y-3">
            {memberClubs.map(club => (
              <div
                key={club.id}
                onClick={() => onSelectClub?.(club.id)}
                className="p-4 bg-success/5 border border-success/20 rounded-lg hover:bg-success/10 transition cursor-pointer flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{getSportEmoji(club.sport)}</span>
                  <div>
                    <p className="font-semibold text-foreground">{club.name}</p>
                    <p className="text-sm text-muted">{club.members.length} members</p>
                  </div>
                </div>
                <span className="text-success font-semibold flex items-center gap-1">
                  <Heart size={16} /> Member
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recent Activity */}
      <div className="bg-surface rounded-xl p-6 border border-border mb-8">
        <h2 className="text-xl font-bold text-foreground mb-4">Recent Activity</h2>
        <div className="space-y-4">
          {[
            { action: 'Joined', item: 'Basketball Game', date: 'Today' },
            { action: 'Created', item: 'Soccer Club', date: '2 days ago' },
            { action: 'Joined', item: 'Tennis Enthusiasts Club', date: '1 week ago' }
          ].map((activity, i) => (
            <div key={i} className="flex justify-between items-center pb-4 border-b border-border last:border-b-0">
              <div>
                <p className="font-semibold text-foreground">
                  {activity.action} {activity.item}
                </p>
                <p className="text-sm text-muted">{activity.date}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Overall Rating */}
      {user.averageRating && (
        <div className="bg-primary/10 border border-primary rounded-xl p-6 text-center">
          <p className="text-sm text-muted mb-2">Overall Rating</p>
          <p className="text-4xl font-bold text-primary">⭐ {user.averageRating.toFixed(1)}</p>
          <p className="text-sm text-muted mt-2">Based on {user.ratings?.length || 0} ratings</p>
        </div>
      )}
    </div>
  )
}
