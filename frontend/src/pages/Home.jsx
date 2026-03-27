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

  // Функция для разделения массива категорий на 2 строки для мобилки
  const rows = [[], []];
  const allCategories = [{ id: 'all', name: 'All ads', slug: '' }, ...categories];
  allCategories.forEach((cat, idx) => {
    rows[idx % 2].push(cat);
  });

  return (
    <div className="w-full pb-20 bg-white">
      
      {/* 1. СЕКЦИЯ ПОИСКА */}
      <div className="w-full bg-[#f2f4f5] pt-[30px] md:pt-[55px] pb-[25px] md:pb-[40px] border-none"> 
        <div className="max-w-7xl mx-auto px-4 md:px-10">
          <SearchBar onSearch={(q) => setSearch(q)} />
        </div>
      </div>

      {/* 2. СЕКЦИЯ КАТЕГОРИЙ */}
      <div className="max-w-7xl mx-auto px-4 md:px-10 mt-8 md:mt-16 mb-10 md:mb-20">
        <h2 className="text-lg md:text-3xl font-extrabold text-left md:text-center mb-6 md:mb-12 text-[#002f34]">
          Categories on this hub
        </h2>
        
        {/* Мобильная версия: Двухэтажная карусель (скрыта на md+) */}
        <div className="flex md:hidden overflow-x-auto pb-4 no-scrollbar snap-x scroll-smooth">
          <div className="flex flex-col gap-4">
            {rows.map((row, rowIndex) => (
              <div key={rowIndex} className="flex gap-4">
                {row.map(cat => (
                  <div 
                    key={cat.id}
                    onClick={() => setCategory(cat.slug)}
                    className="flex flex-col items-center cursor-pointer min-w-[80px] snap-center"
                  >
                    <div className={`w-14 h-14 rounded-full flex items-center justify-center transition-all border-2 ${
                      category === cat.slug ? "bg-emerald-900 border-black shadow-md" : "bg-gray-100 border-transparent"
                    }`}>
                      {cat.slug === '' ? (
                        <span className={`text-xs font-black ${category === '' ? "text-white" : "text-gray-600"}`}>ALL</span>
                      ) : (
                        <img 
                          src={`/icons/${cat.slug}.png`} 
                          alt={cat.name}
                          className="w-8 h-8 object-contain"
                          onError={(e) => { e.target.src = '/icons/default.png'; }}
                        />
                      )}
                    </div>
                    <span className="mt-1.5 font-bold text-[10px] text-[#002f34] text-center whitespace-nowrap overflow-hidden text-ellipsis w-20">
                      {cat.name}
                    </span>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* Десктопная версия: Обычный ряд (скрыта на мобилках) */}
        <div className="hidden md:flex flex-wrap justify-center gap-14">
           {allCategories.map(cat => (
             <div 
               key={cat.id}
               onClick={() => setCategory(cat.slug)}
               className="flex flex-col items-center cursor-pointer group"
             >
               <div className={`w-24 h-24 rounded-full flex items-center justify-center transition-all duration-300 border-2 ${
                 category === cat.slug ? "bg-emerald-900 border-black shadow-lg" : "bg-gray-100 border-transparent group-hover:bg-gray-200"
               }`}>
                 {cat.slug === '' ? (
                   <span className={`text-xl font-extrabold ${category === '' ? "text-white" : "text-gray-600"}`}>ALL</span>
                 ) : (
                   <img 
                     src={`/icons/${cat.slug}.png`} 
                     alt={cat.name}
                     className="w-16 h-16 object-contain"
                     onError={(e) => { e.target.src = '/icons/default.png'; }}
                   />
                 )}
               </div>
               <span className="mt-4 font-bold text-base text-[#002f34]">{cat.name}</span>
             </div>
           ))}
        </div>
      </div>

      {/* 3. СЕКЦИЯ ОБЪЯВЛЕНИЙ */}
      <div className="max-w-7xl mx-auto px-2 md:px-10">
        {/* На мобилках уменьшаем gap и добавляем сетку */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-6">
          {ads.map(ad => (
            <AdCard key={ad.id} ad={ad} onFavoriteToggle={toggleFav} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default Home;