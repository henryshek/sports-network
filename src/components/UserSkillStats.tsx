import { UserSkillStats as UserSkillStatsType } from '@/types'

interface UserSkillStatsProps {
  stats: UserSkillStatsType[]
  totalActivities: number
  averageRating?: number
}

export function UserSkillStats({
  stats,
  totalActivities,
  averageRating,
}: UserSkillStatsProps) {
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
      golf: '⛳',
      hockey: '🏒',
      rugby: '🏉',
      'american football': '🏈',
      'table tennis': '🏓',
      squash: '🎾',
      pickleball: '🎾',
      'martial arts': '🥋',
      boxing: '🥊',
      wrestling: '🤼',
      weightlifting: '🏋️',
      yoga: '🧘',
      pilates: '🧘',
      crossfit: '💪',
      'rock climbing': '🧗',
      skateboarding: '🛹',
      surfing: '🏄',
      kayaking: '🚣',
      hiking: '🥾',
      'mountain biking': '🚵',
      'ice skating': '⛸️',
      'roller skating': '🛼',
      bowling: '🎳',
      archery: '🏹',
      fencing: '🤺',
      gymnastics: '🤸',
      parkour: '🏃',
      dance: '💃',
      aerobics: '🤸',
      zumba: '💃',
      'tai chi': '🧘',
      karate: '🥋',
      judo: '🥋',
      taekwondo: '🥋',
      handball: '🤾',
      lacrosse: '🥍',
      'ultimate frisbee': '🥏',
      cornhole: '🎯',
      paddleball: '🏓',
      racquetball: '🎾',
      darts: '🎯',
      pool: '🎱',
      billiards: '🎱',
      'ping pong': '🏓',
    }
    return emojis[sport.toLowerCase()] || '⚽'
  }

  const getSkillColor = (level: string) => {
    switch (level.toLowerCase()) {
      case 'beginner':
        return 'bg-blue-100 text-blue-800'
      case 'intermediate':
        return 'bg-green-100 text-green-800'
      case 'advanced':
        return 'bg-orange-100 text-orange-800'
      case 'professional':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="space-y-4">
      {/* Overall Stats */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-primary/10 rounded-lg p-4 text-center">
          <p className="text-2xl font-bold text-primary">{totalActivities}</p>
          <p className="text-xs text-muted">Activities Joined</p>
        </div>
        {averageRating && (
          <div className="bg-yellow-100 rounded-lg p-4 text-center">
            <p className="text-2xl font-bold text-yellow-600">
              {averageRating.toFixed(1)} ⭐
            </p>
            <p className="text-xs text-muted">Average Rating</p>
          </div>
        )}
      </div>

      {/* Sport-specific Skills */}
      {stats.length > 0 && (
        <div className="space-y-3">
          <h3 className="font-semibold text-foreground">Skill by Sport</h3>
          {stats.map(stat => (
            <div key={stat.sport} className="border border-border rounded-lg p-3">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{getSportEmoji(stat.sport)}</span>
                  <div>
                    <p className="font-semibold text-foreground capitalize">
                      {stat.sport}
                    </p>
                    <p className={`text-xs px-2 py-1 rounded inline-block ${getSkillColor(stat.skillLevel)}`}>
                      {stat.skillLevel}
                    </p>
                  </div>
                </div>
                {stat.averageRating && (
                  <div className="text-right">
                    <p className="text-sm font-bold text-yellow-600">
                      {stat.averageRating.toFixed(1)} ⭐
                    </p>
                  </div>
                )}
              </div>
              <p className="text-xs text-muted">
                {stat.activitiesParticipated} activities participated
              </p>
            </div>
          ))}
        </div>
      )}

      {stats.length === 0 && (
        <div className="text-center py-8">
          <p className="text-muted">No skill history yet. Join some activities to build your profile!</p>
        </div>
      )}
    </div>
  )
}
