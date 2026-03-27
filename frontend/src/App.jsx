import { BrowserRouter, Routes, Route } from "react-router-dom"
import Navbar from "./components/Navbar"
import Home from "./pages/Home"
import Login from "./pages/Login"
import Register from "./pages/Register"
import CreateAd from "./pages/CreateAd"
import AdPage from "./pages/AdPage"
import MyProfile from "./pages/MyProfile"
import SettingPage from "./pages/SettingPage"
import Favorites from "./pages/Favorites"
import EditAd from "./pages/EditAd"
import BottomNav from "./components/BottomNav";


function App() {
  return (
    <BrowserRouter> 
      <div className="app-container min-h-screen bg-white">
        <Navbar />
        <div className="pb-16 md:pb-0"> 
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/create" element={<CreateAd />} />
            <Route path="/ad/:id" element={<AdPage />} />
            <Route path="/myprofile" element={<MyProfile />} />
            <Route path="/setting" element={<SettingPage />} />
            <Route path="/favorites" element={<Favorites />} />
            <Route path="/edit-ad/:id" element={<EditAd />} />
          </Routes>
        </div>
        <BottomNav /> 
      </div>
    </BrowserRouter>
  );
}

export default App;