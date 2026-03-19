import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { api } from "../api/api";

function AdPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [ad, setAd] = useState(null);
  const [current, setCurrent] = useState(0);
  const [showPhone, setShowPhone] = useState(false);

  useEffect(() => {
    api.get(`/ad/${id}`)
      .then(res => setAd(res.data))
      .catch(err => console.error("Error fetching ad:", err));
  }, [id]);

  if (!ad) return (
    <div className="flex justify-center items-center min-h-[400px] text-gray-500 font-medium">
      Loading advertisement...
    </div>
  );

  const next = () => {
    setCurrent((prev) => (prev + 1) % ad.images.length);
  };

  const prev = () => {
    setCurrent((prev) =>
      prev === 0 ? ad.images.length - 1 : prev - 1
    );
  };

  return (
    <div className="bg-gray-50 min-h-screen pb-12">
      <div className="max-w-6xl mx-auto p-6">
        
        {/* BACK BUTTON */}
        <span 
          onClick={() => navigate(-1)}
          className="text-[18px] flex items-center gap-2 text-emerald-950 hover:underline mb-6 font-semibold text-sm transition"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
          Back
        </span>

        <div className="flex flex-col lg:flex-row gap-8">

          {/* LEFT: IMAGES */}
          <div className="lg:w-2/3">
            <div className="relative bg-white border border-gray-200 rounded-lg h-[500px] flex items-center justify-center overflow-hidden shadow-sm">
              {ad.images && ad.images.length > 0 ? (
                <img
                  src={`http://localhost:8000/${ad.images[current]?.url}`}
                  className="max-h-full max-w-full object-contain p-2"
                  alt={ad.title}
                />
              ) : (
                <div className="text-gray-400 italic">No images available</div>
              )}

              {ad.images?.length > 1 && (
                <>
                  <button 
                    onClick={prev} 
                    className="absolute left-4 p-3 bg-white/90 hover:bg-white rounded-full shadow-lg text-emerald-950 transition active:scale-90"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
                  </button>
                  <button 
                    onClick={next} 
                    className="absolute right-4 p-3 bg-white/90 hover:bg-white rounded-full shadow-lg text-emerald-950 transition active:scale-90"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
                  </button>
                </>
              )}
            </div>

            {/* DESCRIPTION BOX */}
            {/* DESCRIPTION BLOCK */}
            <div className="mt-6 bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
              {/* Текст описания */}
              <div className="p-6">
                <h2 className="text-xl font-bold uppercase text-emerald-950 mb-4">Description</h2>
                <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                  {ad.description}
                </p>
              </div>

              {/* ЛИНИЯ НА ВСЮ ШИРИНУ */}
              <div className="border-t border-gray-100"></div>

              {/* ПОДВАЛ КАРТОЧКИ (ID и Просмотры) */}
              <div className="px-6 py-3 bg-gray-50/50 flex items-center justify-between text-sm text-gray-500">
                
                {/* СЛЕВА: ID */}
                <div className="flex items-center gap-1">
                  <span className="font-medium">ID:</span>
                  <span>1000{ad.id}</span>
                </div>

                {/* ПО ЦЕНТРУ: VIEWS */}
                <div className="absolute left-1/3 -translate-x-1/2 flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                  <span className="font-medium text-emerald-950">Views:</span>
                  <span className="font-bold text-emerald-950">{ad.views}</span>
                </div>

                {/* ПРАВО: (Пусто или можно добавить кнопку Жалоба) */}
                <div className="hidden md:block">
                  <span className="hover:text-red-500 transition text-xs uppercase font-bold tracking-wider">Report</span>
                </div>

              </div>
            </div>
          </div>

          {/* RIGHT: INFO PANEL */}
          <div className="lg:w-1/3 flex flex-col gap-4">
            
            {/* PRICE & TITLE CARD */}
            <div className="bg-white p-6 border border-gray-200 rounded-lg shadow-sm">
              <p className="text-[14px] text-gray-400 uppercase font-bold mb-2">
                Published {new Date(ad.created_at).toLocaleDateString()}
              </p>
              <h1 className="text-2xl font-bold text-emerald-950 mb-4 leading-tight">
                {ad.title}
              </h1>
              <p className="text-2xl font-extrabold text-emerald-950">
                {ad.price.toLocaleString()} $
              </p>
            </div>

            {/* SELLER CARD */}
            <div className="bg-white p-6 border border-gray-200 rounded-lg shadow-sm">
              <p className="text-[14px] text-gray-400 uppercase font-bold mb-4">Seller</p>
              <div className="flex items-center gap-4 mb-6">
                <div className="w-14 h-14 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-950 text-xl font-bold border border-emerald-200">
                  {ad.user?.username?.[0]?.toUpperCase() || "?"}
                </div>
                <div className="flex flex-col">
                  <p className="font-bold text-lg text-emerald-950 leading-none mb-1">
                    {ad.user.username || "Unknown"}
                  </p>
                </div>
              </div>

              {/* PHONE BUTTON */}
              <button 
                onClick={() => setShowPhone(!showPhone)}
                className="w-full h-14 bg-emerald-950 hover:bg-emerald-900 text-white rounded-md font-bold text-lg transition-all active:scale-[0.98] flex items-center justify-center gap-2 shadow-md"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-3C9.716 21 3 14.284 3 6V5z"></path></svg>
                {showPhone ? (ad.user?.phone_number || "No number") : "Show phone number"}
              </button>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
}

export default AdPage;