import { useState } from "react";
import classNames from "classnames/bind";
import styles from './FormRegister.module.scss';
const cx = classNames.bind(styles);
// eslint-disable-next-line react/prop-types
const FormRegister = ({ onSubmit }) => {
    const [formData, setFormData] = useState({
      fullName: "",
      email: "",
      password: "",
    });
  
    const handleChange = (e) => {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    };
  
    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData); // Gọi hàm xử lý submit từ component cha
      };
  
    return (
    <div className={cx("container-register-form")}>
        <div className={cx("logo-title")}>facebook</div>
        <form onSubmit={handleSubmit} className={cx("form-register")}>
            <div className={cx("register-title")}>
                <h1>Create a new account</h1>
                <h3>It&apos;s quick and easy.</h3>
            </div>
            <input type="text" name="fullName" placeholder="Full Name" onChange={handleChange} className={cx("input-user")} required/>
            <input type="email" name="email" placeholder="Email" onChange={handleChange} className={cx("input-email")} required/>
            <input type="password" name="password" placeholder="New Password" onChange={handleChange} className={cx("input-password")} required/>
            <p>
                People who use our service may have uploaded your contact information to Facebook. Learn more.
                By clicking Sign Up, you agree to our Terms, Privacy Policy and Cookies Policy. You may receive SMS notifications from us and can opt out at any time.
            </p>
            <button type="submit" className={cx("register-btn")}>Sign Up</button>
            <a href="" className={cx("change-login-btn")}>Already have an account?</a>
        </form>
    </div>
    );
  };
export default FormRegister;