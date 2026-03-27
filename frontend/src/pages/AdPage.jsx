import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { API_URL } from "../api/api";
import { api } from "../api/api";

function AdPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [ad, setAd] = useState(null);
  const [current, setCurrent] = useState(0);
  const [showPhone, setShowPhone] = useState(false);
  const [showEmail, setShowEmail] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    api.get(`/ad/${id}`)
      .then(res => setAd(res.data))
      .catch(err => console.error("Error fetching ad:", err));
  }, [id]);

  if (!ad) return (
    <div className="flex justify-center items-center min-h-[400px] text-gray-500 font-medium">
      <div className="animate-pulse text-lg">Loading advertisement...</div>
    </div>
  );

  const next = () => setCurrent((prev) => (prev + 1) % ad.images.length);
  const prev = () => setCurrent((prev) => prev === 0 ? ad.images.length - 1 : prev - 1);

  return (
    <div className="bg-white md:bg-gray-50 min-h-screen pb-48 md:pb-20 font-sans">
      
      {/* 1. ПОЛНОЭКРАННАЯ ГАЛЕРЕЯ */}
      {isFullscreen && (
        <div className="fixed inset-0 z-[999] bg-black flex flex-col items-center justify-center">
          <span 
            onClick={() => setIsFullscreen(false)}
            className="absolute top-6 right-6 text-white p-2 z-[110] bg-white/10 rounded-full backdrop-blur-md"
          >
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
          </span>
          <div className="relative w-full h-full flex items-center justify-center p-4">
            <img
              src={`${API_URL}/${ad.images[current]?.url}`}
              className="max-h-full max-w-full object-contain"
              alt="Fullscreen"
            />
            {ad.images?.length > 1 && (
              <>
                <span onClick={(e) => { e.stopPropagation(); prev(); }} className="absolute left-4 p-4 text-white bg-white/5 rounded-full hover:bg-white/20">
                   <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7m0 0l7-7" /></svg>
                </span>
                <span onClick={(e) => { e.stopPropagation(); next(); }} className="absolute right-4 p-4 text-white bg-white/5 rounded-full hover:bg-white/20">
                   <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
                </span>
              </>
            )}
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-0 md:px-10 py-0 md:py-8">
        {/* Кнопка Back (Desktop) */}
        <div className="hidden md:block px-6 md:px-0">
          <span onClick={() => navigate(-1)} className="flex items-center gap-2 text-emerald-950 hover:text-emerald-700 mb-6 font-bold text-sm cursor-pointer transition-all w-fit">
            <svg className="w-7 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
            Back 
          </span>
        </div>

        <div className="flex flex-col lg:flex-row gap-0 md:gap-10 items-start">
          
          {/* ЛЕВАЯ ЧАСТЬ */}
          <div className="w-full lg:w-2/3">
            {/* Слайдер */}
            <div 
              onClick={() => setIsFullscreen(true)}
              className="relative bg-white md:border border-gray-200 md:rounded-2xl h-[380px] md:h-[550px] flex items-center justify-center overflow-hidden shadow-sm group cursor-pointer"
            >
              {ad.images && ad.images.length > 0 ? (
                <>
                  <img src={`${API_URL}/${ad.images[current]?.url}`} className="max-h-full max-w-full object-contain md:p-4" alt={ad.title} />
                  <div className="absolute bottom-4 right-4 bg-black/50 text-white px-3 py-1 rounded-full text-[10px] font-bold backdrop-blur-sm">
                    {current + 1} / {ad.images.length}
                  </div>
                </>
              ) : (
                <div className="text-gray-300">No photos</div>
              )}
              {/* Back кнопка на мобилке */}
              <span onClick={(e) => { e.stopPropagation(); navigate(-1); }} className="md:hidden absolute top-4 left-4 bg-white/90 p-2 rounded-full shadow-lg">
                <svg className="w-6 h-6 text-emerald-950" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7m0 0l7-7" /></svg>
              </span>
            </div>

            {/* Контент под фото (Мобайл) */}
            <div className="md:hidden p-6 bg-white border-b border-gray-100">
                <p className="text-[10px] text-gray-400 uppercase font-black tracking-widest mb-2">
                   Published {new Date(ad.created_at).toLocaleDateString()}
                </p>
                <div className="text-3xl font-black text-emerald-950 mb-1">{ad.price.toLocaleString()} ₺</div>
                <h1 className="text-xl font-bold text-gray-800 leading-tight">{ad.title}</h1>
            </div>

            {/* Описание + Мета данные */}
            <div className="mt-0 md:mt-8 bg-white md:border border-gray-200 md:rounded-2xl overflow-hidden shadow-sm">
              <div className="p-6 md:p-8">
                <h2 className="text-[11px] font-black uppercase text-gray-400 tracking-widest mb-4">Description</h2>
                <p className="text-gray-700 leading-relaxed text-lg whitespace-pre-wrap">{ad.description}</p>
              </div>
              
              {/* НИЖНЯЯ ИНФО-ПАНЕЛЬ (ID и Просмотры) */}
              <div className="px-6 md:px-8 py-4 bg-gray-50 border-t border-gray-100 flex items-center justify-between text-xs text-gray-400 font-medium">
                <div className="flex items-center gap-6">
                   <span>ID: 1000{ad.id}</span>
                   <div className="flex items-center gap-1">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg>
                      {ad.views} views
                   </div>
                </div>
                <button className="uppercase text-[10px] tracking-widest hover:text-red-500 transition">Report</button>
              </div>
            </div>
          </div>

          {/* ПРАВАЯ ЧАСТЬ (Desktop) */}
          <div className="hidden lg:flex w-1/3 flex-col gap-6">
            <div className="bg-white p-8 border border-gray-200 rounded-2xl shadow-sm">
              <p className="text-[11px] text-gray-400 uppercase font-black tracking-widest mb-3">
                Published {new Date(ad.created_at).toLocaleDateString()}
              </p>
              <h1 className="text-2xl font-black text-emerald-950 mb-4">{ad.title}</h1>
              <div className="text-3xl font-black text-emerald-900">{ad.price.toLocaleString()} ₺</div>
            </div>

            <div className="bg-white p-8 border border-gray-200 rounded-2xl shadow-sm">
              <p className="text-[11px] text-gray-400 uppercase font-black tracking-widest mb-6">Seller Info</p>
              <div className="flex items-center gap-4 mb-8">
                {/* АВАТАРКА */}
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

              <div className="space-y-3">
                <button onClick={() => setShowPhone(!showPhone)} className="w-full h-14 bg-emerald-950 text-white rounded-xl font-black">
                    {showPhone ? ad.user?.phone_number : "Show phone"}
                </button>
                <button onClick={() => setShowEmail(!showEmail)} className="w-full h-14 border-2 border-emerald-950 text-emerald-950 rounded-xl font-black">
                    {showEmail ? ad.user?.email : "Show email"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. МОБИЛЬНЫЙ БЛОК (Инфо о продавце + Кнопки) */}
      <div className="md:hidden mt-4 px-6">
          <div className="flex items-center gap-4 py-6 border-t border-gray-100">
              <div className="w-12 h-12 bg-emerald-950 text-white rounded-full flex items-center justify-center font-black">
                  {ad.user?.username?.[0]?.toUpperCase() || "?"}
              </div>
              <div>
                  <div className="font-bold text-emerald-950">{ad.user?.username}</div>
                  <div className="text-[10px] text-gray-400 uppercase font-bold">Member since 2026</div>
              </div>
          </div>
      </div>

      {/* 3. ФИКСИРОВАННЫЕ КНОПКИ (Подняты над BottomNav) */}
      <div className="md:hidden fixed bottom-[72px] left-0 right-0 px-4 z-40">
          <div className="flex gap-2 bg-white p-3 rounded-2xl shadow-2xl border border-gray-100">
             <button onClick={() => setShowPhone(!showPhone)} className="flex-1 h-11 bg-emerald-950 text-white rounded-xl font-bold flex items-center justify-center gap-2">
               <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-3C9.716 21 3 14.284 3 6V5z"></path></svg>
               {showPhone ? ad.user?.phone_number : "Call"}
             </button>
             <button onClick={() => setShowEmail(!showEmail)} className="flex-1 h-11 border-2 border-emerald-950 text-emerald-950 rounded-xl font-bold flex items-center justify-center gap-2 bg-white">
               {showEmail ? <span className="text-[10px] truncate px-1">{ad.user?.email}</span> : "Email"}
             </button>
          </div>
      </div>

    </div>
  );
}

export default AdPage;