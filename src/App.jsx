import { Route, Routes } from "react-router-dom";
import Test from "./components/test";
import AdminPage from "./pages/admin";
import HomePage from "./pages/home";
import LoginPage from "./pages/login";



export default function App() {

  return (
    <div className="w-full h-screen">
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/admin/*" element={<AdminPage />} />
        <Route path="/login" element={<LoginPage />} />
      </Routes>
    </div>
  )
} 