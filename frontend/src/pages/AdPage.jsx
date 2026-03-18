import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { api } from "../api/api";

function AdPage() {
  const { id } = useParams();
  const [ad, setAd] = useState(null);
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    api.get(`/ad/${id}`).then(res => setAd(res.data));
  }, [id]);

  if (!ad) return <div>Loading...</div>;

  const next = () => {
    setCurrent((prev) => (prev + 1) % ad.images.length);
  };

  const prev = () => {
    setCurrent((prev) =>
      prev === 0 ? ad.images.length - 1 : prev - 1
    );
  };

  return (
    <div className="max-w-6xl mx-auto p-6">

      <div className="flex gap-8">

        {/* ФОТО */}
        <div className="w-2/3">

          <div className="relative bg-gray-100 h-[500px] flex items-center justify-center">
            <img
              src={`http://localhost:8000/${ad.images[current]?.url}`}
              className="max-h-full object-contain"
            />

            {ad.images.length > 1 && (
              <>
                <button onClick={prev} className="absolute left-2">◀</button>
                <button onClick={next} className="absolute right-2">▶</button>
              </>
            )}
          </div>

        </div>

        {/* ПРАВО */}
        <div className="w-1/3 flex flex-col gap-2">

          <p className="text-sm text-gray-400">
            {new Date(ad.created_at).toLocaleDateString()}
          </p>

          <h1 className="text-xl font-semibold">
            {ad.title}
          </h1>

          <p className="text-2xl font-bold">
            {ad.price}$
          </p>

        </div>

      </div>

      {/* DESCRIPTION */}
      <div className="mt-6">
        <h2 className="font-semibold mb-2">Description</h2>
        <p>{ad.description}</p>
      </div>

    </div>
  );
}

export default AdPage;