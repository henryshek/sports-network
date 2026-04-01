import { useState, useMemo } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface MyEvent {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  participants: number;
  maxParticipants: number;
  skillLevel: string;
  organizer: string;
  organizerAvatar: string;
  status: 'confirmed' | 'waitlist';
}

interface MyEventsPageProps {
  onBack?: () => void;
}

export function MyEventsPage({ onBack }: MyEventsPageProps) {
  const today = new Date('2026-04-06'); // Current date in demo
  const [selectedDate, setSelectedDate] = useState(today);

  // Mock data for user's joined events
  const myEvents: MyEvent[] = [
    {
      id: 'event1',
      title: 'Morning Running Group',
      date: '2026-04-06',
      time: '06:30',
      location: 'Victoria Park, Causeway Bay, Hong Kong',
      participants: 12,
      maxParticipants: 20,
      skillLevel: 'Beginner',
      organizer: 'John Doe',
      organizerAvatar: '👨‍🦰',
      status: 'confirmed',
    },
    {
      id: 'event2',
      title: 'Basketball Game',
      date: '2026-04-06',
      time: '18:00',
      location: 'Victoria Park, Causeway Bay, Hong Kong',
      participants: 6,
      maxParticipants: 10,
      skillLevel: 'Intermediate',
      organizer: 'John Doe',
      organizerAvatar: '👨‍🦰',
      status: 'confirmed',
    },
    {
      id: 'event3',
      title: 'Tennis Match',
      date: '2026-04-09',
      time: '09:00',
      location: 'Hong Kong Park, Central, Hong Kong',
      participants: 3,
      maxParticipants: 4,
      skillLevel: 'Advanced',
      organizer: 'Jane Smith',
      organizerAvatar: '👩‍🦱',
      status: 'waitlist',
    },
    {
      id: 'event4',
      title: 'Yoga Session',
      date: '2026-04-07',
      time: '07:00',
      location: 'Central Park, Central, Hong Kong',
      participants: 18,
      maxParticipants: 25,
      skillLevel: 'Beginner',
      organizer: 'Sarah Williams',
      organizerAvatar: '👩‍🦳',
      status: 'confirmed',
    },
    {
      id: 'event5',
      title: 'Swimming Training',
      date: '2026-04-10',
      time: '17:00',
      location: 'Victoria Park Pool, Causeway Bay, Hong Kong',
      participants: 14,
      maxParticipants: 20,
      skillLevel: 'Intermediate',
      organizer: 'Mike Johnson',
      organizerAvatar: '👨‍💼',
      status: 'confirmed',
    },
  ];

  // Generate calendar dates (2 weeks from today)
  const calendarDates = useMemo(() => {
    const dates = [];
    for (let i = 0; i < 14; i++) {
      const date = new Date(today);
      date.setDate(date.getDate() + i);
      dates.push(date);
    }
    return dates;
  }, []);

  // Get events for selected date
  const eventsForSelectedDate = useMemo(() => {
    const dateStr = selectedDate.toISOString().split('T')[0];
    return myEvents
      .filter((event) => event.date === dateStr)
      .sort((a, b) => a.time.localeCompare(b.time));
  }, [selectedDate]);

  // Format date for display
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    });
  };

  // Format full date for header
  const formatFullDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const handlePrevDate = () => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() - 1);
    if (newDate >= today) {
      setSelectedDate(newDate);
    }
  };

  const handleNextDate = () => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() + 1);
    const maxDate = new Date(today);
    maxDate.setDate(maxDate.getDate() + 13);
    if (newDate <= maxDate) {
      setSelectedDate(newDate);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            {onBack && (
              <button
                onClick={onBack}
                className="text-blue-600 hover:text-blue-700 font-medium"
              >
                ← Back
              </button>
            )}
            <h1 className="text-2xl font-bold text-gray-900">My Events</h1>
            <div className="w-16"></div>
          </div>

          {/* Calendar */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <button
                onClick={handlePrevDate}
                disabled={selectedDate <= today}
                className="p-1 hover:bg-gray-100 rounded disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft size={20} />
              </button>

              <div className="text-center">
                <div className="text-sm font-medium text-gray-600">
                  {formatFullDate(selectedDate)}
                </div>
              </div>

              <button
                onClick={handleNextDate}
                className="p-1 hover:bg-gray-100 rounded"
              >
                <ChevronRight size={20} />
              </button>
            </div>

            {/* Date selector */}
            <div className="overflow-x-auto pb-2">
              <div className="flex gap-2 min-w-min">
                {calendarDates.map((date, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedDate(date)}
                    className={`px-3 py-2 rounded-lg whitespace-nowrap text-sm font-medium transition-colors ${
                      selectedDate.toDateString() === date.toDateString()
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    {formatDate(date)}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Events Timeline */}
      <div className="max-w-4xl mx-auto px-4 py-6">
        {eventsForSelectedDate.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">
              No events scheduled for this date
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {eventsForSelectedDate.map((event) => (
              <div
                key={event.id}
                className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
              >
                <div className="flex">
                  {/* Time indicator */}
                  <div className="w-20 bg-blue-50 border-r border-gray-200 p-4 flex flex-col items-center justify-center">
                    <div className="text-lg font-bold text-blue-600">
                      {event.time}
                    </div>
                  </div>

                  {/* Event details */}
                  <div className="flex-1 p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">
                          {event.title}
                        </h3>
                        <p className="text-sm text-gray-600 mt-1">
                          📍 {event.location}
                        </p>
                      </div>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          event.status === 'confirmed'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}
                      >
                        {event.status === 'confirmed'
                          ? '✓ Confirmed'
                          : '⏳ Waitlist'}
                      </span>
                    </div>

                    <div className="flex items-center gap-4 mt-3 text-sm text-gray-600">
                      <div>
                        <span className="font-medium">Skill Level:</span>{' '}
                        {event.skillLevel}
                      </div>
                      <div>
                        <span className="font-medium">Participants:</span>{' '}
                        {event.participants}/{event.maxParticipants}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 mt-3 pt-3 border-t border-gray-200">
                      <span className="text-xl">{event.organizerAvatar}</span>
                      <span className="text-sm text-gray-600">
                        Organized by <span className="font-medium">{event.organizer}</span>
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
