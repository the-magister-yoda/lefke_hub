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
              <div className="w-full h-44 bg-gray-100 overflow-hidden rounded-xl">
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

                <p className="text-lg font-bold text-black mt-1">
                  {ad.price}$
                </p>

              </div>

            </div>

          </Link>
        ))}
      </div>

    </div>
  );
}

export default Home;