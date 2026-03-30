import { useState, useEffect } from 'react'

interface Location {
  name: string
  address: string
  latitude: number
  longitude: number
}

interface LocationAutocompleteProps {
  value: string
  onChange: (address: string, location?: Location) => void
  placeholder?: string
}

// Popular sports venues in Hong Kong
const HONG_KONG_VENUES: Location[] = [
  {
    name: 'Victoria Park',
    address: 'Victoria Park, Causeway Bay, Hong Kong',
    latitude: 22.2797,
    longitude: 114.1839,
  },
  {
    name: 'Hong Kong Tennis Centre',
    address: 'Hong Kong Tennis Centre, Wong Chuk Hang, Hong Kong',
    latitude: 22.2854,
    longitude: 114.1726,
  },
  {
    name: 'Repulse Bay Beach',
    address: 'Repulse Bay Beach, Hong Kong',
    latitude: 22.2863,
    longitude: 114.1766,
  },
  {
    name: 'Hong Kong Football Club',
    address: 'Hong Kong Football Club, Happy Valley, Hong Kong',
    latitude: 22.2750,
    longitude: 114.1847,
  },
  {
    name: 'Kowloon Park',
    address: 'Kowloon Park, Tsim Sha Tsui, Hong Kong',
    latitude: 22.2987,
    longitude: 114.1715,
  },
  {
    name: 'Hong Kong Stadium',
    address: 'Hong Kong Stadium, So Kon Po, Hong Kong',
    latitude: 22.2795,
    longitude: 114.1843,
  },
  {
    name: 'Sha Tin Sports Park',
    address: 'Sha Tin Sports Park, Sha Tin, Hong Kong',
    latitude: 22.3934,
    longitude: 114.1934,
  },
  {
    name: 'Tuen Mun Sports Ground',
    address: 'Tuen Mun Sports Ground, Tuen Mun, Hong Kong',
    latitude: 22.3856,
    longitude: 113.9734,
  },
  {
    name: 'Yuen Chau Shan Park',
    address: 'Yuen Chau Shan Park, Sha Tin, Hong Kong',
    latitude: 22.4156,
    longitude: 114.1956,
  },
  {
    name: 'Tai Tam Park',
    address: 'Tai Tam Park, Tai Tam, Hong Kong',
    latitude: 22.2520,
    longitude: 114.2020,
  },
]

export function LocationAutocomplete({
  value,
  onChange,
  placeholder = 'Enter venue address',
}: LocationAutocompleteProps) {
  const [suggestions, setSuggestions] = useState<Location[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)

  useEffect(() => {
    if (value.trim().length < 2) {
      setSuggestions([])
      setShowSuggestions(false)
      return
    }

    const filtered = HONG_KONG_VENUES.filter(
      venue =>
        venue.name.toLowerCase().includes(value.toLowerCase()) ||
        venue.address.toLowerCase().includes(value.toLowerCase())
    )

    setSuggestions(filtered)
    setShowSuggestions(filtered.length > 0)
  }, [value])

  const handleSelectLocation = (location: Location) => {
    onChange(location.address, location)
    setSuggestions([])
    setShowSuggestions(false)
  }

  return (
    <div className="relative">
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => value.trim().length >= 2 && setShowSuggestions(true)}
        placeholder={placeholder}
        className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
      />

      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-border rounded-lg shadow-lg z-10 max-h-64 overflow-y-auto">
          {suggestions.map((location, index) => (
            <button
              key={index}
              onClick={() => handleSelectLocation(location)}
              className="w-full text-left px-4 py-3 hover:bg-primary/10 transition border-b border-border last:border-b-0"
            >
              <p className="font-semibold text-foreground">{location.name}</p>
              <p className="text-xs text-muted">{location.address}</p>
            </button>
          ))}
        </div>
      )}

      {showSuggestions && suggestions.length === 0 && value.trim().length >= 2 && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-border rounded-lg shadow-lg z-10 p-4">
          <p className="text-sm text-muted">
            No venues found. You can still enter a custom address above.
          </p>
        </div>
      )}
    </div>
  )
}
