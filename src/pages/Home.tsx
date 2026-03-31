import { User } from '@/types'
import { Zap, TrendingUp } from 'lucide-react'

interface HomeProps {
  user: User
}

export default function Home({ user }: HomeProps) {
  const activities = [
    {
      id: '1',
      type: 'event_created',
      user: 'John Smith',
      action: 'created a new event',
      target: 'Basketball Game at Victoria Park',
      time: '2 hours ago',
      icon: '🏀'
    },
    {
      id: '2',
      type: 'joined_event',
      user: 'Sarah Johnson',
      action: 'joined',
      target: 'Tennis Match at Hong Kong Tennis Centre',
      time: '4 hours ago',
      icon: '🎾'
    },
    {
      id: '3',
      type: 'club_created',
      user: 'Mike Chen',
      action: 'created a new club',
      target: 'Soccer Enthusiasts',
      time: '1 day ago',
      icon: '⚽'
    },
    {
      id: '4',
      type: 'event_completed',
      user: 'Emma Wilson',
      action: 'completed',
      target: 'Volleyball Tournament at Repulse Bay Beach',
      time: '2 days ago',
      icon: '🏐'
    },
    {
      id: '5',
      type: 'joined_club',
      user: 'David Lee',
      action: 'joined',
      target: 'Badminton Club',
      time: '3 days ago',
      icon: '🏸'
    },
    {
      id: '6',
      type: 'event_created',
      user: 'Lisa Wong',
      action: 'created a new event',
      target: 'Running Group - Morning Jog',
      time: '4 days ago',
      icon: '🏃'
    },
  ]

  const quickAccessItems = [
    { id: 'events', label: 'Events', icon: '📅', color: 'bg-blue-100 text-blue-600', description: 'Find & join events' },
    { id: 'clubs', label: 'Clubs', icon: '👥', color: 'bg-purple-100 text-purple-600', description: 'Browse clubs' },
    { id: 'map', label: 'Map', icon: '🗺️', color: 'bg-green-100 text-green-600', description: 'View nearby' },
    { id: 'messages', label: 'Messages', icon: '💬', color: 'bg-pink-100 text-pink-600', description: 'Chat' },
    { id: 'profile', label: 'Profile', icon: '👤', color: 'bg-orange-100 text-orange-600', description: 'Your profile' },
    { id: 'trending', label: 'Trending', icon: '🔥', color: 'bg-red-100 text-red-600', description: 'Popular now' },
    { id: 'saved', label: 'Saved', icon: '⭐', color: 'bg-yellow-100 text-yellow-600', description: 'Bookmarks' },
    { id: 'nearby', label: 'Nearby', icon: '📍', color: 'bg-indigo-100 text-indigo-600', description: 'Around you' },
  ]

  return (
    <div className="space-y-8 pb-20">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-primary/10 to-primary/5 rounded-2xl p-8">
        <h1 className="text-4xl font-bold text-foreground mb-2">Welcome back, {user.name}! 👋</h1>
        <p className="text-lg text-muted">Find sports events, join clubs, and connect with athletes in your area</p>
      </div>

      {/* Quick Access Dashboard */}
      <div>
        <h2 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
          <Zap size={24} className="text-primary" />
          Quick Access
        </h2>
        
        {/* Horizontal Scrollable Container */}
        <div className="overflow-x-auto pb-2 -mx-8 px-8">
          <div className="flex gap-4 min-w-min">
            {quickAccessItems.map((item) => (
              <button
                key={item.id}
                className={`flex flex-col items-center justify-center w-24 h-24 rounded-xl ${item.color} hover:shadow-lg transition flex-shrink-0 font-medium`}
              >
                <span className="text-4xl mb-1">{item.icon}</span>
                <span className="text-xs font-semibold text-center line-clamp-1">{item.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="h-1 bg-surface rounded-full"></div>

      {/* Activity Timeline */}
      <div>
        <h2 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
          <TrendingUp size={24} className="text-primary" />
          Activity Timeline
        </h2>
        
        <div className="space-y-4">
          {activities.map((activity, index) => (
            <div key={activity.id} className="flex gap-4">
              {/* Timeline Line */}
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 rounded-full bg-surface flex items-center justify-center text-2xl border-2 border-primary/20">
                  {activity.icon}
                </div>
                {index < activities.length - 1 && (
                  <div className="w-1 h-16 bg-gradient-to-b from-primary/30 to-transparent mt-2"></div>
                )}
              </div>

              {/* Activity Content */}
              <div className="flex-1 pt-2 pb-4">
                <div className="bg-white rounded-lg p-4 border border-border hover:shadow-md transition">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <p className="text-sm font-semibold text-foreground">
                        {activity.user}
                      </p>
                      <p className="text-sm text-muted">
                        {activity.action}
                      </p>
                    </div>
                    <span className="text-xs text-muted whitespace-nowrap ml-2 font-medium">
                      {activity.time}
                    </span>
                  </div>
                  
                  <p className="text-sm font-medium text-primary bg-primary/5 px-3 py-2 rounded inline-block mb-3">
                    {activity.target}
                  </p>

                  {/* Action Buttons */}
                  <div className="flex gap-2">
                    <button className="text-xs px-4 py-1.5 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition font-semibold">
                      View
                    </button>
                    <button className="text-xs px-4 py-1.5 rounded-lg bg-surface text-foreground hover:bg-border transition font-semibold">
                      Follow
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Load More Button */}
        <div className="mt-8 text-center">
          <button className="px-8 py-3 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition font-semibold text-sm">
            Load More Activities
          </button>
        </div>
      </div>
    </div>
  )
}
