import { useEffect, useState } from "react";
import { api } from "../api/api";
import { Link } from "react-router-dom";

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

  // Функция для обработки клика по сердечку (Лайк/Дизлайк)
  const handleToggleFavorite = async (e, adId) => {
    e.preventDefault(); // КРИТИЧНО: чтобы не переходило на страницу объявления
    try {
      const res = await api.post(`/favorite/${adId}`);
      
      // Обновляем состояние 'is_favorite' только для этого объявления в списке
      setAds(prevAds => 
        prevAds.map(ad => 
          ad.id === adId ? { ...ad, is_favorite: res.data.is_favorite } : ad
        )
      );
    } catch (err) {
      console.error("Error toggling favorite", err);
      // Если юзер не авторизован, можно показать алерт
      if (err.response && err.response.status === 401) {
        alert("Пожалуйста, войдите, чтобы добавлять в избранное.");
      }
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-10">

      {/* 🔍 ПОИСК */}
      <div className="mt-4 mb-6">
        <input
          type="text"
          placeholder="🔍 What are you looking for ?"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full border rounded-lg p-3 outline-none focus:border-blue-500"
        />
      </div>

      {/* категории */}
      <div className="flex gap-3 mb-6 overflow-x-auto">
        <button
          onClick={() => setCategory("")}
          className={`px-3 py-1 rounded ${
            category === "" ? "bg-black text-white" : "bg-gray-200"
          }`}
        >
          All
        </button>

        {categories.map(cat => (
          <button
            key={cat.id}
            onClick={() => setCategory(cat.slug)}
            className={`px-3 py-1 rounded ${
              category === cat.slug
                ? "bg-black text-white"
                : "bg-gray-200"
            }`}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {/* объявления */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {ads.map(ad => (
          <Link
            key={ad.id}
            to={`/ad/${ad.id}`}
            className="block no-underline"
          >

            <div className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition">

              {/* фото */}
              <div className="w-full h-44 bg-gray-100 overflow-hidden rounded-xl relative">
                {ad.main_image ? (
                  <img
                    src={`http://localhost:8000/${ad.main_image}`}
                    className="w-full h-full object-cover rounded-xl"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full text-gray-400">
                    No image
                  </div>
                )}
              </div>

              {/* текст */}
              <div className="p-3">

                <p className="text-base font-semibold text-black line-clamp-1">
                  {ad.title}
                </p>

                <p className="text-sm text-gray-600">
                  {ad.category?.name}
                </p>

                {/* БЛОК ЦЕНЫ И СЕРДЕЧКА */}
                <div className="flex justify-between items-center mt-1">
                  <p className="text-lg font-bold text-black">
                    {ad.price}$
                  </p>

                  {/* КНОПКА-СЕРДЦЕ */}
                  <span
                    onClick={(e) => handleToggleFavorite(e, ad.id)}
                    className="p-1.5 hover:bg-gray-100 rounded-full transition"
                    title={ad.is_favorite ? "Убрать из избранного" : "Добавить в избранное"}
                  >
                    {/* SVG иконка сердца (очень похожа на ту, что на скриншоте) */}
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill={ad.is_favorite ? "red" : "none"} // Если лайкнут — заливаем красным, нет — пустое
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke={ad.is_favorite ? "red" : "#002f34"} // Если лайкнут — красный контур, нет — обычный (серый/черный)
                      className="w-6 h-6 transition-all active:scale-125" // Анимация увеличения при клике
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
                      />
                    </svg>
                  </span>
                </div>

              </div>

            </div>

          </Link>
        ))}
      </div>

    </div>
  );
}

export default Home;