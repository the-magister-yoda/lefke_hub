import { useEffect, useState } from "react";
import { api } from "../api/api";
import AdCard from "../components/AdCard";
import { useNavigate } from "react-router-dom";

function MyProfile() {
  const [ads, setAds] = useState([]);
  const [user, setUser] = useState(null);
  const [tab, setTab] = useState("active");
  const navigate = useNavigate();

  useEffect(() => {
    api.get("/user/me").then(res => setUser(res.data));
  }, []);

  useEffect(() => {
    fetchAds();
  }, [tab]);

  const fetchAds = async () => {
    const url = tab === "active" ? "/ad/my" : "/ad/my/archived";
    try {
      const res = await api.get(url);
      setAds(res.data);
    } catch (err) {
      console.error("Error fetching ads:", err);
    }
  };

  const handleAction = async (type, id) => {
    if (type === 'delete') {
      if (window.confirm("Move this ad to archive?")) {
        try {
          await api.delete(`/ad/${id}`);
          setTab("archived"); // Сразу показываем, где теперь лежит объявление
          fetchAds();
        } catch (err) {
          alert("Error archiving ad");
        }
      }
    } 
    else if (type === 'update') {
      navigate(`/edit-ad/${id}`);
    }
    else if (type === 'activate') {
      try {
        // Вызываем новую ручку на бэке
        await api.patch(`/ad/restore/${id}`);
        setTab("active"); // Возвращаем пользователя во вкладку активных
        fetchAds();
      } catch (err) {
        console.error("Restore error:", err);
        alert("Error activating ad");
      }
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-6 mt-10 pb-20">
      <div className="flex flex-col md:flex-row gap-10">
        
        {/* Sidebar */}
        <div className="w-full md:w-64">
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200 flex flex-col items-center">
            <div className="w-20 h-20 bg-emerald-950 text-white rounded-full flex items-center justify-center text-3xl font-black mb-4 shadow-lg">
              {user?.username?.[0].toUpperCase()}
            </div>
            <h2 className="font-black text-xl text-emerald-950">{user?.username}</h2>
            <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest mt-1 mb-6">ID: 1000{user?.id}</p>
            <button 
              onClick={() => navigate('/setting')} 
              className="w-full py-3 border-2 border-emerald-950 text-emerald-950 rounded-xl font-black hover:bg-emerald-50 transition-all active:scale-95 text-sm"
            >
              Settings
            </button>
          </div>
        </div>

        {/* Ads Section */}
        <div className="flex-1">
          <div className="flex gap-8 border-b border-gray-200 mb-8">
            {['active', 'archived'].map(t => (
              <button 
                key={t}
                onClick={() => setTab(t)}
                className={`pb-4 text-lg font-black tracking-tight transition-all relative ${
                  tab === t ? "text-emerald-950" : "text-gray-400 hover:text-gray-600"
                }`}
              >
                {t.charAt(0).toUpperCase() + t.slice(1)} Ads
                {tab === t && (
                  <div className="absolute bottom-0 left-0 w-full h-1 bg-emerald-950 rounded-full" />
                )}
              </button>
            ))}
          </div>

          {ads.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {ads.map(ad => (
                <AdCard 
                  key={ad.id} 
                  ad={ad} 
                  isOwner={true} 
                  onAction={handleAction} 
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
              <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">No {tab} ads found</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default MyProfile;