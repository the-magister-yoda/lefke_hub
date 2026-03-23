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
    // Главный контейнер БЕЗ ограничений по ширине, чтобы полоса могла растянуться
    <div className="w-full pb-20 bg-white">
      
     {/* СЕКЦИЯ ПОИСКА */}
      <div className="w-full bg-[#f2f4f5] pt-[55px] pb-[40px] border-none"> 
        <div className="max-w-7xl mx-auto px-6 sm:px-10">
          <SearchBar onSearch={(q) => setSearch(q)} />
        </div>
      </div>

      {/* 2. СЕКЦИЯ КАТЕГОРИЙ: Белый фон, контент по центру */}
      <div className="max-w-7xl mx-auto px-6 sm:px-10 mt-16 mb-20">
        <h2 className="text-3xl font-extrabold text-center mb-12 text-[#002f34]">
          Categories on this hub
        </h2>
        
        <div className="flex flex-wrap justify-center gap-10 md:gap-14">
          {/* Кнопка "All": Стала больше (w-24 h-24) */}
          <div 
            onClick={() => setCategory("")}
            className="flex flex-col items-center cursor-pointer group"
          >
            <div className={`w-24 h-24 rounded-full flex items-center justify-center transition-all duration-300 border-2 ${
              category === "" ? "bg-emerald-900 border-black shadow-lg" : "bg-gray-100 border-transparent group-hover:bg-gray-200"
            }`}>
              {/* ALL стал больше (text-xl) */}
              <span className={`text-xl font-extrabold ${category === "" ? "text-white" : "text-gray-600"}`}>ALL</span>
            </div>
            {/* Текст стал жирнее (font-bold), чернее (text-[#002f34]) и чуть больше */}
            <span className="mt-4 font-bold text-base text-[#002f34]">All ads</span>
          </div>

          {/* Список категорий с иконками */}
          {categories.map(cat => (
            <div 
              key={cat.id}
              onClick={() => setCategory(cat.slug)}
              className="flex flex-col items-center cursor-pointer group"
            >
              {/* Круг стал больше (w-24 h-24), тень при выборе */}
              <div className={`w-24 h-24 rounded-full flex items-center justify-center transition-all duration-300 border-2 ${
                category === cat.slug ? "border-black bg-white shadow-xl" : "bg-gray-100 border-transparent group-hover:bg-gray-200"
              }`}>
                <img 
                  src={`/icons/${cat.slug}.png`} 
                  alt={cat.name}
                  // Иконка приблизилась! (w-16 h-16 вместо w-12 h-12)
                  className="w-16 h-16 object-contain"
                  onError={(e) => { e.target.src = '/icons/default.png'; }}
                />
              </div>
              {/* Текст стал жирнее, чернее (OLX style) и больше */}
              <span className={`mt-4 font-bold text-base transition-colors ${
                category === cat.slug ? "text-black" : "text-[#002f34]"
              }`}>
                {cat.name}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* 3. СЕКЦИЯ ОБЪЯВЛЕНИЙ: Контент по центру */}
      <div className="max-w-7xl mx-auto px-6 sm:px-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {ads.map(ad => (
            <AdCard key={ad.id} ad={ad} onFavoriteToggle={toggleFav} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default Home;