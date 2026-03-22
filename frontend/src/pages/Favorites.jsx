import { useEffect, useState } from "react";
import { api } from "../api/api";
import AdCard from "../components/AdCard";

function Favorites() {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFavorites();
  }, []);

  const fetchFavorites = async () => {
    try {
      const res = await api.get("/favorite");
      console.log("Full API Response:", res.data); // СМОТРИ СЮДА В КОНСОЛИ (F12)

      // ПРОВЕРКА СТРУКТУРЫ:
      // 1. Если бэк возвращает { items: [...] }
      if (res.data.items) {
        setFavorites(res.data.items);
      } 
      // 2. Если бэк возвращает список объектов [{id: 1, ad: {...}}, ...]
      else if (Array.isArray(res.data) && res.data.length > 0 && res.data[0].ad) {
        setFavorites(res.data.map(item => item.ad));
      }
      // 3. Если просто массив объектов объявлений
      else if (Array.isArray(res.data)) {
        setFavorites(res.data);
      }
    } catch (err) {
      console.error("Error fetching favorites", err);
    } finally {
      setLoading(false);
    }
  };

  const toggleFav = async (id) => {
    try {
      await api.post(`/favorite/${id}`);
      // Удаляем из списка локально
      setFavorites(prev => prev.filter(ad => ad.id !== id));
    } catch (err) {
      alert("Error updating favorites");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-emerald-900"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 sm:px-10 pb-20">
      <h1 className="text-2xl font-extrabold text-emerald-950 mt-10 mb-8 tracking-tight">
        Your Favourite Ads
      </h1>
      
      {favorites && favorites.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {favorites.map(ad => (
            <AdCard key={ad.id} ad={ad} onFavoriteToggle={toggleFav} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
          <div className="text-4xl mb-4">❤️</div>
          <p className="text-gray-500 font-medium text-lg">You haven't added anything to favorites yet.</p>
          <button 
            onClick={() => window.location.href = '/'}
            className="mt-4 text-emerald-700 font-bold hover:underline"
          >
            Go find something cool
          </button>
        </div>
      )}
    </div>
  );
}

export default Favorites;