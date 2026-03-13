import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { api } from "../api/api";

function AdPage() {
  const { id } = useParams();
  const [ad, setAd] = useState(null);

  useEffect(() => {
    api.get(`/ad/${id}`).then(res => setAd(res.data));
  }, [id]);

  if (!ad) return <div className="p-10">Loading...</div>;

  return (
    <div className="max-w-4xl mx-auto p-6 bg-gray-100 min-h-screen">
      <Link to="/" className="text-blue-600 hover:underline mb-4 inline-block">
        ← Back to Home
      </Link>

      {/* Слайдер картинок */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {ad.images?.length > 0 ? (
          ad.images.map((img, idx) => (
            <img
              key={idx}
              src={`http://localhost:8000/${img.url.replace(/^\/+/, "")}`}
              alt={`ad-image-${idx}`}
              className="w-full h-75 bg-gray-95 flex items-center justify-center"
            />
          ))
        ) : (
          <img
            src="https://picsum.photos/600/400"
            alt="placeholder"
            className="w-full h-64 object-cover rounded"
          />
        )}
      </div>

      <h1 className="text-3xl font-bold mb-2">{ad.title}</h1>
      <p className="text-green-600 text-2xl font-semibold mb-2">{ad.price}$</p>
      <p className="text-gray-500 mb-2">Category: {ad.category?.name}</p>
      <p className="text-gray-400 mb-4">{ad.views} views</p>
      <p className="text-gray-700">{ad.description}</p>
    </div>
  );
}

export default AdPage;