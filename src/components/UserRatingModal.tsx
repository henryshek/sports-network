import { useState } from 'react'
import { UserRating } from '@/types'

interface UserRatingModalProps {
  isOpen: boolean
  userName: string
  userId: string
  eventId: string
  onSubmit: (rating: UserRating) => void
  onClose: () => void
}

export function UserRatingModal({
  isOpen,
  userName,
  userId,
  eventId,
  onSubmit,
  onClose,
}: UserRatingModalProps) {
  const [rating, setRating] = useState(5)
  const [comment, setComment] = useState('')

  const handleSubmit = () => {
    const newRating: UserRating = {
      id: `rating-${Date.now()}`,
      ratedBy: 'current-user', // Would be actual current user ID
      ratedUser: userId,
      eventId,
      rating,
      comment: comment.trim() || undefined,
      createdAt: new Date().toISOString(),
    }
    onSubmit(newRating)
    setRating(5)
    setComment('')
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 space-y-4">
        <h2 className="text-xl font-bold text-foreground">
          Rate {userName}
        </h2>

        {/* Star Rating */}
        <div className="space-y-2">
          <p className="text-sm text-muted">How was their performance?</p>
          <div className="flex gap-2 justify-center">
            {[1, 2, 3, 4, 5].map(star => (
              <button
                key={star}
                onClick={() => setRating(star)}
                className={`text-3xl transition ${
                  star <= rating ? 'text-yellow-400' : 'text-gray-300'
                }`}
              >
                ★
              </button>
            ))}
          </div>
          <p className="text-center text-sm font-semibold text-foreground">
            {rating} / 5 stars
          </p>
        </div>

        {/* Comment */}
        <div className="space-y-2">
          <label className="text-sm text-muted">
            Add a comment (optional)
          </label>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Share your experience..."
            className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm"
            rows={3}
          />
        </div>

        {/* Buttons */}
        <div className="flex gap-2">
          <button
            onClick={onClose}
            className="flex-1 bg-muted text-foreground py-2 rounded-lg hover:opacity-90 transition font-semibold"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="flex-1 bg-primary text-white py-2 rounded-lg hover:opacity-90 transition font-semibold"
          >
            Submit Rating
          </button>
        </div>
      </div>
    </div>
  )
}
