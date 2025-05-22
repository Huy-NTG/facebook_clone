/* eslint-disable no-undef */
/* eslint-disable react/prop-types */
/* eslint-disable react/jsx-no-duplicate-props */
import { useState, useEffect } from "react";
import { FaFacebook, FaBell, FaUserFriends, FaBars, FaSearch, FaHome, FaFacebookMessenger, FaHouseUser } from "react-icons/fa";
import classNames from "classnames/bind";
import styles from './Navigation.module.scss';
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import useNotificationSocket from "../../hooks/useNotificationSocket";   // 👈 hook bạn đã viết

const cx = classNames.bind(styles);
// eslint-disable-next-line react/prop-types
const Navbar = ({ user }) => {
    const [search, setSearch] = useState("");
    const navigate = useNavigate();
    
      // 👉 chỉ 1 dòng – hook sẽ tự connect & toast
    useNotificationSocket(user?.id);
    const handleSearch = (e) => {
      e.preventDefault();
      if (search.trim()) {
        navigate(`/search/${encodeURIComponent(search.trim())}`);
        setSearch("");
      }
    };
    
    return (
      <>
      <nav className={cx("navbar")}>
        {/* Logo */}
        <div className={cx("navbar-left")}>
          <FaFacebook className={cx("logo")} onClick={() => navigate("/homepage")} />
          <form onSubmit={handleSearch}>
          <FaSearch className={cx("search-icon")} />
            <input 
              type="text" 
              placeholder="Tìm kiếm trên Facebook" 
              value={search} 
              onChange={(e) => setSearch(e.target.value)} 
            />
          </form>
        </div>
        {/* Menu chính */}
        <div className={cx("navbar-center")}>
          <FaHome className={cx("nav-icon")} onClick={() => navigate("/homepage")} />
          <FaUserFriends className={cx("nav-icon")} onClick={() => navigate("/friendpage")} />
          <FaHouseUser className={cx("nav-icon")} onClick={() => navigate("/profilepage")} />
          <FaBars className={cx("nav-icon")} />
        </div>
        {/* Avatar người dùng */}
        <div className={cx("navbar-right")}>
                {/* <FaFacebookMessenger className={cx("chat-icon")}/>
                <FaBell className={cx("Notification-icon")} /> */}
                {user ? (
                    // eslint-disable-next-line react/prop-types
                    <span className={cx("user-name")}>{user.username}</span>
                ) : (
                    <span>Đang tải...</span>
                )}
                <button
                  onClick={() => {
                    sessionStorage.removeItem("user"); // Xóa user khỏi sessionStorage
                    navigate("/login"); // Chuyển về trang login
                  }}
                >
                  Đăng xuất
                </button>
            </div>
      </nav>
      {/* khay toast (render 1 lần cho toàn app càng tốt) */}
      <ToastContainer newestOnTop limit={1} />
      {/* <ToastContainer position="bottom-right" newestOnTop limit={3} /> */}
      </>
    );
  };
  export default Navbar;