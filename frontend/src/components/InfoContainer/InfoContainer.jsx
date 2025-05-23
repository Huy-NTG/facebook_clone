/* eslint-disable react/prop-types */
import classNames from "classnames/bind";
import styles from './InfoContainer.module.scss';
import { useEffect, useState } from "react";
import axios from "axios";
const cx = classNames.bind(styles);

const InfoContainer = ({ userId }) => {
  const [user, setUser] = useState(null);
  const [currentUserId, setCurrentUserId] = useState(null); // ✅ thêm biến state

  useEffect(() => {
    if (!userId) return;
    // ✅ lấy user đăng nhập từ sessionStorage
    const storedUser = sessionStorage.getItem("user");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setCurrentUserId(parsedUser.id);
    }
    axios
      .get(`http://localhost:8080/auth/${userId}`)
      .then((res) => {
        setUser(res.data);
      })
      .catch((err) => {
        console.error("Không thể lấy thông tin người dùng", err);
      });
  }, [userId]);

  if (!user || currentUserId === null) return <p>Đang tải thông tin...</p>;

  return (
    <div className={cx("info-container")}>
      <h3 className={cx("info-title")}>Thông tin cá nhân</h3>
      <div className={cx("info-details")}>
        {/* Không hiển thị username, password, avatarUrl, fullName, role */}
        <p><strong>Email:</strong> {user.email}</p>
        <p><strong>Giới tính:</strong> {user.gender || "Chưa cập nhật"}</p>
        <p><strong>Ngày sinh:</strong> {user.birthday || "Chưa cập nhật"}</p>
        <p><strong>Tiểu sử:</strong> {user.bio || "Chưa cập nhật"}</p>
        <p><strong>Thời gian tạo tài khoản:</strong> {new Date(user.createdAt).toLocaleString()}</p>
      </div>
    </div>
  );
};

export default InfoContainer;