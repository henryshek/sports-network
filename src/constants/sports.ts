// Top 11 hottest sports activities
export const TOP_SPORTS = [
  'Basketball',
  'Soccer',
  'Tennis',
  'Volleyball',
  'Badminton',
  'Cricket',
  'Running',
  'Cycling',
  'Swimming',
  'Yoga',
  'Pickleball',
] as const

export const SPORT_EMOJIS: Record<string, string> = {
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
}

export function getSportEmoji(sport: string): string {
  return SPORT_EMOJIS[sport.toLowerCase()] || '⚽'
}

export function isTopSport(sport: string): boolean {
  return TOP_SPORTS.some(s => s.toLowerCase() === sport.toLowerCase())
}
