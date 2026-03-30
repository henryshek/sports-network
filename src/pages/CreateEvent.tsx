import { useState } from 'react'
import { User } from '@/types'

interface CreateEventProps {
  onBack: () => void
  user?: User
  onEventCreated?: (event: any) => void
}

export default function CreateEvent({ onBack, onEventCreated }: CreateEventProps) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    sportType: 'basketball',
    date: '',
    time: '',
    location: '',
    skillLevel: 'intermediate',
    maxParticipants: 10,
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.title || !formData.date || !formData.time || !formData.location) {
      alert('Please fill in all required fields')
      return
    }
    
    // Create new event object
    const newEvent = {
      id: `event_${Date.now()}`,
      title: formData.title,
      description: formData.description,
      sportType: formData.sportType,
      date: formData.date,
      time: formData.time,
      location: formData.location,
      skillLevel: formData.skillLevel,
      maxParticipants: formData.maxParticipants,
      currentParticipants: 1,
      participants: ['user1'],
      organizerId: 'user1',
      organizerName: 'John Doe',
      reservedGuests: [],
      waitlist: [],
    }
    
    // Call the callback if provided
    if (onEventCreated) {
      onEventCreated(newEvent)
    }
    
    alert('Event created successfully!')
    onBack()
  }

  const sports = ['basketball', 'soccer', 'tennis', 'volleyball', 'badminton', 'cricket', 'baseball', 'running', 'cycling', 'swimming']
  const skillLevels = ['beginner', 'intermediate', 'advanced', 'professional']

  return (
    <div className="pb-24">
      <button
        onClick={onBack}
        className="mb-6 text-primary hover:underline"
      >
        ← Back
      </button>

      <div className="max-w-2xl">
        <h1 className="text-3xl font-bold text-foreground mb-6">Create Event</h1>

        <form onSubmit={handleSubmit} className="space-y-6 bg-white rounded-lg border border-border p-8">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Event Title</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="e.g., Basketball Game at Golden Gate Park"
              required
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="Describe your event..."
              rows={4}
              required
            />
          </div>

          {/* Sport Type */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Sport Type</label>
            <select
              value={formData.sportType}
              onChange={(e) => setFormData({ ...formData, sportType: e.target.value })}
              className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            >
              {sports.map(sport => (
                <option key={sport} value={sport} className="capitalize">
                  {sport.charAt(0).toUpperCase() + sport.slice(1)}
                </option>
              ))}
            </select>
          </div>

          {/* Date and Time */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Date</label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Time</label>
              <input
                type="time"
                value={formData.time}
                onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                required
              />
            </div>
          </div>

          {/* Location */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Location</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className="flex-1 px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="e.g., Golden Gate Park, San Francisco"
                required
              />
              <button
                type="button"
                onClick={() => {
                  if (navigator.geolocation) {
                    navigator.geolocation.getCurrentPosition(
                      (position) => {
                        const { latitude, longitude } = position.coords
                        setFormData({ ...formData, location: `${latitude.toFixed(4)}, ${longitude.toFixed(4)}` })
                      },
                      () => alert('Unable to get your location')
                    )
                  } else {
                    alert('Geolocation is not supported')
                  }
                }}
                className="px-4 py-2 bg-primary text-white rounded-lg hover:opacity-90 transition whitespace-nowrap"
              >
                📍 Use Current
              </button>
            </div>
          </div>

          {/* Skill Level and Max Participants */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Skill Level</label>
              <select
                value={formData.skillLevel}
                onChange={(e) => setFormData({ ...formData, skillLevel: e.target.value })}
                className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              >
                {skillLevels.map(level => (
                  <option key={level} value={level} className="capitalize">
                    {level.charAt(0).toUpperCase() + level.slice(1)}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Max Participants</label>
              <input
                type="number"
                min="2"
                max="100"
                value={formData.maxParticipants}
                onChange={(e) => setFormData({ ...formData, maxParticipants: parseInt(e.target.value) })}
                className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                required
              />
            </div>
          </div>

          {/* Submit Buttons */}
          <div className="flex gap-4">
            <button
              type="submit"
              className="flex-1 bg-primary text-white font-semibold py-3 rounded-lg hover:opacity-90 transition"
            >
              Create Event
            </button>
            <button
              type="button"
              onClick={onBack}
              className="flex-1 bg-surface text-foreground font-semibold py-3 rounded-lg hover:bg-border transition"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
