import { useState } from "react";
import { useNavigate } from "react-router-dom";

function SearchBar() {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  const handleSearch = () => {
    if (query.trim()) {
      // Перенаправляем на страницу поиска с параметром
      navigate(`/search?q=${encodeURIComponent(query)}`);
    }
  };

  return (
    <div className="flex gap-1 w-full max-w-5xl mx-auto">
      {/* Поле ввода */}
      <div className="relative flex-grow">
        <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="What are you looking for?"
          className="w-full pl-12 pr-4 h-14 bg-white rounded-l-md border border-gray-100 text-[#002f34] placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-600 shadow-inner"
        />
      </div>

      {/* Кнопка поиска с твоим цветом (emerald-950/900) */}
      <button
        onClick={handleSearch}
        className="h-14 px-10 bg-emerald-900 hover:bg-emerald-800 text-white rounded-r-md font-bold transition-colors active:scale-95"
      >
        Search
      </button>
    </div>
  );
}

export default SearchBar;