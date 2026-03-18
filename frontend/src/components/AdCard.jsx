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
          <p className="text-green-600 font-bold text-lg">&&{ad.price}$</p>
          <p className="text-gray-400 text-sm">{ad.views} views</p>
        </div>
      </div>
    </Link>
  );
}

export default AdCard;


<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 justify-items-center">
  {ads.map(ad => (
    <Link
      to={`/ad/${ad.id}`}
      key={ad.id}
      className="w-64 bg-white rounded-xl shadow hover:shadow-lg transition overflow-hidden"
    >
      {/* IMAGE */}
      <div className="h-40 bg-gray-100 flex items-center justify-center">
        {ad.main_image ? (
          <img
            src={`http://localhost:8000${ad.main_image}`}
            className="max-h-full object-contain p-2"
          />
        ) : (
          <span className="text-gray-400">No Image</span>
        )}
      </div>

      {/* INFO */}
      <div className="p-3 flex flex-col gap-1">
        {/* TITLE */}
        <h2 className="font-semibold text-gray-800 text-sm line-clamp-1">
          {ad.title}
        </h2>

        {/* CATEGORY */}
        <p className="text-xs text-gray-400">
          {ad.category?.name}
        </p>

        {/* PRICE */}
        <p className="text-lg font-bold text-black">
          ${ad.price}
        </p>
      </div>
    </Link>
  ))}
</div>