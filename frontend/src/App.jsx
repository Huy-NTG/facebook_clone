import "./App.css";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/loginPage/login.jsx";
import HomePage from "./pages/homePage/HomePage.jsx";
import FriendPage from "./pages/friendsPage/friendPage.jsx";
import ProfilePage from "./pages/profilePage/profile.jsx";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} /> {/* Chuyển hướng về trang Login */}
        <Route path="/login" element={<Login />} />
        <Route path="/homepage" element={<HomePage />} /> {/* Thêm route Home nếu cần */}
        <Route path="/friendpage" element={<FriendPage />} />
        <Route path="/profilepage" element={<ProfilePage />} />

      </Routes>
    </Router>
  );
}

export default App;
