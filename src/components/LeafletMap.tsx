import React, { useEffect, useRef } from 'react';
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

    // Initialize map centered on San Francisco
    if (!map.current) {
      map.current = L.map(mapContainer.current).setView([37.7749, -122.4194], 12);

      // Add OpenStreetMap tiles
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
        maxZoom: 19,
      }).addTo(map.current);
    }

    // Clear existing markers
    map.current.eachLayer((layer) => {
      if (layer instanceof L.Marker) {
        map.current?.removeLayer(layer);
      }
    });

    // Add event markers
    events.forEach((event, index) => {
      const coordinates = getCoordinates(event.location);
      if (coordinates) {
        const marker = L.marker(coordinates, { icon: defaultIcon })
          .bindPopup(`
            <div class="p-2">
              <h3 class="font-bold">${event.title}</h3>
              <p class="text-sm">${event.location}</p>
              <p class="text-sm">${event.date} at ${event.time}</p>
              <p class="text-sm">${event.participants}/${event.maxParticipants} participants</p>
            </div>
          `)
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

function getCoordinates(location: string): [number, number] | null {
  const locationMap: Record<string, [number, number]> = {
    'Golden Gate Park': [37.7694, -122.4862],
    'Mission Bay': [37.7596, -122.3914],
    'Ocean Beach': [37.7596, -122.5107],
    'Dolores Park': [37.7599, -122.4148],
    'Central Park': [37.7749, -122.4194],
    'Downtown Sports Court': [37.7852, -122.4044],
  };

  for (const [key, coords] of Object.entries(locationMap)) {
    if (location.includes(key)) {
      return coords;
    }
  }

  return null;
}
