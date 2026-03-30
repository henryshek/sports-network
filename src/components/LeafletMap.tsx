import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Event } from '../types';

interface LeafletMapProps {
  events: Event[];
  onEventSelect?: (event: Event) => void;
}

// Fix for default markers in Leaflet
const defaultIcon = L.icon({
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

L.Marker.prototype.options.icon = defaultIcon;

export function LeafletMap({ events, onEventSelect }: LeafletMapProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<L.Map | null>(null);

  useEffect(() => {
    if (!mapContainer.current) return;

    // Initialize map centered on Hong Kong
    if (!map.current) {
      map.current = L.map(mapContainer.current).setView([22.3193, 114.1694], 12);

      // Add OpenStreetMap tiles
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
        maxZoom: 19,
      }).addTo(map.current);
    }

    // Clear existing markers
    map.current.eachLayer((layer: L.Layer) => {
      if (layer instanceof L.Marker) {
        map.current?.removeLayer(layer);
      }
    });

    // Add event markers
    events.forEach((event) => {
      // Use event latitude/longitude if available, otherwise try to get from location name
      const coordinates = (event.latitude && event.longitude)
        ? [event.latitude, event.longitude] as [number, number]
        : getCoordinates(event.location);

      if (coordinates) {
        // Create custom marker with sport emoji
        const sportEmoji = getSportEmoji(event.sportType);
        const customIcon = L.divIcon({
          html: `<div style="font-size: 28px; display: flex; align-items: center; justify-content: center; width: 40px; height: 40px; background: white; border-radius: 50%; border: 2px solid #3b82f6; box-shadow: 0 2px 4px rgba(0,0,0,0.2); cursor: pointer;">${sportEmoji}</div>`,
          iconSize: [40, 40],
          iconAnchor: [20, 40],
          popupAnchor: [0, -40],
          className: 'custom-marker',
        });

        const marker = L.marker(coordinates, { icon: customIcon })
          .addTo(map.current!);

        marker.on('click', () => {
          onEventSelect?.(event);
        });
      }
    });

    return () => {
      // Cleanup is handled by Leaflet
    };
  }, [events, onEventSelect]);

  return (
    <div
      ref={mapContainer}
      className="w-full rounded-lg border border-border overflow-hidden"
      style={{ height: '400px' }}
    />
  );
}

function getSportEmoji(sport: string): string {
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
  };
  return emojis[sport.toLowerCase()] || '📍';
}

function getCoordinates(location: string): [number, number] | null {
  const locationMap: Record<string, [number, number]> = {
    'Victoria Park': [22.2797, 114.1839],
    'Hong Kong Tennis Centre': [22.2854, 114.1726],
    'Repulse Bay': [22.2863, 114.1766],
    'Hong Kong Football Club': [22.2750, 114.1847],
    'Kowloon Park': [22.2987, 114.1715],
    'Hong Kong Stadium': [22.2795, 114.1843],
    'Sha Tin Sports Park': [22.3934, 114.1934],
    'Tuen Mun Sports Ground': [22.3856, 113.9734],
    'Yuen Chau Shan Park': [22.4156, 114.1956],
    'Tai Tam Park': [22.2520, 114.2020],
  };

  for (const [key, coords] of Object.entries(locationMap)) {
    if (location.includes(key)) {
      return coords;
    }
  }

  return null;
}
