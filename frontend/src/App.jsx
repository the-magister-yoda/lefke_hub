import { BrowserRouter, Routes, Route } from "react-router-dom"
import Navbar from "./components/Navbar"
import Home from "./pages/Home"
import Login from "./pages/Login"
import Register from "./pages/Register"
import CreateAd from "./pages/CreateAd"
import AdPage from "./pages/AdPage"
import MyProfile from "./pages/MyProfile"
import UploadImage from "./pages/UploadImage"

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/create" element={<CreateAd />} />
        <Route path="/ad/:id" element={<AdPage />} />
        <Route path="/ad/:id/upload_image" element={<UploadImage />} />
        <Route path="/myprofile" element={<MyProfile />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App