import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { api } from "../api/api";

function Navbar() {
  const [user, setUser] = useState(null);
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      api.get("/user/me")
        .then(res => setUser(res.data))
        .catch(() => setUser(null));
    }

    const controlNavbar = () => {
      if (window.scrollY > lastScrollY && window.scrollY > 100) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }
      setLastScrollY(window.scrollY);
    };

    window.addEventListener("scroll", controlNavbar);
    return () => window.removeEventListener("scroll", controlNavbar);
  }, [lastScrollY]);

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    navigate("/");
    window.location.reload();
  };

  return (
    <>
      <nav 
        className={`bg-emerald-950 text-white fixed top-0 w-full z-50 shadow-md transition-transform duration-300 ${
          isVisible ? "translate-y-0" : "-translate-y-full"
        }`}
      >
        {/* px-4 для мобилок, px-10 для компа */}
        <div className="max-w-7xl mx-auto px-4 md:px-10 flex justify-between items-center h-[72px]">
          
          {/* LOGO */}
          <Link to="/" className="text-xl md:text-2xl font-extrabold text-white no-underline tracking-tight">
            LefkeHub
          </Link>

          {/* КНОПКИ: Скрыты на мобилках (hidden), видны на десктопе (md:flex) */}
          <div className="hidden md:flex items-center gap-6">
            {user ? (
              <div
                className="relative h-[72px] flex items-center"
                onMouseEnter={() => setOpen(true)}
                onMouseLeave={() => setOpen(false)}
              >
                <div
                  onClick={() => navigate("/myprofile")}
                  className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity"
                >
                  <div className="w-8 h-8 bg-emerald-700 rounded-full flex items-center justify-center text-white overflow-hidden border border-emerald-500">
                    <span className="text-sm font-bold">{user.username[0].toUpperCase()}</span>
                  </div>
                  <span className="font-semibold text-sm whitespace-nowrap">Your Profile</span>
                  <span className={`text-[10px] transition-transform duration-200 ${open ? "rotate-180" : ""}`}>
                    ▼
                  </span>
                </div>

                <div
                  className={`absolute right-[-16px] top-[72px] w-56 bg-white text-[#002f34] rounded-sm shadow-xl border border-gray-100 overflow-hidden transition-all duration-200 
                    ${open ? "opacity-100 visible translate-y-0" : "opacity-0 invisible translate-y-1"}`}
                >
                  <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-50">
                    <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-lg font-bold text-emerald-950">{user.username[0].toUpperCase()}</span>
                    </div>
                    <div className="flex flex-col overflow-hidden">
                      <span className="font-bold text-sm truncate">{user.username}</span>
                      <span className="text-[11px] text-gray-400 font-medium">ID:1000{user.id}</span>
                    </div>
                  </div>

                  <div className="flex flex-col py-1">
                    <div onClick={() => navigate("/myprofile")} className="px-4 py-1.5 hover:bg-emerald-950 hover:text-white cursor-pointer transition-colors text-[14px]">Your ads</div>
                    <div onClick={() => navigate("/setting")} className="px-4 py-1.5 hover:bg-emerald-950 hover:text-white cursor-pointer transition-colors text-[14px]">Settings</div>
                    <div onClick={() => navigate("/favorites")} className="px-4 py-1.5 hover:bg-emerald-950 hover:text-white cursor-pointer transition-colors text-[14px]">Favorites</div>
                    <div className="border-t border-gray-100 my-1"></div>
                    <div onClick={logout} className="px-4 py-1.5 hover:bg-emerald-950 hover:text-white cursor-pointer transition-colors text-[14px]">Logout</div>
                  </div>
                </div>
              </div>
            ) : (
              <Link to="/login" className="text-white no-underline font-bold text-sm hover:text-emerald-200">Login</Link>
            )}

            <Link
              to="/create"
              className="bg-white text-emerald-950 px-5 py-2 rounded-md font-bold text-sm hover:bg-gray-100 transition no-underline"
            >
              Post an ad
            </Link>
          </div>
          
          {/* Заглушка для мобилок, чтобы навбар не казался пустым справа, 
              можно добавить иконку уведомлений или поиска здесь в будущем */}
        </div>
      </nav>

      <div className="h-[72px]"></div>
    </>
  );
}

export default Navbar;