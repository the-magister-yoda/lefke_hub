import { useEffect, useState } from "react"
import { api } from "../api/api"
import { Link } from "react-router-dom"

function MyProfile() {
  const [ads, setAds] = useState([])
  const [user, setUser] = useState(null)
  const [tab, setTab] = useState("active")

  useEffect(() => {
    fetchUser()
  }, [])

  useEffect(() => {
    fetchAds()
  }, [tab])

  const fetchAds = async () => {
    try {
      const url = tab === "active" ? "/ad/my" : "/ad/my/archived"
      const res = await api.get(url)
      setAds(res.data)
    } catch (err) {
      console.log(err)
    }
  }

  const fetchUser = async () => {
    try {
      const res = await api.get("/user/me")
      setUser(res.data)
    } catch (err) {
      console.log(err)
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-10 mt-6">

      <div className="flex gap-10">

        {/* ЛЕВАЯ ЧАСТЬ */}
        <div className="flex-1">

          {/* Заголовок */}
          <h1 className="text-2xl font-semibold mb-4">
            Your Ads
          </h1>

          {/* ТАБЫ */}
          <div className="flex gap-6 mb-6 border-b pb-2">

            <button
              onClick={() => setTab("active")}
              className={`pb-1 ${
                tab === "active"
                  ? "border-b-2 border-black font-medium"
                  : "text-gray-500"
              }`}
            >
              Active
            </button>

            <button
              onClick={() => setTab("archived")}
              className={`pb-1 ${
                tab === "archived"
                  ? "border-b-2 border-black font-medium"
                  : "text-gray-500"
              }`}
            >
              Archived
            </button>

          </div>

          {/* ОБЪЯВЛЕНИЯ */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {ads.map(ad => (
              <Link
                key={ad.id}
                to={`/ad/${ad.id}`}
                className="block no-underline"
              >
                <div className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition">

                  <div className="w-full h-40 bg-gray-100">
                    {ad.main_image ? (
                      <img
                        src={`http://localhost:8000/${ad.main_image}`}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full text-gray-400">
                        No image
                      </div>
                    )}
                  </div>

                  <div className="p-3">
                    <p className="font-semibold text-black line-clamp-1">
                      {ad.title}
                    </p>

                    <p className="text-sm text-gray-600">
                      {ad.category?.name}
                    </p>

                    <p className="text-lg font-bold text-black mt-1">
                      {ad.price}$
                    </p>
                  </div>

                </div>
              </Link>
            ))}
          </div>

        </div>

        {/* ПРАВАЯ ЧАСТЬ */}
        <div className="w-72">

          <div className="bg-white rounded-xl shadow p-5 sticky top-24">

            <h2 className="text-lg font-semibold mb-4">
              Account information:
            </h2>

            {user && (
            <div className="flex flex-col "> {/* Уменьшили общий зазор между блоками данных */}

              <div className="leading-tight"> {/* leading-tight убирает лишнее пространство сверху/снизу текста */}
                <p className="text-gray-500 text-[18px] font-bold leading-none mb-0.5">Username:</p>
                <p className="font-medium text-[16px] leading-none">{user.username}</p>
              </div>

              <div className="leading-tight">
                <p className="text-gray-500 text-[18px] font-bold leading-none mb-0.5">Email:</p>
                <p className="font-medium text-[16px] leading-none">{user.email}</p>
              </div>

              <div className="leading-tight">
                <p className="text-gray-500 text-[18px] font-bold leading-none mb-0.5">Phone number:</p>
                <p className="font-medium text-[16px] leading-none">
                  {user.phone_number || "Not specified"}
                </p>
              </div>

            </div>
          )}

          </div>

        </div>

      </div>

    </div>
  )
}

export default MyProfile