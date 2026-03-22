import { useEffect, useState } from "react";
import { api } from "../api/api";
import AdCard from "../components/AdCard";
import SearchBar from "../components/SearchBar";

function Home() {
  const [ads, setAds] = useState([]);
  const [categories, setCategories] = useState([]);
  const [category, setCategory] = useState("");
  const [search, setSearch] = useState("");

  useEffect(() => {
    api.get("/category").then(res => setCategories(res.data));
  }, []);

  useEffect(() => {
    fetchAds();
  }, [category, search]);

  const fetchAds = async () => {
    const res = await api.get("/ad", {
      params: {
        category: category || undefined,
        search: search || undefined,
      },
    });
    setAds(res.data.items);
  };

  const toggleFav = async (id) => {
    try {
      const res = await api.post(`/favorite/${id}`);
      setAds(prev => prev.map(a => a.id === id ? { ...a, is_favorite: res.data.is_favorite } : a));
    } catch (err) {
      if (err.response?.status === 401) alert("Please login first");
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-6 sm:px-10 pb-20">
      
      {/* Теперь поиск в простом блоке без лишних ограничений */}
      <div className="mt-8 mb-8 w-full">
        <SearchBar onSearch={(q) => setSearch(q)} />
      </div>

      <div className="flex gap-3 mb-8 overflow-x-auto pb-2 scrollbar-hide">
        <button
          onClick={() => setCategory("")}
          className={`px-5 py-2 rounded-md font-bold transition whitespace-nowrap ${
            category === "" ? "bg-black text-white" : "bg-gray-200 text-gray-700"
          }`}
        >
          All
        </button>
        {categories.map(cat => (
          <button
            key={cat.id}
            onClick={() => setCategory(cat.slug)}
            className={`px-5 py-2 rounded-md font-bold whitespace-nowrap transition ${
              category === cat.slug ? "bg-black text-white" : "bg-gray-200 text-gray-700"
            }`}
          >
            {cat.name}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {ads.map(ad => (
          <AdCard key={ad.id} ad={ad} onFavoriteToggle={toggleFav} />
        ))}
      </div>
    </div>
  );
}

export default Home;