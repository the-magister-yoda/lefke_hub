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
    /* Внешний контейнер теперь bg-emerald-900 */
    <div className="flex w-full rounded-md overflow-hidden h-[60px] bg-emerald-900">
      
      {/* Левая часть (Поле ввода) - делаем БЕЛЫМ внутри, чтобы текст читался */}
      <div className="relative flex-1 flex items-center bg-white">
        <div className="pl-6 pr-3 text-emerald-900">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Search for anything..."
          /* border-none и outline-none убирают все рамки инпута */
          className="w-full h-full text-base text-emerald-900 placeholder-gray-400 border-none outline-none"
        />
      </div>

      {/* Кнопка поиска - СТРОГО bg-emerald-900 без бордеров слева */}
      <button
        type="button"
        onClick={handleBtnClick}
        className="px-10 h-full bg-emerald-950 hover:bg-emerald-900 text-white font-bold text-lg transition-all border-none flex items-center justify-center"
      >
        Search
      </button>
    </div>
  );
}

export default SearchBar;