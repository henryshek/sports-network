import { User } from '@/types'
import { Mail, MapPin, Trophy, Users, LogOut } from 'lucide-react'

interface ProfileProps {
  user: User
  onLogout: () => void
}

export default function Profile({ user, onLogout }: ProfileProps) {
  return (
    <div className="max-w-2xl mx-auto pb-20">
      {/* Profile Header */}
      <div className="bg-gradient-to-r from-primary/10 to-primary/5 rounded-2xl p-8 mb-8">
        <div className="flex items-center gap-6">
          <div className="w-24 h-24 bg-primary rounded-full flex items-center justify-center text-4xl">
            👤
          </div>
          <div>
            <h1 className="text-3xl font-bold text-foreground">{user.name}</h1>
            <p className="text-muted flex items-center gap-2">
              <Mail size={16} /> {user.email}
            </p>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid md:grid-cols-3 gap-4 mb-8">
        {[
          { icon: Trophy, label: 'Events Joined', value: '12' },
          { icon: Users, label: 'Clubs', value: '5' },
          { icon: MapPin, label: 'Location', value: 'New York' }
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
          Sports enthusiast passionate about connecting with other athletes and building community through sports.
        </p>
        <div className="space-y-3">
          <div>
            <p className="text-sm text-muted">Favorite Sports</p>
            <p className="font-semibold text-foreground">Basketball, Soccer, Tennis</p>
          </div>
          <div>
            <p className="text-sm text-muted">Skill Level</p>
            <p className="font-semibold text-foreground">Intermediate</p>
          </div>
          <div>
            <p className="text-sm text-muted">Member Since</p>
            <p className="font-semibold text-foreground">January 2026</p>
          </div>
        </div>
      </div>

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
                <p className="font-semibold text-foreground">{activity.action} {activity.item}</p>
                <p className="text-sm text-muted">{activity.date}</p>
              </div>
              <span className="text-2xl">→</span>
            </div>
          ))}
        </div>
      </div>

      {/* Settings */}
      <div className="bg-surface rounded-xl p-6 border border-border mb-8">
        <h2 className="text-xl font-bold text-foreground mb-4">Settings</h2>
        <div className="space-y-3">
          <button className="w-full text-left px-4 py-3 hover:bg-background rounded-lg transition">
            Edit Profile
          </button>
          <button className="w-full text-left px-4 py-3 hover:bg-background rounded-lg transition">
            Change Password
          </button>
          <button className="w-full text-left px-4 py-3 hover:bg-background rounded-lg transition">
            Notifications
          </button>
          <button className="w-full text-left px-4 py-3 hover:bg-background rounded-lg transition">
            Privacy Settings
          </button>
        </div>
      </div>

      {/* Logout Button */}
      <button
        onClick={onLogout}
        className="w-full bg-error text-white py-3 rounded-lg font-semibold hover:opacity-90 transition flex items-center justify-center gap-2"
      >
        <LogOut size={20} />
        Logout
      </button>
    </div>
  )
}
