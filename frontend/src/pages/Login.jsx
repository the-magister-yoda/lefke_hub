import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import { api } from "../api/api"

function Login() {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const navigate = useNavigate()

  const login = async (e) => {
    e.preventDefault()
    try {
      const form = new FormData()
      form.append("username", username)
      form.append("password", password)

      const res = await api.post("/user/login", form)
      localStorage.setItem("token", res.data.access_token)
      navigate("/")  // redirect after login
    } catch (err) {
      alert("Login failed")
    }
  }

  return (
    <div className="flex justify-center mt-20">
      <form onSubmit={login} className="bg-white p-8 shadow rounded flex flex-col gap-4 w-80">
        <input placeholder="username" className="border p-2" onChange={e => setUsername(e.target.value)} />
        <input type="password" placeholder="password" className="border p-2" onChange={e => setPassword(e.target.value)} />
        <button className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600">Login</button>
        <p className="text-sm text-gray-500 mt-2">
          Don't have an account? <Link to="/register" className="text-blue-600 hover:underline">Register</Link>
        </p>
      </form>
    </div>
  )
}

export default Login