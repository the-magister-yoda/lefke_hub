import { useEffect, useState } from "react"
import { api } from "../api/api"

function MyProfile() {
  const [user, setUser] = useState(null)

  useEffect(() => {
    api.get("/user/me").then(res => setUser(res.data))
  }, [])

  if (!user) return <div className="p-10">Loading...</div>

  return (
    <div className="max-w-xl mx-auto mt-10 bg-white p-6 shadow rounded">
      <h1 className="text-2xl font-bold mb-4">{user.username}</h1>
      <p>Email: {user.email}</p>
      <p>Phone: {user.phone_number}</p>
      <p>Role: {user.role}</p>
      <p>Registered at: {new Date(user.created_at).toLocaleString()}</p>
      <p>Status: {user.status}</p>
    </div>
  )
}

export default MyProfile