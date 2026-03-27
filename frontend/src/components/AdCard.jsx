import { Link } from "react-router-dom";
import { API_URL } from "../api/api";

function AdCard({ ad, onFavoriteToggle, isOwner = false, onAction }) {
  
  const handleHeartClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    onFavoriteToggle(ad.id);
  };

  const isArchived = ad.status?.toLowerCase() === "archived";

  return (
    <div className="bg-white rounded-lg md:rounded-xl overflow-hidden shadow-sm hover:shadow-md transition flex flex-col h-full border border-gray-100">
      <Link to={`/ad/${ad.id}`} className="block flex-grow no-underline text-current">
        {/* Мобильная высота картинки h-32, десктоп h-44 */}
        <div className="w-full h-32 md:h-44 bg-gray-50 overflow-hidden relative">
          {ad.main_image ? (
            <img
              src={`${API_URL}/${ad.main_image.replace(/^\/+/, "")}`}
              className="w-full h-full object-cover"
              alt={ad.title}
            />
          ) : (
            <div className="flex items-center justify-center h-full text-gray-400 text-[10px] md:text-xs italic">No image</div>
          )}
        </div>

        {/* Уменьшенные отступы p-2 на мобилке */}
        <div className="p-2 md:p-3 flex flex-col gap-0.5 md:gap-1">
          {/* Уменьшенный шрифт заголовка и высота */}
          <p className="text-[11px] md:text-sm font-bold text-[#002f34] line-clamp-2 h-7 md:h-10 mb-0 leading-tight">
            {ad.title}
          </p>
          <p className="text-[10px] md:text-[12px] text-gray-500 mb-0.5">{ad.category?.name}</p>
          
          <div className="flex justify-between items-center mt-auto">
            {/* Уменьшенный шрифт цены */}
            <p className="text-sm md:text-lg font-extrabold text-[#002f34] m-0">
              {ad.price.toLocaleString()} ₺
            </p>
            
            {!isOwner && (
              <span onClick={handleHeartClick} className="p-1 hover:bg-gray-100 rounded-full transition cursor-pointer">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill={ad.is_favorite ? "#ff4f4f" : "none"}
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke={ad.is_favorite ? "#ff4f4f" : "#002f34"}
                  className="w-5 h-5 md:w-6 md:h-6 transition-all active:scale-125"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                </svg>
              </span>
            )}
          </div>
        </div>
      </Link>

      {isOwner && (
        <div className="p-1.5 md:p-2 bg-gray-50 border-t flex gap-1 md:gap-2">
          {!isArchived ? (
            <>
              <button 
                onClick={() => onAction('update', ad.id)}
                className="flex-1 bg-emerald-950 text-white py-1.5 md:py-2 rounded text-[9px] md:text-[11px] font-black uppercase tracking-wider"
              >
                Edit
              </button>
              <button 
                onClick={() => onAction('delete', ad.id)}
                className="flex-1 bg-gray-400 text-white py-1.5 md:py-2 rounded text-[9px] md:text-[11px] font-black uppercase tracking-wider"
              >
                Delete
              </button>
            </>
          ) : (
            <button 
              onClick={() => onAction('activate', ad.id)}
              className="flex-1 bg-emerald-950 text-white py-1.5 md:py-2 rounded text-[9px] md:text-[11px] font-black uppercase tracking-widest"
            >
              Restore
            </button>
          )}
        </div>
      )}
    </div>
  );
}

export default AdCard;