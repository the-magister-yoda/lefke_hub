import { useState, useEffect } from "react";
import { api } from "../api/api";

function SettingPage() {
  const [user, setUser] = useState(null);
  const [openSection, setOpenSection] = useState("profile");
  
  // Состояния для полей ввода
  const [username, setUsername] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [currentPassword, setCurrentPassword] = useState(""); // Для визуала как на скрине

  const [message, setMessage] = useState({ text: "", type: "" });

  // Загружаем текущие данные пользователя
  useEffect(() => {
    api.get("/user/me")
      .then(res => {
        setUser(res.data);
        setUsername(res.data.username);
        setPhoneNumber(res.data.phone_number || "");
        setEmail(res.data.email);
      })
      .catch(err => console.error("Failed to load user", err));
  }, []);

  const toggleSection = (section) => {
    setOpenSection(openSection === section ? null : section);
    setMessage({ text: "", type: "" }); // Сбрасываем ошибки при переключении
  };

  const handleUpdate = async (data) => {
    try {
      // Твой бэкенд ждет PATCH user/{user_id}
      const response = await api.patch(`/user/${user.id}`, data);
      setUser(response.data);
      setMessage({ text: "Success! Information updated.", type: "success" });
      setPassword(""); // Очищаем поле пароля после смены
    } catch (err) {
      const errorMsg = err.response?.data?.detail || "Update failed";
      setMessage({ text: errorMsg, type: "error" });
    }
  };

  if (!user) return <div className="p-10 text-center text-gray-500">Loading settings...</div>;

  return (
    <div className="bg-gray-50 min-h-screen py-10 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-extrabold text-[#002f34] mb-8">Settings</h1>

        {/* ALERT MESSAGE */}
        {message.text && (
          <div className={`mb-6 p-4 rounded-md border ${message.type === "success" ? "bg-green-50 border-green-200 text-green-700" : "bg-red-50 border-red-200 text-red-700"}`}>
            {message.text}
          </div>
        )}

        <div className="flex flex-col gap-4">
          
          {/* SECTION: UPDATE USER INFORMATION (Username/Phone) */}
          <div className="bg-white border border-gray-200 rounded-sm overflow-hidden shadow-sm">
            <div onClick={() => toggleSection("profile")} className="px-6 py-5 flex justify-between items-center cursor-pointer hover:bg-gray-50 transition">
              <span className="text-lg font-semibold text-[#002f34]">Update user information</span>
              <svg className={`w-6 h-6 transition-transform ${openSection === "profile" ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
            </div>

            {openSection === "profile" && (
              <div className="px-6 py-8 border-t border-gray-100 bg-white animate-in fade-in duration-300">
                <div className="max-w-md flex flex-col gap-6">
                  <div>
                    <label className="block text-[12px] font-bold text-gray-400 uppercase mb-2">Username (Read only)</label>
                    <input type="text" disabled value={username} className="w-full p-4 bg-gray-100 border border-gray-200 rounded text-gray-500 cursor-not-allowed" />
                  </div>
                  <div>
                    <label className="block text-[12px] font-bold text-gray-400 uppercase mb-2">Phone number</label>
                    <input type="text" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} className="w-full p-4 bg-white border border-gray-200 rounded focus:outline-none focus:border-emerald-950" placeholder="+7 777 ..." />
                  </div>
                  <button onClick={() => handleUpdate({ phone_number: phoneNumber })} className="w-full md:w-max px-12 py-3 bg-emerald-950 text-white font-bold rounded hover:bg-emerald-900 transition active:scale-95">Save changes</button>
                </div>
              </div>
            )}
          </div>

          {/* SECTION: UPDATE PASSWORD */}
          <div className="bg-white border border-gray-200 rounded-sm overflow-hidden shadow-sm">
            <div onClick={() => toggleSection("password")} className={`px-6 py-5 flex justify-between items-center cursor-pointer hover:bg-gray-50 transition ${openSection === "password" ? "bg-gray-100" : ""}`}>
              <span className="text-lg font-semibold text-[#002f34]">Update Password</span>
              <svg className={`w-6 h-6 transition-transform ${openSection === "password" ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
            </div>

            {openSection === "password" && (
              <div className="px-6 py-8 border-t border-gray-100 bg-white">
                <div className="max-w-md flex flex-col gap-6">
                  <div className="relative">
                    <label className="block text-[12px] font-bold text-gray-400 uppercase mb-2">Your current password</label>
                    <input type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} className="w-full p-4 bg-white border border-gray-200 rounded focus:outline-none focus:border-emerald-950" />
                  </div>
                  <div className="relative">
                    <label className="block text-[12px] font-bold text-gray-400 uppercase mb-2">Your new password</label>
                    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full p-4 bg-white border border-gray-200 rounded focus:outline-none focus:border-emerald-950" />
                  </div>
                  <p className="text-xs text-gray-400">Password must contain at least 8 characters. For better security, add numbers and symbols.</p>
                  <button onClick={() => handleUpdate({ password: password })} className="w-full md:w-max px-12 py-3 bg-emerald-950 text-white font-bold rounded hover:bg-emerald-900 transition uppercase tracking-wider active:scale-95">Change password</button>
                </div>
              </div>
            )}
          </div>

          {/* SECTION: UPDATE EMAIL */}
          <div className="bg-white border border-gray-200 rounded-sm overflow-hidden shadow-sm">
            <div onClick={() => toggleSection("email")} className="px-6 py-5 flex justify-between items-center cursor-pointer hover:bg-gray-50 transition">
              <span className="text-lg font-semibold text-[#002f34]">Update Email</span>
              <svg className={`w-6 h-6 transition-transform ${openSection === "email" ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
            </div>

            {openSection === "email" && (
              <div className="px-6 py-8 border-t border-gray-100 bg-white">
                <div className="max-w-md flex flex-col gap-6">
                  <div>
                    <label className="block text-[12px] font-bold text-gray-400 uppercase mb-2">New Email Address</label>
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full p-4 bg-white border border-gray-200 rounded focus:outline-none focus:border-emerald-950" placeholder="example@mail.com" />
                  </div>
                  <button onClick={() => handleUpdate({ email: email })} className="w-full md:w-max px-12 py-3 bg-emerald-950 text-white font-bold rounded hover:bg-emerald-900 transition active:scale-95">Update email</button>
                </div>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}

export default SettingPage;