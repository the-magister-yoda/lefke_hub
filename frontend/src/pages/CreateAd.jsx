import { useState, useEffect, useRef } from "react";
import { api } from "../api/api";
import { useNavigate } from "react-router-dom";

function CreateAd() {
  const navigate = useNavigate();

  const [categories, setCategories] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState(null);

  const carouselRef = useRef(null);

  useEffect(() => {
    api
      .get("/category")
      .then((res) => setCategories(res.data))
      .catch((err) => console.error("Error loading categories:", err));
  }, []);

  const create = async (e) => {
    e.preventDefault();

    if (!title || !description || !price || !category) {
      alert("Заполните все поля!");
      return;
    }

    try {
      const res = await api.post("/ad/create", {
        title,
        description,
        price: Number(price),
        category_id: Number(category),
      });

      navigate(`/ad/${res.data.id}/upload_image`);
    } catch (err) {
      console.error(err.response?.data || err);
      alert("Ошибка создания объявления. Проверьте все поля.");
    }
  };

  return (
    <div className="flex justify-center mt-10">
      <form
        onSubmit={create}
        className="bg-white p-8 shadow rounded flex flex-col gap-4 w-96"
      >
        <input
          placeholder="Title"
          className="border p-2"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />

        <textarea
          placeholder="Description"
          className="border p-2"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />

        <input
          type="number"
          placeholder="Price"
          className="border p-2"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          required
        />

        {/* Вертикальная карусель категорий */}
        <div
          ref={carouselRef}
          className="border h-48 overflow-y-auto p-2 rounded space-y-2"
        >
          {categories.map((cat) => (
            <div
              key={cat.id}
              className={`px-4 py-2 rounded cursor-pointer border ${
                category === cat.id
                  ? "bg-blue-500 text-white"
                  : "bg-white hover:bg-gray-100"
              }`}
              onClick={() => setCategory(cat.id)}
            >
              {cat.name}
            </div>
          ))}
        </div>

        <button
          type="submit"
          className="bg-blue-500 text-white p-2 rounded mt-4"
        >
          Continue to Upload Photo
        </button>
      </form>
    </div>
  );
}

export default CreateAd;