import { useEffect, useRef } from 'react'
import { Event } from '@/types'

interface GoogleMapComponentProps {
  events: Event[]
  onSelectEvent: (eventId: string) => void
  selectedEventId?: string
}

declare global {
  interface Window {
    google: any
  }
}

export default function GoogleMapComponent({ events, onSelectEvent, selectedEventId }: GoogleMapComponentProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstance = useRef<any>(null)
  const markersRef = useRef<any[]>([])

  useEffect(() => {
    // Initialize map with default center (San Francisco)
    if (mapRef.current && !mapInstance.current) {
      const defaultCenter = { lat: 37.7749, lng: -122.4194 }

      // Check if Google Maps is loaded
      if (window.google && window.google.maps) {
        mapInstance.current = new window.google.maps.Map(mapRef.current, {
          zoom: 12,
          center: defaultCenter,
          styles: [
            {
              featureType: 'all',
              elementType: 'labels.text.fill',
              stylers: [{ color: '#686868' }],
            },
          ],
        })

        // Add markers for events
        addEventMarkers()
      }
    }
  }, [])

  useEffect(() => {
    // Update markers when events change
    if (mapInstance.current) {
      clearMarkers()
      addEventMarkers()
    }
  }, [events])

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
    }
    return emojis[sport] || '⚽'
  }

  const parseLocation = (location: string) => {
    // Try to parse coordinates from location string (e.g., "37.7749, -122.4194")
    const coords = location.split(',').map(c => parseFloat(c.trim()))
    if (coords.length === 2 && !isNaN(coords[0]) && !isNaN(coords[1])) {
      return { lat: coords[0], lng: coords[1] }
    }

    // Default locations for known places
    const locationMap: Record<string, { lat: number; lng: number }> = {
      'golden gate park': { lat: 37.7694, lng: -122.4862 },
      'mission bay': { lat: 37.7597, lng: -122.3931 },
      'ocean beach': { lat: 37.7596, lng: -122.5107 },
      'dolores park': { lat: 37.7599, lng: -122.4148 },
      'central park': { lat: 40.7829, lng: -73.9654 },
      'downtown sports court': { lat: 37.7749, lng: -122.4194 },
    }

    const key = location.toLowerCase()
    for (const [place, coords] of Object.entries(locationMap)) {
      if (key.includes(place)) {
        return coords
      }
    }

    // Default to San Francisco if location not found
    return { lat: 37.7749, lng: -122.4194 }
  }

  const addEventMarkers = () => {
    if (!mapInstance.current || !window.google) return

    events.forEach(event => {
      const position = parseLocation(event.location || '')

      const marker = new window.google.maps.Marker({
        position,
        map: mapInstance.current,
        title: event.title,
        icon: {
          path: window.google.maps.SymbolPath.CIRCLE,
          scale: 12,
          fillColor: selectedEventId === event.id ? '#0a7ea4' : '#4CAF50',
          fillOpacity: 1,
          strokeColor: '#fff',
          strokeWeight: 2,
        },
      })

      marker.addListener('click', () => {
        onSelectEvent(event.id)
        mapInstance.current.panTo(position)
      })

      markersRef.current.push(marker)
    })
  }

  const clearMarkers = () => {
    markersRef.current.forEach(marker => marker.setMap(null))
    markersRef.current = []
  }

  return (
    <div className="space-y-4">
      <div className="bg-yellow-100 border border-yellow-400 rounded-lg p-4 text-sm text-yellow-800">
        <p>
          <strong>Note:</strong> To use Google Maps, you need to add your Google Maps API key to the environment variables.
          For now, the map displays event locations using a fallback system.
        </p>
      </div>

      <div
        ref={mapRef}
        className="w-full h-96 rounded-lg border border-border bg-gray-100"
        style={{ minHeight: '400px' }}
      >
        {/* Map will be rendered here */}
      </div>

      {/* Fallback: List view if Google Maps is not available */}
      {!window.google && (
        <div className="space-y-3">
          <p className="text-muted text-sm">
            Google Maps is not loaded. Showing events as a list:
          </p>
          {events.map(event => {
            const position = parseLocation(event.location || '')
            return (
              <button
                key={event.id}
                onClick={() => onSelectEvent(event.id)}
                className={`w-full text-left p-4 rounded-lg border-2 transition ${
                  selectedEventId === event.id
                    ? 'border-primary bg-primary/10'
                    : 'border-border hover:border-primary'
                }`}
              >
                <div className="flex items-start gap-3">
                  <span className="text-2xl">{getSportEmoji(event.sportType)}</span>
                  <div className="flex-1">
                    <h3 className="font-semibold text-foreground">{event.title}</h3>
                    <p className="text-sm text-muted">
                      📍 {event.location} ({position.lat.toFixed(4)}, {position.lng.toFixed(4)})
                    </p>
                    <p className="text-xs text-muted mt-1">
                      {event.date} at {event.time}
                    </p>
                  </div>
                </div>
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}
