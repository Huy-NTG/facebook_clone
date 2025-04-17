/* eslint-disable react/prop-types */
import classNames from "classnames/bind";
import styles from './InfoContainer.module.scss';

const cx = classNames.bind(styles);

const InfoContainer = ({ user }) => {
  if (!user) return <p>Đang tải thông tin...</p>;

  return (
    <div className={cx("info-container")}>
      <img
        src={`http://localhost:8080/uploads/${user.avatarUrl}`}
        alt="avatar"
        className={cx("avatar")}
        onError={(e) => {
          e.target.onerror = null;
          e.target.src = "/assets/img/icons8-user-default-64.png";
        }}
      />
      <div className={cx("info-details")}>
        <p><strong>Họ tên:</strong> {user.fullName}</p>
        <p><strong>Tên người dùng:</strong> {user.username}</p>
        <p><strong>Email:</strong> {user.email}</p>
        <p><strong>Giới tính:</strong> {user.gender || "Chưa cập nhật"}</p>
        <p><strong>Ngày sinh:</strong> {user.birthday || "Chưa cập nhật"}</p>
        <p><strong>Tiểu sử:</strong> {user.bio || "Chưa cập nhật"}</p>
        <p><strong>Vai trò:</strong> {user.role}</p>
      </div>
    </div>
  );
};

export default InfoContainer;
