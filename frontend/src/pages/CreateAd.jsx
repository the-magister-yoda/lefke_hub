import { useEffect, useState } from "react";
import { api } from "../api/api";
import { useNavigate } from "react-router-dom";

function CreateAd() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const [form, setForm] = useState({
    title: "",
    description: "",
    price: "",
    category_slug: "",
  });

  const [images, setImages] = useState([]);
  const [preview, setPreview] = useState([]);

  useEffect(() => {
    api.get("/category").then(res => setCategories(res.data));
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImages = (e) => {
    const files = Array.from(e.target.files);
    if (images.length + files.length > 6) {
      alert("Maximum 6 photos allowed");
      return;
    }
    setImages(prev => [...prev, ...files]);
    setPreview(prev => [
      ...prev,
      ...files.map(file => URL.createObjectURL(file)),
    ]);
  };

  const removeImage = (index) => {
    setImages(images.filter((_, i) => i !== index));
    setPreview(preview.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const data = new FormData();
    data.append("title", form.title);
    data.append("description", form.description);
    data.append("price", form.price);
    data.append("category_slug", form.category_slug);
    images.forEach(img => data.append("images", img));

    try {
      await api.post("/ad/create", data);
      setTimeout(() => {
        setIsLoading(false);
        setIsSuccess(true);
      }, 1500);
    } catch (err) {
      setIsLoading(false);
      alert("Error creating ad. Please try again.");
    }
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-[#f2f4f5] flex items-center justify-center px-6">
        <div className="bg-white p-8 shadow-sm rounded-2xl text-center max-w-md w-full">
          <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
             <svg className="w-10 h-10 text-emerald-950" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
             </svg>
          </div>
          <h2 className="text-2xl font-bold text-[#002f34] mb-2">Success!</h2>
          <p className="text-gray-500 mb-8">Your ad has been published to LefkeHub.</p>
          <button 
            onClick={() => navigate("/")}
            className="w-full bg-[#002f34] text-white py-4 rounded-xl font-bold text-lg active:scale-95 transition-all"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white md:bg-[#f2f4f5] pb-32 pt-4 md:pt-10">
      <div className="max-w-xl md:max-w-7xl mx-auto px-5 md:px-10">
        
        <div className="mb-6 md:mb-10">
          <h1 className="text-2xl md:text-4xl font-extrabold text-[#002f34] tracking-tight">Create Ad</h1>
          <p className="text-gray-500 font-medium md:text-lg">Describe your item in details</p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-6 md:gap-10">
          
          <div className="bg-white md:p-10 md:shadow-md md:rounded-3xl">
            <div className="flex flex-col md:flex-row gap-6 md:gap-12">
              
              {/* Блок фото (Здесь тоже ограничиваем ширину для мобилок) */}
              <div className="w-[85%] md:w-1/2">
                <label className="relative flex flex-col items-center justify-center py-10 md:py-20 border-2 border-dashed border-gray-200 rounded-3xl bg-[#f2f4f5] mb-6 shadow-inner cursor-pointer hover:bg-[#ebedef] transition-all group overflow-hidden">
                    <input type="file" multiple className="hidden" onChange={handleImages} accept="image/*" />
                    <div className="flex gap-3 mb-5 transition-transform group-active:scale-95">
                        <div className="w-12 h-16 bg-yellow-100 rounded-xl flex items-center justify-center text-2xl">🏠</div>
                        <div className="w-16 h-20 bg-yellow-200 rounded-xl flex items-center justify-center text-3xl z-10 scale-110">🚲</div>
                        <div className="w-12 h-16 bg-yellow-100 rounded-xl flex items-center justify-center text-2xl">📷</div>
                    </div>
                    <div className="text-center">
                      <span className="text-emerald-950 font-bold text-lg border-b-2 border-emerald-950 block mb-1">Add Photos</span>
                      <span className="text-gray-400 text-xs font-medium">Up to 6 photos</span>
                    </div>
                </label>

                <div className="grid grid-cols-3 md:grid-cols-4 gap-3">
                    {preview.map((img, index) => (
                        <div key={index} className="relative aspect-square rounded-2xl overflow-hidden bg-gray-100 border shadow-sm">
                            <img src={img} className="w-full h-full object-cover" alt="preview" />
                            <button 
                              type="button" 
                              onClick={(e) => { e.preventDefault(); removeImage(index); }} 
                              className="absolute top-1.5 right-1.5 bg-black/40 text-white w-7 h-7 rounded-full text-[10px] flex items-center justify-center"
                            >✕</button>
                        </div>
                    ))}
                </div>
              </div>

              {/* Поля ввода (Применяем w-[85%] для мобилок) */}
              <div className="w-[85%] md:w-1/2 space-y-5 md:space-y-8">
                <div className="flex flex-col gap-2">
                  <label className="text-[13px] font-bold text-[#002f34] uppercase tracking-wider">Title*</label>
                  <input name="title" placeholder="For example: Iphone 15 256 GB" className="w-full border-none rounded-2xl p-4 md:p-5 bg-[#f2f4f5] focus:bg-[#e8ebed] outline-none text-base text-[#002f34] shadow-sm transition-all" onChange={handleChange} required />
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-[13px] font-bold text-[#002f34] uppercase tracking-wider">Category*</label>
                  <div className="relative">
                    <select name="category_slug" className="w-full border-none rounded-2xl p-4 md:p-5 bg-[#f2f4f5] outline-none appearance-none text-[#002f34] shadow-sm cursor-pointer" onChange={handleChange} required>
                      <option value="">Select category</option>
                      {categories.map(cat => (
                        <option key={cat.id} value={cat.slug}>{cat.name}</option>
                      ))}
                    </select>
                    <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-[#002f34]">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-[13px] font-bold text-[#002f34] uppercase tracking-wider">Description*</label>
                  <textarea name="description" placeholder="Write down some specific information or advantages/disadvantages about your product. That will help other people know your product." className="w-full border-none rounded-2xl p-4 md:p-5 bg-[#f2f4f5] outline-none min-h-[160px] md:min-h-[220px] text-[#002f34] resize-none shadow-sm" onChange={handleChange} required />
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-[13px] font-bold text-[#002f34] uppercase tracking-wider">Price (₺)*</label>
                  <input name="price" type="number" placeholder="0" className="w-full border-none rounded-2xl p-4 md:p-5 bg-[#f2f4f5] font-extrabold text-2xl outline-none text-[#002f34] shadow-sm" onChange={handleChange} required />
                </div>

                <div className="hidden md:block pt-4">
                  <PublishButton isLoading={isLoading} />
                </div>
              </div>
            </div>
            
            {/* Кнопка для мобилок (Тоже ограничиваем ширину) */}
            <div className="md:hidden pt-8 w-[85%]">
              <PublishButton isLoading={isLoading} />
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

function PublishButton({ isLoading }) {
  return isLoading ? (
    <button disabled className="w-full bg-gray-200 text-gray-500 py-5 rounded-2xl font-bold text-lg flex items-center justify-center gap-3">
      <div className="w-5 h-5 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
      Publishing...
    </button>
  ) : (
    <button className="w-full bg-[#002f34] text-white py-5 rounded-2xl font-bold text-xl active:scale-[0.98] transition-all shadow-xl shadow-emerald-950/20">
      Publish
    </button>
  );
}

export default CreateAd;