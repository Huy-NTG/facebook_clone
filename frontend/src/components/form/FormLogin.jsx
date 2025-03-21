import { useState } from "react";
import classNames from "classnames/bind";
import styles from './FormLogin.module.scss';
const cx = classNames.bind(styles);

// eslint-disable-next-line react/prop-types
const LoginForm = ({ onSubmit, onRegister }) => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className={cx("form-login")}>
      <input type="email" name="email" placeholder="Email address or phone number" onChange={handleChange} className={cx("input-user")} />
      <input type="password" name="password" placeholder="Password" onChange={handleChange} className={cx("input-password")} />
      <button type="submit" className={cx("login-btn")}>Log in</button>
      <a href="">Forgotten password?</a>
      <button type="button" onClick={onRegister} className={cx("change-register-btn")}>Create a new account</button>
    </form>
  );
};

export default LoginForm;
