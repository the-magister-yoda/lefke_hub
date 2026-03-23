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
      <div className="animate-pulse">Loading advertisement...</div>
    </div>
  );

  const next = () => setCurrent((prev) => (prev + 1) % ad.images.length);
  const prev = () => setCurrent((prev) => prev === 0 ? ad.images.length - 1 : prev - 1);

  return (
    <div className="bg-gray-50 min-h-screen pb-20 font-sans">
      <div className="max-w-7xl mx-auto px-6 sm:px-10 py-8">
        
        {/* Кнопка назад */}
        <span 
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-emerald-950 hover:text-emerald-700 mb-6 font-bold text-sm transition-all"
        >
          <svg className="w-7 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back 
        </span>

        <div className="flex flex-col lg:flex-row gap-10 items-start">

          {/* ЛЕВАЯ КОЛОНКА: Контент (Фото + Описание) */}
          <div className="w-full lg:w-2/3">
            <div className="relative bg-white border border-gray-200 rounded-2xl h-[550px] flex items-center justify-center overflow-hidden shadow-sm group">
              {ad.images && ad.images.length > 0 ? (
                <>
                  <img
                    src={`http://localhost:8000/${ad.images[current]?.url}`}
                    className="max-h-full max-w-full object-contain p-4 transition-transform duration-500"
                    alt={ad.title}
                  />
                  <div className="absolute bottom-6 right-6 bg-black/60 text-white px-4 py-1.5 rounded-full text-xs font-bold backdrop-blur-sm">
                    {current + 1} / {ad.images.length}
                  </div>
                </>
              ) : (
                <div className="text-gray-300 flex flex-col items-center">
                  <svg className="w-16 h-16 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                  <span>No photos</span>
                </div>
              )}

              {ad.images?.length > 1 && (
                <div className="absolute inset-0 flex items-center justify-between px-4 opacity-0 group-hover:opacity-100 transition-opacity">
                  <span onClick={prev} className="p-3 bg-white/90 hover:bg-white rounded-full shadow-xl text-emerald-950 transition transform hover:scale-110 active:scale-95">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7m0 0l7-7" /></svg>
                  </span>
                  <span onClick={next} className="p-3 bg-white/90 hover:bg-white rounded-full shadow-xl text-emerald-950 transition transform hover:scale-110 active:scale-95">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
                  </span>
                </div>
              )}
            </div>

            <div className="mt-8 bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
              <div className="p-8">
                <h2 className="text-sm font-black uppercase text-gray-400 tracking-[0.2em] mb-6">Description</h2>
                <p className="text-gray-700 leading-relaxed text-lg whitespace-pre-wrap">
                  {ad.description}
                </p>
              </div>
              <div className="px-8 py-4 bg-gray-50 border-t border-gray-100 flex items-center justify-between text-sm">
                <div className="flex items-center gap-6 text-gray-400 font-medium">
                   <span>ID: 1000{ad.id}</span>
                   <div className="flex items-center gap-1">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg>
                      {ad.views} views
                   </div>
                </div>
                <button className="text-gray-400 hover:text-red-500 font-bold uppercase text-[10px] tracking-widest transition">Report</button>
              </div>
            </div>
          </div>

          {/* ПРАВАЯ КОЛОНКА: Панель продавца */}
          <div className="w-full lg:w-1/3 flex flex-col gap-6">
            
            <div className="bg-white p-8 border border-gray-200 rounded-2xl shadow-sm">
              <p className="text-[11px] text-gray-400 uppercase font-black tracking-widest mb-3">
                Published {new Date(ad.created_at).toLocaleDateString()}
              </p>
              <h1 className="text-2xl font-black text-emerald-950 mb-4 leading-tight">
                {ad.title}
              </h1>
              <div className="text-3xl font-black text-emerald-900">
                {ad.price.toLocaleString()} ₺
              </div>
            </div>

            <div className="bg-white p-8 border border-gray-200 rounded-2xl shadow-sm">
              <p className="text-[11px] text-gray-400 uppercase font-black tracking-widest mb-6">Seller Info</p>
              <div className="flex items-center gap-4 mb-8">
                <div className="w-16 h-16 bg-emerald-950 text-white rounded-full flex items-center justify-center text-2xl font-black shadow-inner">
                  {ad.user?.username?.[0]?.toUpperCase() || "?"}
                </div>
                <div>
                  <p className="font-black text-xl text-emerald-950 truncate max-w-[180px]">
                    {ad.user?.username || "Unknown"}
                  </p>
                  <p className="text-xs text-gray-400 font-bold uppercase tracking-tighter">Member since 2026</p>
                </div>
              </div>

              <button 
                onClick={() => setShowPhone(!showPhone)}
                className="w-full h-14 bg-emerald-950 hover:bg-emerald-900 text-white rounded-xl font-black text-lg transition-all active:scale-[0.97] flex items-center justify-center gap-3 shadow-lg shadow-emerald-950/20"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-3C9.716 21 3 14.284 3 6V5z"></path></svg>
                {showPhone ? (ad.user?.phone_number || "No number") : "Show phone number"}
              </button>

              <button className="w-full mt-3 h-14 border-2 border-emerald-950 text-emerald-950 rounded-xl font-black text-lg hover:bg-emerald-50 transition-colors">
                Send Message
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

export default AdPage;