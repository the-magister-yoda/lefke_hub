import { Link, useNavigate } from "react-router-dom"
import { useState, useEffect } from "react"
import { api } from "../api/api"

function Navbar() {
  const [user, setUser] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    const token = localStorage.getItem("token")
    if (token) {
      api
        .get("/user/me")
        .then(res => setUser(res.data))
        .catch(() => setUser(null))
    }
  }, [])

  const logout = () => {
    localStorage.removeItem("token")
    setUser(null)
    navigate("/")
  }

  const handleProfileClick = () => {
    if (user) {
      navigate("/myprofile")
    } else {
      navigate("/login")
    }
  }

  return (
    <div className="bg-emerald-950 text-white sticky top-0 z-40 shadow-md rounded-xl">
      <div className="max-w-7xl mx-auto px-6 flex justify-between items-center h-20">

        {/* ЛОГО */}
        <Link
          to="/"
          className="text-2xl font-extrabold text-white no-underline"
        >
          LefkeHub
        </Link>

        {/* ПРАВАЯ ЧАСТЬ */}
        <div className="flex items-center gap-6">

          {/* Your Profile */}
          <span
            onClick={handleProfileClick}
            className="text-1xl font-extrabold text-white hover:text-white cursor-pointer transition"
          >
            👤 Your Profile
          </span>

          {/* Post Ad */}
          <Link
            to="/create"
            className="text-1xl bg-white text-emerald-950 px-5 py-2 rounded-lg font-medium hover:bg-gray-200 transition no-underline"
          >
            Post an ad
          </Link>


        </div>
      </div>
    </div>
  )
}

export default Navbar