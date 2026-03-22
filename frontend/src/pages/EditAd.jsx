import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { api } from "../api/api";

function EditAd() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    category_id: ""
  });

  useEffect(() => {
    // Сначала загружаем текущие данные объявления
    api.get(`/ad/${id}`)
      .then(res => {
        setFormData({
          title: res.data.title,
          description: res.data.description,
          price: res.data.price,
          category_id: res.data.category_id
        });
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        alert("Ad not found");
        navigate("/");
      });
  }, [id, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Отправляем PATCH запрос на твой метод бэкенда
      await api.patch(`/ad/${id}`, formData);
      alert("Ad updated successfully!");
      navigate(`/ad/${id}`); // Возвращаемся на страницу объявления
    } catch (err) {
      console.error(err);
      alert("Error updating ad. Check if all fields are filled.");
    }
  };

  if (loading) return <div className="text-center mt-20">Loading...</div>;

  return (
    <div className="max-w-2xl mx-auto px-6 py-12">
      <h1 className="text-3xl font-black text-emerald-950 mb-8">Edit Advertisement</h1>
      
      <form onSubmit={handleSubmit} className="space-y-6 bg-white p-8 rounded-2xl border border-gray-200 shadow-sm">
        <div>
          <label className="block text-xs font-black uppercase text-gray-400 mb-2">Title</label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => setFormData({...formData, title: e.target.value})}
            className="w-full h-12 px-4 rounded-xl border border-gray-300 focus:outline-none focus:border-emerald-950 transition-all"
            required
          />
        </div>

        <div>
          <label className="block text-xs font-black uppercase text-gray-400 mb-2">Price (€)</label>
          <input
            type="number"
            value={formData.price}
            onChange={(e) => setFormData({...formData, price: e.target.value})}
            className="w-full h-12 px-4 rounded-xl border border-gray-300 focus:outline-none focus:border-emerald-950 transition-all"
            required
          />
        </div>

        <div>
          <label className="block text-xs font-black uppercase text-gray-400 mb-2">Description</label>
          <textarea
            rows="5"
            value={formData.description}
            onChange={(e) => setFormData({...formData, description: e.target.value})}
            className="w-full p-4 rounded-xl border border-gray-300 focus:outline-none focus:border-emerald-950 transition-all resize-none"
            required
          ></textarea>
        </div>

        <div className="flex gap-4 pt-4">
          <button
            type="submit"
            className="flex-1 h-14 bg-emerald-950 text-white rounded-xl font-black text-lg hover:bg-emerald-900 transition-all active:scale-[0.98] shadow-lg shadow-emerald-950/20"
          >
            Save Changes
          </button>
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="px-8 h-14 border-2 border-gray-200 text-gray-400 rounded-xl font-black hover:bg-gray-50 transition-all"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

export default EditAd;