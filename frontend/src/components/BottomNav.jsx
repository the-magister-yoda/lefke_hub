import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

function BottomNav() {
  const location = useLocation();
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem("token"));

  // Следим за изменением токена (например, после логина/лог-аута)
  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsAuthenticated(!!token);
  }, [location]); // Срабатывает при каждом переходе, чтобы проверить статус заново

  const navItems = [
    { label: "Main", path: "/", icon: "/bottom/main.png", private: false },
    { label: "Favourites", path: "/favorites", icon: "/bottom/favourites.png", private: true },
    { label: "Create", path: "/create", icon: "/bottom/plus.png", private: true },
    { label: "Ads", path: "/myprofile", icon: "/bottom/ads.png", private: true },
    { label: "Profile", path: "/setting", icon: "/bottom/profile.png", private: true },
  ];

  const handleNavClick = (e, item) => {
    const token = localStorage.getItem("token");
    
    // Если страница приватная и токена нет в localStorage
    if (item.private && !token) {
      e.preventDefault();
      navigate("/login");
    }
  };

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 z-50 h-[64px] flex justify-around items-center px-1 shadow-[0_-2px_10px_rgba(0,0,0,0.05)]">
      {navItems.map((item) => {
        const isActive = location.pathname === item.path;

        return (
          <Link
            key={item.path}
            to={item.path}
            onClick={(e) => handleNavClick(e, item)}
            className="flex flex-col items-center justify-center no-underline flex-1 h-full transition-all duration-150 active:scale-90"
          >
            <div className="w-8 h-8 flex items-center justify-center rounded-full">
              <img 
                src={item.icon} 
                alt={item.label} 
                className={`w-[20px] h-[20px] object-contain transition-all duration-200 ${
                  isActive 
                    ? "brightness-0 opacity-100 invert-[21%] sepia-[90%] saturate-[619%] hue-rotate-[136deg] brightness-[91%] contrast-[96%]" 
                    : "opacity-40 brightness-0"
                }`} 
              />
            </div>

            <span className={`text-[10px] mt-0.5 font-medium tracking-tight ${
              isActive ? "text-emerald-950 font-bold" : "text-gray-400"
            }`}>
              {item.label}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}

export default BottomNav;