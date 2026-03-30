import { useEffect, useRef } from 'react'
import { Event } from '@/types'

interface RealGoogleMapProps {
  events: Event[]
  onSelectEvent: (eventId: string) => void
  selectedEventId?: string
  apiKey?: string
}

declare global {
  interface Window {
    google: any
  }
}

export default function RealGoogleMap({ events, onSelectEvent, selectedEventId, apiKey }: RealGoogleMapProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstance = useRef<any>(null)
  const markersRef = useRef<any[]>([])
  const infoWindowsRef = useRef<any[]>([])

  // Load Google Maps script
  useEffect(() => {
    if (window.google && window.google.maps) {
      initializeMap()
      return
    }

    // If no API key, use fallback
    if (!apiKey) {
      console.warn('Google Maps API key not provided. Using fallback map.')
      return
    }

    // Load Google Maps script
    const script = document.createElement('script')
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}`
    script.async = true
    script.defer = true
    script.onload = () => {
      if (window.google && window.google.maps) {
        initializeMap()
      }
    }
    script.onerror = () => {
      console.error('Failed to load Google Maps script')
    }
    document.head.appendChild(script)

    return () => {
      document.head.removeChild(script)
    }
  }, [apiKey])

  const initializeMap = () => {
    if (!mapRef.current || mapInstance.current) return

    const defaultCenter = { lat: 37.7749, lng: -122.4194 } // San Francisco

    mapInstance.current = new window.google.maps.Map(mapRef.current, {
      zoom: 13,
      center: defaultCenter,
      mapTypeControl: true,
      fullscreenControl: true,
      streetViewControl: true,
      styles: [
        {
          featureType: 'all',
          elementType: 'labels.text.fill',
          stylers: [{ color: '#686868' }],
        },
        {
          featureType: 'water',
          elementType: 'geometry.fill',
          stylers: [{ color: '#c9c9c9' }],
        },
      ],
    })

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



  const addEventMarkers = () => {
    if (!mapInstance.current || !window.google) return

    clearMarkers()

    events.forEach(event => {
      const position = parseLocation(event.location || '')

      // Create marker
      const marker = new window.google.maps.Marker({
        position,
        map: mapInstance.current,
        title: event.title,
        icon: {
          path: window.google.maps.SymbolPath.CIRCLE,
          scale: 10,
          fillColor: selectedEventId === event.id ? '#0a7ea4' : '#4CAF50',
          fillOpacity: 1,
          strokeColor: '#fff',
          strokeWeight: 2,
        },
      })

      // Create info window
      const infoWindow = new window.google.maps.InfoWindow({
        content: `
          <div style="padding: 8px; font-family: Arial; font-size: 12px;">
            <h3 style="margin: 0 0 4px 0; font-size: 14px; font-weight: bold;">${event.title}</h3>
            <p style="margin: 2px 0; color: #666;">📍 ${event.location}</p>
            <p style="margin: 2px 0; color: #666;">📅 ${event.date} at ${event.time}</p>
            <p style="margin: 2px 0; color: #666;">👥 ${event.currentParticipants}/${event.maxParticipants}</p>
            <p style="margin: 2px 0; color: #666;">⭐ ${event.skillLevel}</p>
          </div>
        `,
      })

      marker.addListener('click', () => {
        // Close all other info windows
        infoWindowsRef.current.forEach(iw => iw.close())
        infoWindow.open(mapInstance.current, marker)
        onSelectEvent(event.id)
        mapInstance.current.panTo(position)
      })

      markersRef.current.push(marker)
      infoWindowsRef.current.push(infoWindow)
    })
  }

  const clearMarkers = () => {
    markersRef.current.forEach(marker => marker.setMap(null))
    infoWindowsRef.current.forEach(iw => iw.close())
    markersRef.current = []
    infoWindowsRef.current = []
  }

  useEffect(() => {
    if (mapInstance.current) {
      addEventMarkers()
    }
  }, [events, selectedEventId])

  return (
    <div className="space-y-4">
      {!apiKey && (
        <div className="bg-yellow-100 border border-yellow-400 rounded-lg p-4 text-sm text-yellow-800">
          <p>
            <strong>Note:</strong> To enable Google Maps, set the <code>VITE_GOOGLE_MAPS_API_KEY</code> environment variable.
            For now, showing events as an interactive list.
          </p>
        </div>
      )}

      <div
        ref={mapRef}
        className="w-full rounded-lg border border-border bg-gray-100"
        style={{ minHeight: '500px' }}
      >
        {/* Map will be rendered here */}
      </div>
    </div>
  )
}
