import { useState, useEffect } from "react";
import { api } from "../api/api";
import { useNavigate } from "react-router-dom";

function SettingPage() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [openSection, setOpenSection] = useState("profile");
  
  const [username, setUsername] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");

  const [message, setMessage] = useState({ text: "", type: "" });

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
    setMessage({ text: "", type: "" });
  };

  const handleUpdate = async (data) => {
    try {
      const response = await api.patch(`/user/${user.id}`, data);
      setUser(response.data);
      setMessage({ text: "Success! Information updated.", type: "success" });
      setPassword("");
      setCurrentPassword("");
    } catch (err) {
      const errorMsg = err.response?.data?.detail || "Update failed";
      setMessage({ text: errorMsg, type: "error" });
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
    window.location.reload();
  };

  if (!user) return <div className="p-10 text-center text-gray-500 animate-pulse">Loading settings...</div>;

  return (
    <div className="bg-white md:bg-gray-50 min-h-screen pb-24 md:py-10">
      <div className="max-w-4xl mx-auto">
        
        {/* HEADER */}
        <div className="px-6 py-6 md:px-0 md:py-0 md:mb-8 bg-white md:bg-transparent border-b md:border-none border-gray-100">
          <h1 className="text-2xl md:text-3xl font-black text-[#002f34]">Settings</h1>
          <p className="text-gray-400 text-sm font-medium md:hidden mt-1">Manage your account and security</p>
        </div>

        <div className="mt-6">
          {message.text && (
            <div className="mx-6 mb-6 p-4 rounded-xl border font-medium text-sm bg-gray-50 text-gray-700">
              {message.text}
            </div>
          )}

          <div className="flex flex-col gap-3 md:gap-4 px-4 md:px-0">
            
            {/* КАРТОЧКА: UPDATE USER INFORMATION */}
            <div className="bg-white border border-gray-100 md:border-gray-200 rounded-2xl md:rounded-sm overflow-hidden shadow-sm">
              <div onClick={() => toggleSection("profile")} className="px-6 py-5 flex justify-between items-center cursor-pointer hover:bg-gray-50 transition">
                <span className="text-base md:text-lg font-bold text-[#002f34]">Update user information</span>
                <svg className={`w-5 h-5 text-gray-400 transition-transform ${openSection === "profile" ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
              </div>

              {openSection === "profile" && (
                <div className="px-6 py-6 border-t border-gray-50 bg-white">
                  {/* КЛЮЧЕВОЕ ИЗМЕНЕНИЕ: w-[85%] для мобилок отодвинет поле от правого края */}
                  <div className="w-[85%] md:w-full md:max-w-md flex flex-col gap-5">
                    <div>
                      <label className="block text-[11px] font-black text-gray-400 uppercase mb-2 tracking-widest">Username</label>
                      <input type="text" disabled value={username} className="w-full p-4 bg-gray-50 border border-gray-100 rounded-xl text-gray-400 font-medium" />
                    </div>
                    <div>
                      <label className="block text-[11px] font-black text-gray-400 uppercase mb-2 tracking-widest">Phone number</label>
                      <input type="text" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} className="w-full p-4 bg-white border border-gray-200 rounded-xl outline-none focus:border-emerald-950 transition-all" />
                    </div>
                    <button onClick={() => handleUpdate({ phone_number: phoneNumber })} className="w-full md:w-max px-10 py-4 bg-emerald-950 text-white font-bold rounded-xl shadow-lg shadow-emerald-950/10">Save</button>
                  </div>
                </div>
              )}
            </div>

            {/* КАРТОЧКА: UPDATE PASSWORD */}
            <div className="bg-white border border-gray-100 md:border-gray-200 rounded-2xl md:rounded-sm overflow-hidden shadow-sm">
              <div onClick={() => toggleSection("password")} className="px-6 py-5 flex justify-between items-center cursor-pointer hover:bg-gray-50 transition">
                <span className="text-base md:text-lg font-bold text-[#002f34]">Update Password</span>
                <svg className={`w-5 h-5 text-gray-400 transition-transform ${openSection === "password" ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
              </div>

              {openSection === "password" && (
                <div className="px-6 py-6 border-t border-gray-50 bg-white">
                  <div className="w-[85%] md:w-full md:max-w-md flex flex-col gap-5">
                    <div>
                      <label className="block text-[11px] font-black text-gray-400 uppercase mb-2 tracking-widest">Current password</label>
                      <input type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} className="w-full p-4 bg-white border border-gray-200 rounded-xl outline-none focus:border-emerald-950" />
                    </div>
                    <div>
                      <label className="block text-[11px] font-black text-gray-400 uppercase mb-2 tracking-widest">New password</label>
                      <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full p-4 bg-white border border-gray-200 rounded-xl outline-none focus:border-emerald-950" />
                    </div>
                    <button onClick={() => handleUpdate({ password: password })} className="w-full md:w-max px-10 py-4 bg-emerald-950 text-white font-black rounded-xl shadow-lg shadow-emerald-950/10 uppercase text-xs tracking-widest">Change</button>
                  </div>
                </div>
              )}
            </div>

            {/* КАРТОЧКА: UPDATE EMAIL */}
            <div className="bg-white border border-gray-100 md:border-gray-200 rounded-2xl md:rounded-sm overflow-hidden shadow-sm">
              <div onClick={() => toggleSection("email")} className="px-6 py-5 flex justify-between items-center cursor-pointer hover:bg-gray-50 transition">
                <span className="text-base md:text-lg font-bold text-[#002f34]">Update Email</span>
                <svg className={`w-5 h-5 text-gray-400 transition-transform ${openSection === "email" ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
              </div>

              {openSection === "email" && (
                <div className="px-6 py-6 border-t border-gray-50 bg-white">
                  <div className="w-[85%] md:w-full md:max-w-md flex flex-col gap-5">
                    <div>
                      <label className="block text-[11px] font-black text-gray-400 uppercase mb-2 tracking-widest">New Email</label>
                      <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full p-4 bg-white border border-gray-200 rounded-xl outline-none focus:border-emerald-950" placeholder="example@mail.com" />
                    </div>
                    <button onClick={() => handleUpdate({ email: email })} className="w-full md:w-max px-10 py-4 bg-emerald-950 text-white font-bold rounded-xl shadow-lg shadow-emerald-950/10">Update</button>
                  </div>
                </div>
              )}
            </div>

            {/* LOGOUT */}
            <div className="mt-8 md:mt-12 w-[85%] md:w-full">
              <button onClick={handleLogout} className="w-full md:w-max flex items-center justify-center gap-3 px-10 py-4 bg-red-50 text-red-600 font-bold rounded-2xl md:rounded-lg hover:bg-red-100 transition-colors active:scale-[0.98]">
                Logout from account
              </button>
              <p className="text-center md:text-left text-[11px] text-gray-400 mt-4 font-medium px-4 md:px-0 uppercase tracking-tighter">LefkeHub Demo Version 2.0.4 - 2026</p>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}

export default SettingPage;
        