export type SportType = 'basketball' | 'soccer' | 'tennis' | 'volleyball' | 'badminton' | 'cricket' | 'baseball' | 'american-football' | 'hockey' | 'golf' | 'swimming' | 'cycling' | 'running' | 'other'

export type SkillLevel = 'beginner' | 'intermediate' | 'advanced' | 'professional'

export type EventStatus = 'upcoming' | 'ongoing' | 'completed' | 'cancelled'

export interface UserRating {
  id: string
  ratedBy: string
  ratedUser: string
  eventId: string
  rating: number // 1-5 stars
  comment?: string
  createdAt: string
}

export interface UserSkillStats {
  sport: SportType
  skillLevel: SkillLevel
  activitiesParticipated: number
  averageRating?: number
}

export interface User {
  id: string
  name: string
  email: string
  avatar?: string
  profilePicture?: string // User's profile picture URL
  bio?: string
  sports?: SportType[]
  sportInterests?: SportType[]
  skillLevel?: SkillLevel
  location?: string
  joinedDate?: string
  createdAt?: string
  ratings?: UserRating[]
  skillStats?: UserSkillStats[]
  totalActivitiesParticipated?: number
  averageRating?: number
}

export interface Event {
  id: string
  title: string
  description: string
  sportType: SportType
  date: string
  time: string
  location: string
  locationName?: string // Nearest location name
  latitude?: number
  longitude?: number
  skillLevel: SkillLevel
  maxParticipants: number
  currentParticipants: number
  organizerId: string
  organizer?: User
  status: EventStatus
  participants: string[]
  waitlist?: string[]
  coHosts?: string[]
  reservedGuests?: { name: string; id?: string; status?: 'pending' | 'approved' | 'rejected'; reservedBy?: string }[]
  ratings?: UserRating[]
  createdAt: string
  updatedAt: string
}

export interface Club {
  id: string
  name: string
  description: string
  sport: SportType
  creatorId: string
  creator?: User
  members: string[]
  admins: string[]
  organizers: string[] // Club organizers with edit permissions
  isPrivate: boolean
  clubPhoto?: string // Club photo/icon URL
  backgroundPhoto?: string // Club background photo URL
  createdAt: string
  updatedAt: string
  events?: Event[]
  announcements?: Announcement[]
  invitations?: Invitation[]
  membershipRequests?: ClubMembershipRequest[] // Pending join requests
  groupChatId?: string // Auto-created group chat for club members
}

export interface Announcement {
  id: string
  clubId: string
  creatorId: string
  creator?: User
  title: string
  content: string
  isPinned: boolean
  createdAt: string
}

export interface Invitation {
  id: string
  clubId: string
  userId: string
  status: 'pending' | 'accepted' | 'rejected'
  createdAt: string
}

export interface ClubMembershipRequest {
  id: string
  clubId: string
  userId: string
  userName: string
  status: 'pending' | 'approved' | 'rejected'
  requestedAt: string
  respondedAt?: string
  respondedBy?: string
}

export interface Chat {
  id: string
  type: 'direct' | 'group' | 'club'
  name?: string
  participants: string[]
  messages: Message[]
  createdAt: string
  updatedAt: string
}

export interface Message {
  id: string
  chatId: string
  senderId: string
  sender?: User
  content: string
  createdAt: string
}

export interface GroupChat {
  id: string
  name: string
  participants: string[]
  creatorId: string
  creator?: User
  messages: Message[]
  createdAt: string
  updatedAt: string
}

export interface ClubChat {
  id: string
  clubId: string
  name: string
  participants: string[]
  messages: Message[]
  createdAt: string
  updatedAt: string
}

export interface AuthState {
  isAuthenticated: boolean
  user: User | null
  loading: boolean
  error?: string
}
