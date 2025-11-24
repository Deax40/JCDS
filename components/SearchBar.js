import { useState } from 'react';
import { useRouter } from 'next/router';

export default function SearchBar({ placeholder = "Rechercher une formation...", className = "" }) {
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Rediriger vers la page de recherche avec le query
      router.push(`/formations?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <form onSubmit={handleSearch} className={`relative ${className}`}>
      <div className="relative">
        <i className="ph-bold ph-magnifying-glass text-xl absolute left-4 top-1/2 -translate-y-1/2 text-secondary"></i>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder={placeholder}
          className="w-full h-14 rounded-full border-2 border-line text-base pl-12 pr-32 focus:border-purple focus:outline-none transition-colors duration-300 bg-white shadow-sm hover:shadow-md"
        />
        <button
          type="submit"
          className="absolute right-2 top-1/2 -translate-y-1/2 button-main h-10 px-6 py-2 text-sm"
        >
          Rechercher
        </button>
      </div>
    </form>
  );
}
