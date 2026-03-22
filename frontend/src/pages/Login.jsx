import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { api } from "../api/api";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const login = async (e) => {
    e.preventDefault();
    try {
      const form = new FormData();
      form.append("username", username);
      form.append("password", password);

      const res = await api.post("/user/login", form);
      localStorage.setItem("token", res.data.access_token);
      
      // Используем navigate вместо window.location для скорости
      // И делаем переход на главную или в профиль
      navigate("/myprofile");
      window.location.reload(); // Чтобы Navbar обновил статус юзера
    } catch (err) {
      alert("Invalid username or password");
    }
  };

  return (
    <div className="flex justify-center items-center mt-20 px-4">
      <form onSubmit={login} className="bg-white p-8 shadow-lg rounded-xl flex flex-col gap-4 w-full max-w-sm border border-gray-100">
        <h1 className="text-2xl font-bold text-emerald-950 mb-2">Login</h1>
        
        <div className="flex flex-col gap-1">
          <label className="text-sm font-semibold text-gray-600">Username</label>
          <input 
            className="border rounded-lg p-2.5 outline-none focus:border-emerald-600" 
            onChange={e => setUsername(e.target.value)} 
            placeholder="Enter your username"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-sm font-semibold text-gray-600">Password</label>
          <input 
            type="password" 
            className="border rounded-lg p-2.5 outline-none focus:border-emerald-600" 
            onChange={e => setPassword(e.target.value)} 
            placeholder="••••••••"
          />
        </div>

        <button className="bg-emerald-950 text-white py-3 rounded-lg font-bold hover:bg-emerald-900 transition mt-2">
          Sign In
        </button>

        <p className="text-sm text-center text-gray-500 mt-2">
          Don't have an account? <Link to="/register" className="text-emerald-700 font-bold hover:underline">Register</Link>
        </p>
      </form>
    </div>
  );
}

export default Login;