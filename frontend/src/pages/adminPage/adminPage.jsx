import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Siderbar from "../../components/Siderbar/Siderbar.jsx";
import styles from "./AdminPage.module.scss";
import PostManagement from "../../components/PostManagement/PostManagement.jsx";
import UserManagement from "../../components/UserManagement/UserManagement.jsx";
import Statistic from '../../components/Statistic/Statistic';
import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
const AdminPage = () => {
    const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (location.pathname === "/adminpage") {
      navigate("/adminpage/dashboard");
    }
  }, [location, navigate]);
   return(
    <div className={styles.container}>
        <Siderbar />
             <Routes>
                <Route path="/dashboard" element={<h1>Hello</h1>} />
                <Route path="/posts" element={<PostManagement/>} />
                <Route path="/users" element={<UserManagement/>} />
                <Route path="/statistic" element={<Statistic/>} />
                <Route path="*" element={<h1>404</h1>} />
             </Routes>
    </div>
        
       
   )
}
export default AdminPage;