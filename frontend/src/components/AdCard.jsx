import { Link } from "react-router-dom";

const API_URL = "http://localhost:8000";

function AdCard({ ad }) {
  const image = ad?.images?.[0]?.url
    ? `${API_URL}/${ad.images[0].url.replace(/^\/+/, "")}`
    : null;

  return (
    <Link to={`/ad/${ad.id}`}>
      <div className="bg-white rounded-xl shadow hover:shadow-xl transition overflow-hidden cursor-pointer">
        {image && (
          <div className="w-full h-56 bg-gray-100 flex items-center justify-center">
            <img
              src={image}
              alt={ad.title}
              className="max-h-full max-w-full object-contain"
            />
          </div>
        )}

        <div className="p-4 space-y-1">
          <h2 className="font-semibold text-lg text-gray-800">{ad.title}</h2>
          <p className="text-sm text-gray-500">{ad.category?.name}</p>
          <p className="text-green-600 font-bold text-lg">{ad.price}$</p>
          <p className="text-gray-400 text-sm">{ad.views} views</p>
        </div>
      </div>
    </Link>
  );
}

export default AdCard;