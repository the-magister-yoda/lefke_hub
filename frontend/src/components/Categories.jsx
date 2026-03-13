import { useEffect, useState } from "react";

function Categories({ setCategoryFilter }) {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await fetch("http://localhost:8000/category");
      const data = await res.json();
      setCategories(data);
    } catch (err) {
      console.error("Error loading categories:", err);
    }
  };

  return (
    <div className="flex gap-4 overflow-x-auto mb-6">
      <button
        className="bg-gray-200 px-4 py-2 rounded hover:bg-gray-300"
        onClick={() => setCategoryFilter("")}
      >
        All
      </button>
      {categories.map(cat => (
        <button
          key={cat.id}
          className="bg-white border px-4 py-2 rounded hover:bg-gray-100"
          onClick={() => setCategoryFilter(Number(cat.id))} // отправляем id как integer
        >
          {cat.name}
        </button>
      ))}
    </div>
  );
}

export default Categories;