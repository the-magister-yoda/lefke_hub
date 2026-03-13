import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import { api } from "../api/api";

function UploadImage() {
  const { id } = useParams(); // adId
  const [file, setFile] = useState(null);
  const navigate = useNavigate();

  const upload = async (e) => {
    e.preventDefault();
    if (!file) return alert("Select a file first");

    const formData = new FormData();
    formData.append("file", file);

    try {
      await api.post(`/ad/${id}/upload_image`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      alert("Ad created successfully!");
      navigate("/"); // редирект на главную
    } catch (err) {
      alert("Error uploading image");
    }
  };

  return (
    <div className="flex justify-center mt-20">
      <form onSubmit={upload} className="bg-white p-8 shadow rounded flex flex-col gap-4 w-96">
        <input type="file" onChange={e => setFile(e.target.files[0])} />
        <button className="bg-green-500 text-white p-2 rounded">
          Upload & Finish
        </button>
      </form>
    </div>
  );
}

export default UploadImage;