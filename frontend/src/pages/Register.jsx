import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { api } from "../api/api"

function Register() {
  const [form, setForm] = useState({})
  const navigate = useNavigate()

  const register = async (e) => {
    e.preventDefault()
    try {
      await api.post("/user/register", form)
      alert("Registered successfully")
      navigate("/")  // redirect to home after registration
    } catch (err) {
      alert("Registration failed")
    }
  }

  return (
    <div className="flex justify-center mt-20">
      <form onSubmit={register} className="bg-white p-8 shadow rounded flex flex-col gap-4 w-80">
        <input placeholder="username" className="border p-2" onChange={e => setForm({...form, username: e.target.value})} />
        <input placeholder="email" className="border p-2" onChange={e => setForm({...form, email: e.target.value})} />
        <input placeholder="phone" className="border p-2" onChange={e => setForm({...form, phone_number: e.target.value})} />
        <input type="password" placeholder="password" className="border p-2" onChange={e => setForm({...form, password: e.target.value})} />
        <button className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600">Register</button>
      </form>
    </div>
  )
}

export default Register