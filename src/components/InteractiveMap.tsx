import { useEffect, useRef } from 'react'
import { Event } from '@/types'

interface InteractiveMapProps {
  events: Event[]
  onSelectEvent: (eventId: string) => void
  selectedEventId?: string
}

declare global {
  interface Window {
    L: any
  }
}

export default function InteractiveMap({ events, onSelectEvent, selectedEventId }: InteractiveMapProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstance = useRef<any>(null)

  // Load Leaflet library
  useEffect(() => {
    // Check if Leaflet is already loaded
    if (window.L) {
      initializeMap()
      return
    }

    // Load Leaflet CSS
    const linkCSS = document.createElement('link')
    linkCSS.rel = 'stylesheet'
    linkCSS.href = 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.css'
    document.head.appendChild(linkCSS)

    // Load Leaflet JS
    const script = document.createElement('script')
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.js'
    script.async = true
    script.onload = () => {
      if (window.L) {
        initializeMap()
      }
    }
    document.head.appendChild(script)

    return () => {
      if (document.head.contains(linkCSS)) {
        document.head.removeChild(linkCSS)
      }
      if (document.head.contains(script)) {
        document.head.removeChild(script)
      }
    }
  }, [])

  const initializeMap = () => {
    if (!mapRef.current || mapInstance.current || !window.L) return

    // Create map centered on San Francisco
    const map = window.L.map(mapRef.current).setView([37.7749, -122.4194], 13)

    // Add OpenStreetMap tiles
    window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
      maxZoom: 19,
    }).addTo(map)

    mapInstance.current = map
    addEventMarkers()
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

  const addEventMarkers = () => {
    if (!mapInstance.current || !window.L) return

    events.forEach((event) => {
      const position = parseLocation(event.location || '')

      // Create custom icon with emoji
      const icon = window.L.divIcon({
        html: `
          <div style="
            background-color: ${selectedEventId === event.id ? '#0a7ea4' : '#4CAF50'};
            color: white;
            border-radius: 50%;
            width: 40px;
            height: 40px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 20px;
            border: 3px solid white;
            box-shadow: 0 2px 4px rgba(0,0,0,0.2);
            cursor: pointer;
          ">
            ${getSportEmoji((event as any).sport || 'basketball')}
          </div>
        `,
        iconSize: [40, 40],
        iconAnchor: [20, 20],
        popupAnchor: [0, -20],
      })

      // Create marker
      const marker = window.L.marker([position.lat, position.lng], { icon })
        .addTo(mapInstance.current)
        .bindPopup(`
          <div style="font-family: Arial; font-size: 12px;">
            <h3 style="margin: 0 0 4px 0; font-size: 14px; font-weight: bold;">${event.title}</h3>
            <p style="margin: 2px 0; color: #666;">📍 ${event.location}</p>
            <p style="margin: 2px 0; color: #666;">📅 ${event.date} at ${event.time}</p>
            <p style="margin: 2px 0; color: #666;">👥 ${event.currentParticipants}/${event.maxParticipants}</p>
            <p style="margin: 2px 0; color: #666;">⭐ ${event.skillLevel}</p>
          </div>
        `)

      marker.on('click', () => {
        onSelectEvent(event.id)
        mapInstance.current.setView([position.lat, position.lng], 14)
      })
    })
  }

  useEffect(() => {
    if (mapInstance.current && window.L) {
      // Clear existing markers
      mapInstance.current.eachLayer((layer: any) => {
        if (layer instanceof window.L.Marker) {
          mapInstance.current.removeLayer(layer)
        }
      })
      addEventMarkers()
    }
  }, [events, selectedEventId])

  return (
    <div className="space-y-4">
      <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-sm text-green-800">
        <p>
          <strong>📍 Interactive Map:</strong> Click on markers to view event details. Showing {events.length} events near San Francisco.
        </p>
      </div>

      {/* Interactive Map */}
      <div
        ref={mapRef}
        className="w-full rounded-lg border border-border overflow-hidden bg-gray-100"
        style={{ minHeight: '500px' }}
      >
        {/* Leaflet map will be rendered here */}
      </div>

      {/* Events List */}
      <div className="space-y-3">
        <h3 className="font-semibold text-foreground">Events Near You</h3>
        {events.map((event, index) => (
          <div
            key={event.id}
            onClick={() => onSelectEvent(event.id)}
            className={`p-4 rounded-lg border-2 cursor-pointer transition ${
              selectedEventId === event.id
                ? 'border-primary bg-primary/5'
                : 'border-border bg-white hover:border-primary'
            }`}
          >
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center text-sm font-bold flex-shrink-0">
                {index + 1}
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-semibold text-foreground truncate">{event.title}</h4>
                <p className="text-sm text-muted">📍 {event.location}</p>
                <p className="text-sm text-muted">📅 {event.date} at {event.time}</p>
                <div className="flex gap-2 mt-2 text-xs">
                  <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded">
                    {event.currentParticipants}/{event.maxParticipants}
                  </span>
                  <span className="bg-green-100 text-green-700 px-2 py-1 rounded">
                    {event.skillLevel}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
