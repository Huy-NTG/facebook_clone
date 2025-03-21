import { useState } from "react";
import classNames from "classnames/bind";
import styles from './Login.module.scss';
import axios from "axios";
import LoginForm from "../../components/form/FormLogin";
import FormRegister from "../../components/formRegister/FormRegister";
import { useNavigate } from "react-router-dom"; 
const cx = classNames.bind(styles);

const Login = () => {
  // eslint-disable-next-line no-unused-vars
  const [loading, setLoading] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false); // Kiểm soát hiển thị đăng ký / đăng nhập
  const navigate = useNavigate(); // Hook dùng để chuyển trang

  const handleLogin = async (formData) => {
    setLoading(true); // Bắt đầu loading
    try {
      const response = await axios.post("http://localhost:8080/auth/login", formData, {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json"
        }
      });
  
      const userData = response.data;
      localStorage.setItem("user", JSON.stringify(userData));
      navigate("/homepage");
  
    } catch (error) {
      alert(error.response?.data?.message || "Đăng nhập thất bại! Vui lòng thử lại.");
    } finally {
      setLoading(false); // Dừng loading
    }
  };
  
  const handleRegister = async (formData) => {
    try {
      const response = await axios.post("http://localhost:8080/auth/register", formData, {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json"
        }
      });
  
      console.log("Đăng ký thành công:", response.data);
      alert("Đăng ký thành công! Hãy đăng nhập.");
      setIsRegistering(false); // Quay lại trang đăng nhập
  
    } catch (error) {
      alert(error.response?.data?.message || "Đăng ký thất bại! Vui lòng thử lại.");
    }
  };
  return (
    <div className={cx("login-background")}>
      {isRegistering ? (
        // Giao diện đăng ký
        <div className={cx("container-register")}>
          <FormRegister onSubmit={handleRegister} />
        </div>
      ) : (
        // Giao diện đăng nhập
        <>
          <div className={cx("login-title-container")}>
            <h1>facebook</h1>
            <h3>Facebook helps you connect and share with the people in your life.</h3>
          </div>
          <div className={cx("login-container-form")}>
            <LoginForm onSubmit={handleLogin} onRegister={() => setIsRegistering(true)} />
          </div>
        </>
      )}
    </div>
  );
};

export default Login;
