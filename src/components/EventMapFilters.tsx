import { useState } from 'react';

export interface EventFilters {
  sportType: string[];
  skillLevel: string[];
  timeRange: 'all' | 'today' | 'week' | 'month';
  district: string[];
  minCapacity: number;
  maxDistance: number;
  customSport?: string;
}

interface EventMapFiltersProps {
  onFiltersChange: (filters: EventFilters) => void;
}

const SPORTS = [
  'basketball', 'soccer', 'tennis', 'volleyball', 'badminton', 'cricket', 'baseball',
  'running', 'cycling', 'swimming', 'golf', 'hockey', 'rugby', 'american football',
  'table tennis', 'squash', 'pickleball', 'martial arts', 'boxing',
  'wrestling', 'weightlifting', 'yoga', 'pilates', 'crossfit', 'rock climbing',
  'skateboarding', 'surfing', 'kayaking', 'hiking', 'mountain biking', 'ice skating',
  'roller skating', 'bowling', 'archery', 'fencing', 'gymnastics', 'parkour',
  'dance', 'aerobics', 'zumba', 'tai chi', 'karate', 'judo', 'taekwondo',
  'handball', 'lacrosse', 'ultimate frisbee', 'cornhole', 'paddleball', 'racquetball',
  'badminton', 'darts', 'pool', 'billiards', 'ping pong', 'tennis'
];

const SKILL_LEVELS = ['Beginner', 'Intermediate', 'Advanced', 'Professional'];
const DISTRICTS = ['Golden Gate Park', 'Mission Bay', 'Ocean Beach', 'Dolores Park', 'Downtown', 'Central Park'];

export function EventMapFilters({ onFiltersChange }: EventMapFiltersProps) {
  const [filters, setFilters] = useState<EventFilters>({
    sportType: [],
    skillLevel: [],
    timeRange: 'all',
    district: [],
    minCapacity: 0,
    maxDistance: 50,
  });

  const [showFilters, setShowFilters] = useState(false);
  const [customSport, setCustomSport] = useState('');
  const [showCustomInput, setShowCustomInput] = useState(false);

  const handleSportToggle = (sport: string) => {
    const updated = filters.sportType.includes(sport)
      ? filters.sportType.filter(s => s !== sport)
      : [...filters.sportType, sport];
    
    const newFilters = { ...filters, sportType: updated };
    setFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const handleSkillToggle = (skill: string) => {
    const updated = filters.skillLevel.includes(skill)
      ? filters.skillLevel.filter(s => s !== skill)
      : [...filters.skillLevel, skill];
    
    const newFilters = { ...filters, skillLevel: updated };
    setFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const handleDistrictToggle = (district: string) => {
    const updated = filters.district.includes(district)
      ? filters.district.filter(d => d !== district)
      : [...filters.district, district];
    
    const newFilters = { ...filters, district: updated };
    setFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const handleTimeChange = (time: 'all' | 'today' | 'week' | 'month') => {
    const newFilters = { ...filters, timeRange: time };
    setFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const handleCapacityChange = (value: number) => {
    const newFilters = { ...filters, minCapacity: value };
    setFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const handleDistanceChange = (value: number) => {
    const newFilters = { ...filters, maxDistance: value };
    setFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const handleCustomSportChange = (value: string) => {
    setCustomSport(value);
    if (value.trim()) {
      const newFilters = { ...filters, customSport: value.trim() };
      setFilters(newFilters);
      onFiltersChange(newFilters);
    }
  };

  const clearCustomSport = () => {
    setCustomSport('');
    setShowCustomInput(false);
    const newFilters = { ...filters, customSport: undefined };
    setFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const resetFilters = () => {
    const resetFilters: EventFilters = {
      sportType: [],
      skillLevel: [],
      timeRange: 'all',
      district: [],
      minCapacity: 0,
      maxDistance: 50,
    };
    setFilters(resetFilters);
    setCustomSport('');
    setShowCustomInput(false);
    onFiltersChange(resetFilters);
  };

  const activeFilterCount = 
    filters.sportType.length + 
    filters.skillLevel.length + 
    filters.district.length + 
    (filters.timeRange !== 'all' ? 1 : 0) +
    (filters.minCapacity > 0 ? 1 : 0) +
    (filters.maxDistance < 50 ? 1 : 0) +
    (filters.customSport ? 1 : 0);

  return (
    <div className="mb-6">
      {/* Filter Toggle Button */}
      <button
        onClick={() => setShowFilters(!showFilters)}
        className="w-full bg-primary text-white font-semibold py-3 rounded-lg flex items-center justify-between px-4 hover:opacity-90 transition"
      >
        <span>🔍 Filters {activeFilterCount > 0 && `(${activeFilterCount})`}</span>
        <span>{showFilters ? '▼' : '▶'}</span>
      </button>

      {/* Filter Panel */}
      {showFilters && (
        <div className="bg-surface rounded-lg border border-border p-6 mt-4 space-y-6">
          {/* Sport Type Filter */}
          <div>
            <h3 className="font-semibold text-foreground mb-3">Sport Type</h3>
            <div className="grid grid-cols-2 gap-2 mb-4 max-h-64 overflow-y-auto">
              {SPORTS.map(sport => (
                <label key={sport} className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={filters.sportType.includes(sport)}
                    onChange={() => handleSportToggle(sport)}
                    className="w-4 h-4 rounded"
                  />
                  <span className="text-sm capitalize text-foreground">{sport}</span>
                </label>
              ))}
            </div>
            
            {/* Custom Sport Section */}
            <div className="border-t border-border pt-4">
              {customSport ? (
                <div className="flex items-center justify-between bg-primary/10 rounded-lg p-3">
                  <span className="text-sm font-semibold text-foreground">Custom: {customSport}</span>
                  <button
                    onClick={clearCustomSport}
                    className="text-xs bg-error text-white px-2 py-1 rounded hover:opacity-90"
                  >
                    ✕ Clear
                  </button>
                </div>
              ) : showCustomInput ? (
                <div className="space-y-2">
                  <input
                    type="text"
                    placeholder="Enter custom sport (e.g., Pickleball, Squash)"
                    value={customSport}
                    onChange={(e) => handleCustomSportChange(e.target.value)}
                    className="w-full px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                    autoFocus
                  />
                  <button
                    onClick={() => setShowCustomInput(false)}
                    className="w-full text-xs bg-muted text-foreground px-2 py-1 rounded hover:opacity-90"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setShowCustomInput(true)}
                  className="w-full text-sm bg-primary/20 text-primary font-semibold px-3 py-2 rounded-lg hover:bg-primary/30 transition"
                >
                  + Add Custom Sport
                </button>
              )}
            </div>
          </div>

          {/* Skill Level Filter */}
          <div>
            <h3 className="font-semibold text-foreground mb-3">Skill Level</h3>
            <div className="grid grid-cols-2 gap-2">
              {SKILL_LEVELS.map(skill => (
                <label key={skill} className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={filters.skillLevel.includes(skill)}
                    onChange={() => handleSkillToggle(skill)}
                    className="w-4 h-4 rounded"
                  />
                  <span className="text-sm text-foreground">{skill}</span>
                </label>
              ))}
            </div>
          </div>

          {/* District Filter */}
          <div>
            <h3 className="font-semibold text-foreground mb-3">District/Area</h3>
            <div className="space-y-2">
              {DISTRICTS.map(district => (
                <label key={district} className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={filters.district.includes(district)}
                    onChange={() => handleDistrictToggle(district)}
                    className="w-4 h-4 rounded"
                  />
                  <span className="text-sm text-foreground">{district}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Time Range Filter */}
          <div>
            <h3 className="font-semibold text-foreground mb-3">Time Range</h3>
            <div className="space-y-2">
              {(['all', 'today', 'week', 'month'] as const).map(time => (
                <label key={time} className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="radio"
                    name="timeRange"
                    checked={filters.timeRange === time}
                    onChange={() => handleTimeChange(time)}
                    className="w-4 h-4"
                  />
                  <span className="text-sm text-foreground capitalize">
                    {time === 'all' ? 'All Times' : `This ${time}`}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Distance Filter */}
          <div>
            <h3 className="font-semibold text-foreground mb-3">
              Max Distance: {filters.maxDistance} km
            </h3>
            <input
              type="range"
              min="1"
              max="50"
              value={filters.maxDistance}
              onChange={(e) => handleDistanceChange(Number(e.target.value))}
              className="w-full"
            />
          </div>

          {/* Capacity Filter */}
          <div>
            <h3 className="font-semibold text-foreground mb-3">
              Min Available Spots: {filters.minCapacity}
            </h3>
            <input
              type="range"
              min="0"
              max="20"
              value={filters.minCapacity}
              onChange={(e) => handleCapacityChange(Number(e.target.value))}
              className="w-full"
            />
          </div>

          {/* Reset Button */}
          {activeFilterCount > 0 && (
            <button
              onClick={resetFilters}
              className="w-full bg-muted text-foreground font-semibold py-2 rounded-lg hover:opacity-90 transition"
            >
              Reset Filters
            </button>
          )}
        </div>
      )}
    </div>
  );
}
