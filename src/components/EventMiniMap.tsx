import { useEffect, useRef } from 'react'

interface EventMiniMapProps {
  latitude: number
  longitude: number
  title: string
  height?: string
}

export function EventMiniMap({ latitude, longitude, title, height = '150px' }: EventMiniMapProps) {
  const mapRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!mapRef.current) return

    // Create a simple map using OpenStreetMap tiles
    const mapHTML = `
      <div style="width: 100%; height: 100%; position: relative; background: #f0f0f0; border-radius: 8px; overflow: hidden;">
        <iframe
          width="100%"
          height="100%"
          frameborder="0"
          src="https://www.openstreetmap.org/export/embed.html?bbox=${longitude - 0.01},${latitude - 0.01},${longitude + 0.01},${latitude + 0.01}&layer=mapnik&marker=${latitude},${longitude}"
          style="border: none; border-radius: 8px;"
        ></iframe>
        <div style="position: absolute; bottom: 0; right: 0; background: white; padding: 4px 8px; font-size: 10px; border-radius: 4px 0 0 0; margin: 2px;">
          📍 ${title}
        </div>
      </div>
    `

    mapRef.current.innerHTML = mapHTML
  }, [latitude, longitude, title])

  return (
    <div
      ref={mapRef}
      style={{ height }}
      className="rounded-lg overflow-hidden border border-border"
    />
  )
}
