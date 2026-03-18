import { useEffect, useState } from "react";
import { api } from "../api/api";
import { useNavigate } from "react-router-dom";

function CreateAd() {
  const navigate = useNavigate();

  const [categories, setCategories] = useState([]);

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

    const data = new FormData();

    data.append("title", form.title);
    data.append("description", form.description);
    data.append("price", form.price);
    data.append("category_slug", form.category_slug);

    images.forEach(img => {
      data.append("images", img);
    });

    try {
      await api.post("/ad/create", data);

      alert("Ad created successfully");
      navigate("/");

    } catch (err) {
      console.log(err.response?.data);
      alert("Error creating ad");
    }
  };

  return (
    <div className="flex justify-center mt-10">
      <form
        onSubmit={handleSubmit}
        className="flex gap-8 bg-white p-6 shadow rounded w-[900px]"
      >
        {/* LEFT */}
        <div className="flex flex-col gap-4 w-1/2">
          <input name="title" placeholder="Title" className="border p-2" onChange={handleChange} />
          <textarea name="description" placeholder="Description" className="border p-2" onChange={handleChange} />
          <input name="price" type="number" placeholder="Price" className="border p-2" onChange={handleChange} />

          <select name="category_slug" className="border p-2" onChange={handleChange}>
            <option value="">Select category</option>
            {categories.map(cat => (
              <option key={cat.id} value={cat.slug}>
                {cat.name}
              </option>
            ))}
          </select>

          <button className="bg-blue-500 text-white p-2 rounded">
            Create Ad
          </button>
        </div>

        {/* RIGHT (ФОТО) */}
        <div className="w-1/2">

          {preview.length === 0 && (
            <label className="flex flex-col items-center justify-center border-2 border-dashed h-64 cursor-pointer rounded-lg">
              <span text-lg>📸</span>
              <span className="text-lg text-gray-500">Add Photos</span>
              <span className="text-sm text-gray-400">Click to upload</span>
              <input type="file" multiple className="hidden" onChange={handleImages} />
            </label>
          )}

          {preview.length > 0 && (
            <div className="grid grid-cols-3 gap-2">
              {preview.map((img, index) => (
                <div key={index} className="relative">
                  <img src={img} className="w-full h-24 object-cover rounded" />

                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute top-1 right-1 bg-black text-white text-xs px-1 rounded"
                  >
                    ✕
                  </button>

                  {index === 0 && (
                    <span className="absolute bottom-1 left-1 bg-blue-500 text-white text-xs px-1 rounded">
                      Main
                    </span>
                  )}
                </div>
              ))}

              <label className="flex items-center justify-center border h-24 cursor-pointer">
                +
                <input type="file" multiple className="hidden" onChange={handleImages} />
              </label>
            </div>
          )}

        </div>
      </form>
    </div>
  );
}

export default CreateAd;