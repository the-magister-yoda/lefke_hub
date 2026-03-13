import { Link, useNavigate } from "react-router-dom"
import { useState, useEffect } from "react"
import { api } from "../api/api"

function Navbar() {
  const [user, setUser] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    const token = localStorage.getItem("token")
    if (token) {
      api.get("/user/me").then(res => setUser(res.data)).catch(() => setUser(null))
    }
  }, [])

  const logout = () => {
    localStorage.removeItem("token")
    setUser(null)
    navigate("/")
  }

  return (
    <div className="bg-white shadow">
      <div className="max-w-7xl mx-auto flex justify-between items-center p-4">
        <Link to="/" className="text-2xl font-bold text-blue-600">LefkeHub</Link>
        <div className="flex gap-4 items-center">
          <Link to="/" className="text-gray-700 hover:text-blue-600">Home</Link>
          <Link to="/create" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">Post Ad</Link>

          {user ? (
            <>
              <Link to="/myprofile" className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">MyProfile</Link>
              <button onClick={logout} className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600">Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">Login</Link>
              <Link to="/register" className="bg-gray-200 text-gray-800 px-4 py-2 rounded hover:bg-gray-300">Register</Link>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default Navbar