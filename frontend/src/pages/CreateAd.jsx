import { useEffect, useState } from "react";
import { api } from "../api/api";
import { useNavigate } from "react-router-dom";

function CreateAd() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(false); // Состояние загрузки
  const [isSuccess, setIsSuccess] = useState(false); // Состояние успеха

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
      alert("Максимум 6 фотографий");
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
    setIsLoading(true); // Включаем крутилку

    const data = new FormData();
    data.append("title", form.title);
    data.append("description", form.description);
    data.append("price", form.price);
    data.append("category_slug", form.category_slug);
    images.forEach(img => data.append("images", img));

    try {
      await api.post("/ad/create", data);
      
      // Искусственная пауза 1.5 сек, чтобы юзер увидел лоадер
      setTimeout(() => {
        setIsLoading(false);
        setIsSuccess(true);
      }, 1500);
      
    } catch (err) {
      setIsLoading(false);
      alert("Ошибка при создании");
    }
  };

  // ЭКРАН УСПЕХА
  if (isSuccess) {
    return (
      <div className="min-h-screen bg-[#f2f4f5] flex items-center justify-center px-10">
        <div className="bg-white p-12 shadow-sm rounded-sm text-center max-w-md w-full">
          <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
             <svg className="w-10 h-10 text-emerald-950" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
             </svg>
          </div>
          <h2 className="text-2xl font-bold text-[#002f34] mb-4">Your ad has been published!</h2>
          <p className="text-gray-500 mb-8">It is now visible to everyone in the Lefke community.</p>
          <button 
            onClick={() => navigate("/")}
            className="w-full bg-[#002f34] text-white py-4 rounded-md font-bold text-lg hover:bg-[#003d45] transition-all"
          >
            Return to main page
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f2f4f5] py-10">
      <div className="max-w-7xl mx-auto px-10">
        <h1 className="text-3xl font-bold text-[#002f34] mb-8">Create an Ad</h1>

        <form onSubmit={handleSubmit} className="flex flex-col gap-6 w-full"> 
          
          {/* БЛОК 1: Подробности */}
          <div className="bg-white p-8 shadow-sm rounded-sm">
            <h2 className="text-xl font-bold text-[#002f34] mb-6">Describe in details</h2>
            
            <div className="flex flex-col gap-2 mb-8 max-w-2xl">
              <label className="text-sm font-semibold text-[#002f34]">Write a title *</label>
              <input 
                name="title" 
                placeholder="For example: Iphone 15" 
                className="w-full border border-[#dbe0e2] rounded-md p-4 bg-[#f2f4f5] focus:bg-white focus:border-[#002f34] outline-none transition-all" 
                onChange={handleChange} 
                required
                disabled={isLoading}
              />
            </div>

            <div className="flex flex-col gap-2 max-w-md">
              <label className="text-sm font-semibold text-[#002f34]">Category *</label>
              <select 
                name="category_slug" 
                className="w-full border border-[#dbe0e2] rounded-md p-4 bg-[#f2f4f5] focus:bg-white focus:border-[#002f34] outline-none cursor-pointer" 
                onChange={handleChange}
                required
                disabled={isLoading}
              >
                <option value="">Select a category</option>
                {categories.map(cat => (
                  <option key={cat.id} value={cat.slug}>{cat.name}</option>
                ))}
              </select>
            </div>
          </div>

          {/* БЛОК 2: ФОТО */}
          <div className="bg-white p-8 shadow-sm rounded-sm">
            <h2 className="text-xl font-bold text-[#002f34] mb-2">Photo</h2>
            <p className="text-sm text-gray-500 mb-6 font-medium">The first photo will be on the cover of the ad. Drag and drop photo if you want to change the order.</p>
            
            <div className="grid grid-cols-3 gap-6 max-w-4xl"> 
              {images.length < 6 && !isLoading && (
                <label className="aspect-[4/3] border-2 border-dashed border-gray-200 flex flex-col items-center justify-center cursor-pointer hover:bg-emerald-50/30 transition-colors rounded-sm bg-[#f2f4f5] group">
                  <div className="text-[#002f34] font-bold text-[16px] border-b-2 border-[#002f34] pb-0.5">
                    Upload a photo
                  </div>
                  <input type="file" multiple className="hidden" onChange={handleImages} accept="image/*" />
                </label>
              )}

              {preview.map((img, index) => (
                <div key={index} className="relative aspect-[4/3] border border-gray-100 rounded-sm overflow-hidden bg-[#f2f4f5] shadow-sm">
                  <img src={img} className="w-full h-full object-cover" alt="preview" />
                  {!isLoading && (
                    <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute top-2 right-2 bg-black/40 hover:bg-black/70 text-white w-7 h-7 rounded-full flex items-center justify-center transition-colors shadow-lg"
                    >
                        ✕
                    </button>
                  )}
                  {index === 0 && (
                    <div className="absolute bottom-0 w-full bg-[#002f34]/90 text-white text-[10px] text-center py-1.5 uppercase font-bold tracking-widest">
                      Главное
                    </div>
                  )}
                </div>
              ))}

              {[...Array(Math.max(0, 6 - (images.length + (images.length < 6 && !isLoading ? 1 : 0))))].map((_, i) => (
                <div key={i} className="aspect-[4/3] bg-[#f2f4f5] rounded-sm flex items-center justify-center">
                   <svg className="w-10 h-10 text-gray-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
              ))}
            </div>
          </div>

          {/* БЛОК 3: Описание */}
          <div className="bg-white p-8 shadow-sm rounded-sm">
            <h2 className="text-xl font-bold text-[#002f34] mb-6">Description *</h2>
            <div className="max-w-3xl">
              <textarea 
                name="description" 
                placeholder="Write down some details..." 
                className="w-full border border-[#dbe0e2] rounded-md p-4 bg-[#f2f4f5] focus:bg-white focus:border-[#002f34] outline-none min-h-[220px] transition-all" 
                onChange={handleChange} 
                required
                disabled={isLoading}
              />
            </div>
          </div>

          {/* БЛОК 4: Цена */}
          <div className="bg-white p-8 shadow-sm rounded-sm">
            <h2 className="text-xl font-bold text-[#002f34] mb-6">Price</h2>
            <div className="flex items-center gap-4">
              <input 
                name="price" 
                type="number" 
                className="w-48 border border-[#dbe0e2] rounded-md p-4 bg-[#f2f4f5] focus:bg-white focus:border-[#002f34] outline-none font-bold text-lg" 
                onChange={handleChange} 
                required
                disabled={isLoading}
              />
              <span className="text-xl font-bold text-[#002f34]">₺</span>
            </div>
          </div>

          <div className="flex justify-end mb-24 min-h-[64px] items-center">
            {isLoading ? (
              /* КРУТИЛКА */
              <div className="flex items-center gap-3 px-14">
                <div className="w-8 h-8 border-4 border-emerald-950/20 border-t-emerald-950 rounded-full animate-spin"></div>
                <span className="font-bold text-[#002f34]">Publishing...</span>
              </div>
            ) : (
              <button className="bg-[#002f34] text-white px-14 py-4 rounded-md font-bold text-lg hover:bg-[#003d45] transition-all shadow-md active:scale-95">
                Publish
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreateAd;