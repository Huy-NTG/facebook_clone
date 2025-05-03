/* eslint-disable react/prop-types */
import classNames from "classnames/bind";
import styles from './InfoContainer.module.scss';
import { useEffect, useState } from "react";
import axios from "axios";
import SettingForm from "../SettingForm/SettingForm";
const cx = classNames.bind(styles);

const InfoContainer = ({ userId }) => {
  const [user, setUser] = useState(null);
  const [currentUserId, setCurrentUserId] = useState(null); // ✅ thêm biến state
  const [isEditing, setIsEditing] = useState(false); // ✅ quản lý trạng thái

  useEffect(() => {
    if (!userId) return;
    // ✅ lấy user đăng nhập từ localStorage
    const storedUser = localStorage.getItem("user");
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
      {/* ✅ Hiển thị form chỉnh sửa */}
      {currentUserId === userId && (
        <div className={cx("change_profile_btn")}>
          <button className={cx("btn")} onClick={() => setIsEditing(true)}>
            Chỉnh sửa hồ sơ
          </button>
        </div>
      )}
      {/* Hiển thị SettingForm như modal */}
      {isEditing && (
        <SettingForm user={user} onClose={() => setIsEditing(false)} />
      )}
    </div>
  );
};

export default InfoContainer;