'use client';
import React, { useState, useMemo, useEffect } from 'react';
import { Search } from 'lucide-react';
import { getAllGenres, getGames } from '@/store/api/gameApi';

const PLATFORM_OPTIONS = ['PC', 'PS5', 'Xbox Series X/S'];

export default function FilterSidebar({ updateFilters, currentGenre, currentPlatform, currentLanguage, minPrice, maxPrice }) {
  const [priceRange, setPriceRange] = useState({ min: minPrice, max: maxPrice });
  const [genreSearch, setGenreSearch] = useState('');
  const [langSearch, setLangSearch] = useState('');
  const [genreList, setGenreList] = useState([]);
  const [counts, setCounts] = useState({ platformMap: {}, genreMap: {}, langMap: {} });

  useEffect(() => {
    setPriceRange({ min: minPrice, max: maxPrice });
  }, [minPrice, maxPrice]);

  useEffect(() => {
    let isMounted = true;
    const loadFacetData = async () => {
      try {
        const [genreResponse, gamesResponse] = await Promise.all([
          getAllGenres(),
          getGames({ limit: 100 }),
        ]);
        if (!isMounted) return;
        const genres = genreResponse.data || [];
        setGenreList(genres);
        const genreMap = {};
        (gamesResponse.data || []).forEach((game) => {
          if (game.genre) {
            genreMap[game.genre] = (genreMap[game.genre] || 0) + 1;
          }
        });
        const platformMap = {};
        const platformResults = await Promise.all(
          PLATFORM_OPTIONS.map((platform) => getGames({ platform, limit: 1 }))
        );
        platformResults.forEach((result, index) => {
          const total = result.meta?.total ?? 0;
          if (total > 0) {
            platformMap[PLATFORM_OPTIONS[index]] = total;
          }
        });
        const langMap = {};
        const languageCandidates = ['English', 'French', 'German', 'Spanish', 'Italian', 'Japanese', 'Korean', 'Chinese', 'Portuguese', 'Russian', 'Polish', 'Arabic'];
        const languageResults = await Promise.all(
          languageCandidates.map((language) => getGames({ language, limit: 1 }))
        );
        languageResults.forEach((result, index) => {
          const total = result.meta?.total ?? 0;
          if (total > 0) {
            langMap[languageCandidates[index]] = total;
          }
        });
        if (isMounted) {
          setCounts({ platformMap, genreMap, langMap });
        }
      } catch {
        if (isMounted) {
          setGenreList([]);
          setCounts({ platformMap: {}, genreMap: {}, langMap: {} });
        }
      }
    };
    loadFacetData();
    return () => {
      isMounted = false;
    };
  }, []);

  const filteredGenres = useMemo(() => {
    const names = genreList.map((genre) => genre.name);
    return names.filter((genre) =>
      genre.toLowerCase().includes(genreSearch.toLowerCase())
    );
  }, [genreList, genreSearch]);

  const filteredLanguages = useMemo(() => {
    return Object.keys(counts.langMap).filter((language) =>
      language.toLowerCase().includes(langSearch.toLowerCase())
    );
  }, [counts.langMap, langSearch]);

  const handlePriceChange = (e, type) => {
    const val = parseFloat(e.target.value) || 0;
    setPriceRange((prev) => ({ ...prev, [type]: val }));
  };

  const applyPriceFilter = () => {
    updateFilters({ minPrice: priceRange.min, maxPrice: priceRange.max });
  };

  return (
    <div className="w-full flex flex-col gap-8 p-4 bg-gray-50 rounded-md select-none">
      <style jsx global>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
      <div className="flex flex-col gap-4">
        <h3 className="text-md font-semibold tracking-wider text-gray-800 border-b border-gray-100 pb-2">Price</h3>
        <div className="flex flex-col gap-3">
          <div className="relative w-full h-1 bg-gray-200 rounded">
            <div className="absolute top-0 bottom-0 left-0 right-0 bg-[#6C47FF] rounded" />
          </div>
          <div className="flex items-center justify-between gap-2 mt-1">
            <span className="text-sm font-medium text-gray-700">
              Price: <span className="font-bold text-gray-900">${priceRange.min} — ${priceRange.max}</span>
            </span>
            <button
              onClick={applyPriceFilter}
              className="px-4 py-1.5 bg-gray-100 hover:bg-[#6C47FF] hover:text-white text-gray-800 text-xs font-bold uppercase tracking-wider rounded transition-colors duration-200"
            >
              Filter
            </button>
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-3">
        <h3 className="text-sm font-bold uppercase tracking-wider text-gray-900 border-b border-gray-100 pb-2">Platform</h3>
        <div className="flex flex-col gap-2.5 max-h-48 overflow-y-auto no-scrollbar">
          {Object.keys(counts.platformMap).map((platform) => {
            const isChecked = currentPlatform.toLowerCase() === platform.toLowerCase();
            return (
              <label key={platform} className="flex items-center justify-between group cursor-pointer">
                <div className="flex items-center gap-2.5">
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => updateFilters({ platform: isChecked ? null : platform.toLowerCase() })}
                    className="w-4 h-4 border-gray-300 rounded text-[#6C47FF] focus:ring-[#6C47FF] cursor-pointer"
                  />
                  <span className={`text-sm transition-colors ${isChecked ? 'text-[#6C47FF] font-semibold' : 'text-gray-600 group-hover:text-gray-900'}`}>
                    {platform}
                  </span>
                </div>
                <span className="text-xs font-medium text-gray-400 bg-gray-50 px-2 py-0.5 rounded-full border border-gray-100">
                  {counts.platformMap[platform]}
                </span>
              </label>
            );
          })}
        </div>
      </div>
      <div className="flex flex-col gap-3">
        <h3 className="text-sm font-bold uppercase tracking-wider text-gray-900 border-b border-gray-100 pb-2">Genre</h3>
        <div className="relative flex items-center mb-1">
          <input
            type="text"
            placeholder="Find a Genre"
            value={genreSearch}
            onChange={(e) => setGenreSearch(e.target.value)}
            className="w-full pl-3 pr-8 py-1.5 border border-gray-200 rounded text-sm focus:outline-none focus:border-[#6C47FF]"
          />
          <Search size={14} className="absolute right-3 text-gray-400" />
        </div>
        <div className="flex flex-col gap-2.5 max-h-48 overflow-y-auto no-scrollbar pr-1">
          {filteredGenres.map((genre) => {
            const isChecked = currentGenre.toLowerCase() === genre.toLowerCase();
            return (
              <label key={genre} className="flex items-center justify-between group cursor-pointer">
                <div className="flex items-center gap-2.5">
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => updateFilters({ genre: isChecked ? null : genre.toLowerCase() })}
                    className="w-4 h-4 border-gray-300 rounded text-[#6C47FF] focus:ring-[#6C47FF] cursor-pointer"
                  />
                  <span className={`text-sm transition-colors ${isChecked ? 'text-[#6C47FF] font-semibold' : 'text-gray-600 group-hover:text-gray-900'}`}>
                    {genre}
                  </span>
                </div>
                <span className="text-xs font-medium text-gray-400 bg-gray-50 px-2 py-0.5 rounded-full border border-gray-100">
                  {counts.genreMap[genre] || 0}
                </span>
              </label>
            );
          })}
        </div>
      </div>
      <div className="flex flex-col gap-3">
        <h3 className="text-sm font-bold uppercase tracking-wider text-gray-900 border-b border-gray-100 pb-2">Supported Language</h3>
        <div className="relative flex items-center mb-1">
          <input
            type="text"
            placeholder="Find a Language"
            value={langSearch}
            onChange={(e) => setLangSearch(e.target.value)}
            className="w-full pl-3 pr-8 py-1.5 border border-gray-200 rounded text-sm focus:outline-none focus:border-[#6C47FF]"
          />
          <Search size={14} className="absolute right-3 text-gray-400" />
        </div>
        <div className="flex flex-col gap-2.5 max-h-48 overflow-y-auto no-scrollbar pr-1 border-gray-50">
          {filteredLanguages.map((lang) => {
            const isChecked = currentLanguage.toLowerCase() === lang.toLowerCase();
            return (
              <label key={lang} className="flex items-center justify-between group cursor-pointer">
                <div className="flex items-center gap-2.5">
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => updateFilters({ language: isChecked ? null : lang.toLowerCase() })}
                    className="w-4 h-4 border-gray-300 rounded text-[#6C47FF] focus:ring-[#6C47FF] cursor-pointer"
                  />
                  <span className={`text-sm transition-colors ${isChecked ? 'text-[#6C47FF] font-semibold' : 'text-gray-600 group-hover:text-gray-900'}`}>
                    {lang}
                  </span>
                </div>
                <span className="text-xs font-medium text-gray-400 bg-gray-50 px-2 py-0.5 rounded-full border border-gray-100">
                  {counts.langMap[lang]}
                </span>
              </label>
            );
          })}
        </div>
      </div>
    </div>
  );
}
