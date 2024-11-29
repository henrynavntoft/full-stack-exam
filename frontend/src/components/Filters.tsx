import { useState, useEffect } from 'react';

interface FiltersProps {
  onFilterChange: (filters: { searchQuery: string; artist: string; period: string }) => void;
}

function Filters({ onFilterChange }: FiltersProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [period, setPeriod] = useState('');
  const [artist, setArtist] = useState('');

  // Debounce state updates to avoid immediate `onFilterChange` calls
  useEffect(() => {
    const timeout = setTimeout(() => {
      onFilterChange({ searchQuery, period, artist });
    }, 300); // Adjust debounce delay as needed

    return () => clearTimeout(timeout); // Cleanup timeout on unmount or re-render
  }, [searchQuery, period, artist, onFilterChange]);

  const resetFilters = () => {
    setSearchQuery('');
    setPeriod('');
    setArtist('');
    onFilterChange({ searchQuery: '', period: '', artist: '' });
  };

  return (
    <div className="p-4 mb-6 border-b border-border">
      <div className="flex justify-between mb-4">
        <h2 className="text-2xl font-bold text-primary">Filters</h2>
        <button onClick={resetFilters} className="text-primary hover:text-primary-dark">
          Reset Filters
        </button>
      </div>
      <div className="flex flex-wrap -mx-4">
        <div className="w-full md:w-1/2 xl:w-1/3 px-4 mb-4">
          <label className="block mb-2 text-sm text-muted-foreground">Search</label>
          <input
            className="block w-full px-4 py-2 text-sm text-muted-foreground bg-white border border-border rounded-lg focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
            type="text"
            placeholder="Title, period.."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="w-full md:w-1/2 xl:w-1/3 px-4 mb-4">
          <label className="block mb-2 text-sm text-muted-foreground">Period</label>
          <select
            className="block w-full px-4 py-2 text-sm text-muted-foreground bg-white border border-border rounded-lg focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
          >
            <option value="">All</option>
            <option value="15">1600's</option>
            <option value="16">1700's</option>
            <option value="17">1800's</option>
          </select>
        </div>
        <div className="w-full md:w-1/2 xl:w-1/3 px-4 mb-4">
          <label className="block mb-2 text-sm text-muted-foreground">Artists</label>
          <select
            className="block w-full px-4 py-2 text-sm text-muted-foreground bg-white border border-border rounded-lg focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
            value={artist}
            onChange={(e) => setArtist(e.target.value)}
          >
            <option value="">All</option>
            <option value="parmigianino">Parmigianino</option>
            <option value="carpi">Carpi</option>
            <option value="saenredam">Saenredam</option>
            <option value="stimmer">Stimmer</option>
            <option value="rihel">Rihel</option>
            <option value="trento">Trento</option>
          </select>
        </div>
      </div>
    </div>
  );
}

export default Filters;