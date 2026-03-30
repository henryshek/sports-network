import { useState } from 'react';
import { TOP_SPORTS } from '@/constants/sports';

export interface EventFilters {
  sportType: string[];
  skillLevel: string[];
  timeRange: 'all' | 'today' | 'week' | 'month';
  minCapacity: number;
  maxDistance: number;
  customSport?: string;
}

interface EventMapFiltersProps {
  onFiltersChange: (filters: EventFilters) => void;
}

const SPORTS = TOP_SPORTS.map(s => s.toLowerCase());

const SKILL_LEVELS = ['Beginner', 'Intermediate', 'Advanced', 'Professional'];

export function EventMapFilters({ onFiltersChange }: EventMapFiltersProps) {
  const [filters, setFilters] = useState<EventFilters>({
    sportType: [],
    skillLevel: [],
    timeRange: 'all',
    minCapacity: 0,
    maxDistance: 50,
  });

  const [showFilters, setShowFilters] = useState(false);
  const [showOthersInput, setShowOthersInput] = useState(false);
  const [otherSport, setOtherSport] = useState('');

  const handleSportToggle = (sport: string) => {
    const updated = filters.sportType.includes(sport)
      ? filters.sportType.filter(s => s !== sport)
      : [...filters.sportType, sport];
    
    const newFilters = { ...filters, sportType: updated };
    setFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const handleSkillToggle = (level: string) => {
    const updated = filters.skillLevel.includes(level)
      ? filters.skillLevel.filter(s => s !== level)
      : [...filters.skillLevel, level];
    
    const newFilters = { ...filters, skillLevel: updated };
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

  const handleOtherSportAdd = () => {
    if (otherSport.trim()) {
      const newFilters = { ...filters, customSport: otherSport.trim() };
      setFilters(newFilters);
      onFiltersChange(newFilters);
      setOtherSport('');
      setShowOthersInput(false);
    }
  };

  const resetFilters = () => {
    const resetFilters: EventFilters = {
      sportType: [],
      skillLevel: [],
      timeRange: 'all',
      minCapacity: 0,
      maxDistance: 50,
    };
    setFilters(resetFilters);
    setOtherSport('');
    onFiltersChange(resetFilters);
  };

  const activeFilterCount = 
    filters.sportType.length + 
    filters.skillLevel.length + 
    (filters.timeRange !== 'all' ? 1 : 0) +
    (filters.minCapacity > 0 ? 1 : 0) +
    (filters.maxDistance < 50 ? 1 : 0) +
    (filters.customSport ? 1 : 0);

  return (
    <div className="mb-6">
      {/* Filter Toggle Button */}
      <button
        onClick={() => setShowFilters(!showFilters)}
        className="w-full md:w-auto px-4 py-2 bg-primary text-white rounded-lg hover:opacity-90 transition font-semibold flex items-center justify-center gap-2"
      >
        🔍 Filters {activeFilterCount > 0 && `(${activeFilterCount})`}
      </button>

      {/* Reset Button */}
      {activeFilterCount > 0 && (
        <button
          onClick={resetFilters}
          className="ml-2 px-4 py-2 bg-muted text-foreground rounded-lg hover:opacity-90 transition text-sm"
        >
          Reset
        </button>
      )}

      {/* Filters Panel */}
      {showFilters && (
        <div className="mt-4 p-6 bg-surface rounded-lg border border-border space-y-6">
          {/* Sport Type Filter */}
          <div>
            <h3 className="font-semibold text-foreground mb-3">Sport Type (Top 10)</h3>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {SPORTS.map(sport => (
                <label key={sport} className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={filters.sportType.includes(sport)}
                    onChange={() => handleSportToggle(sport)}
                    className="w-4 h-4 rounded"
                  />
                  <span className="text-sm text-foreground capitalize">{sport}</span>
                </label>
              ))}
            </div>
            <button
              onClick={() => setShowOthersInput(!showOthersInput)}
              className="mt-3 w-full text-sm text-primary hover:underline"
            >
              + Others (Custom Sport)
            </button>
            {showOthersInput && (
              <div className="mt-3 flex gap-2">
                <input
                  type="text"
                  value={otherSport}
                  onChange={(e) => setOtherSport(e.target.value)}
                  placeholder="Enter custom sport..."
                  className="flex-1 px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <button
                  onClick={handleOtherSportAdd}
                  className="px-3 py-2 bg-primary text-white rounded-lg text-sm hover:opacity-90 transition"
                >
                  Add
                </button>
              </div>
            )}
            {filters.customSport && (
              <div className="mt-3 p-2 bg-primary/10 rounded-lg flex items-center justify-between">
                <span className="text-sm text-primary font-semibold">{filters.customSport}</span>
                <button
                  onClick={() => {
                    const newFilters = { ...filters, customSport: undefined };
                    setFilters(newFilters);
                    onFiltersChange(newFilters);
                  }}
                  className="text-primary hover:text-red-500 transition"
                >
                  ✕
                </button>
              </div>
            )}
          </div>

          {/* Skill Level Filter */}
          <div>
            <h3 className="font-semibold text-foreground mb-3">Skill Level</h3>
            <div className="space-y-2">
              {SKILL_LEVELS.map(level => (
                <label key={level} className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={filters.skillLevel.includes(level)}
                    onChange={() => handleSkillToggle(level)}
                    className="w-4 h-4 rounded"
                  />
                  <span className="text-sm text-foreground">{level}</span>
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

          {/* Capacity Filter */}
          <div>
            <h3 className="font-semibold text-foreground mb-3">Minimum Available Spots</h3>
            <input
              type="range"
              min="0"
              max="20"
              value={filters.minCapacity}
              onChange={(e) => handleCapacityChange(Number(e.target.value))}
              className="w-full"
            />
            <p className="text-sm text-muted mt-2">{filters.minCapacity} spots minimum</p>
          </div>

          {/* Distance Filter */}
          <div>
            <h3 className="font-semibold text-foreground mb-3">Maximum Distance</h3>
            <input
              type="range"
              min="1"
              max="50"
              value={filters.maxDistance}
              onChange={(e) => handleDistanceChange(Number(e.target.value))}
              className="w-full"
            />
            <p className="text-sm text-muted mt-2">{filters.maxDistance} km</p>
          </div>
        </div>
      )}
    </div>
  );
}
