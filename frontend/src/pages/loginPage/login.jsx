import { useState } from "react";
import classNames from "classnames/bind";
import styles from './Login.module.scss';
import axios from "axios";
import LoginForm from "../../components/form/FormLogin";
import FormRegister from "../../components/formRegister/FormRegister";
import { useNavigate } from "react-router-dom"; 
const cx = classNames.bind(styles);

const Login = () => {
  const [isRegistering, setIsRegistering] = useState(false); // Kiểm soát hiển thị đăng ký / đăng nhập
  const navigate = useNavigate(); // Hook dùng để chuyển trang
  const handleLogin = async (formData) => {
    console.log("Dữ liệu gửi lên:", formData);
    try {
      const response = await axios.post("http://localhost:8080/auth/login", formData, {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json"
        }
      });

      const userData = response.data; // Nhận dữ liệu từ backend
      console.log("Dữ liệu nhận được:", userData);

      // Lưu thông tin người dùng vào localStorage
      localStorage.setItem("user", JSON.stringify(userData));

      // Chuyển hướng đến trang HomePage
      navigate("/homepage");

    // eslint-disable-next-line no-unused-vars
    } catch (error) {
      alert("Đăng nhập thất bại!");
    }
  };

  const handleRegister = async (formData) => {
    try {
      axios.post("http://localhost:8080/auth/register", formData, {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json"
        }
      })
      .then(response => console.log(response.data))
    // eslint-disable-next-line no-unused-vars
    } catch (error) {
      alert("Đăng ký thất bại! Vui lòng thử lại.");
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
