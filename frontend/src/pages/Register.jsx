import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { api } from "../api/api";

function Register() {
  const [form, setForm] = useState({ username: "", email: "", password: "", phone_number: "" });
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await api.post("/user/register", form);
      alert("Registration successful! Please login.");
      navigate("/login");
    } catch (err) {
      alert(err.response?.data?.detail || "Registration failed");
    }
  };

  return (
    <div className="flex justify-center items-center mt-10 px-4 pb-20">
      <form onSubmit={handleRegister} className="bg-white p-8 shadow-lg rounded-xl flex flex-col gap-4 w-full max-w-sm border border-gray-100">
        <h1 className="text-2xl font-bold text-emerald-950 mb-2">Create Account</h1>
        
        <input 
          placeholder="Username" 
          className="border rounded-lg p-2.5" 
          onChange={e => setForm({...form, username: e.target.value})} 
          required
        />
        <input 
          type="email" 
          placeholder="Email" 
          className="border rounded-lg p-2.5" 
          onChange={e => setForm({...form, email: e.target.value})} 
          required
        />
        <input 
          placeholder="Phone Number" 
          className="border rounded-lg p-2.5" 
          onChange={e => setForm({...form, phone_number: e.target.value})}
        />
        <input 
          type="password" 
          placeholder="Password" 
          className="border rounded-lg p-2.5" 
          onChange={e => setForm({...form, password: e.target.value})} 
          required
        />

        <button className="bg-emerald-950 text-white py-3 rounded-lg font-bold hover:bg-emerald-900 transition mt-2">
          Register
        </button>

        <p className="text-sm text-center text-gray-500 mt-2">
          Already have an account? <Link to="/login" className="text-emerald-700 font-bold hover:underline">Login</Link>
        </p>
      </form>
    </div>
  );
}

export default Register;