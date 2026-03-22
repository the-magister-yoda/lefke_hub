import { useState } from "react";

function SearchBar({ onSearch }) {
  const [query, setQuery] = useState("");

  const handleBtnClick = () => {
    if (onSearch) onSearch(query);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleBtnClick();
  };

  return (
    <div className="flex w-full shadow-md rounded-lg border border-gray-600 h-12 bg-gray-500 overflow-hidden relative">
      
      {/* Поле ввода */}
      <div className="relative flex-1 min-w-0 h-full">
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 z-10">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Search for anything..."
          className="w-full h-full pl-10 pr-4 text-[#003412] placeholder-gray-400 focus:outline-none text-base border-none"
        />
      </div>

      {/* Кнопка поиска */}
      <button
        type="button"
        onClick={handleBtnClick}
        className="flex-shrink-0 w-[120px] h-full bg-emerald-950 hover:bg-emerald-900 text-white font-bold text-base transition-colors active:scale-95 flex items-center justify-center relative z-20 border-l border-emerald-800"
      >
        Search
      </button>
    </div>
  );
}

export default SearchBar;