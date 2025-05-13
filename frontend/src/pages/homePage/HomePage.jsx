import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import classNames from "classnames/bind";
import styles from "./HomePage.module.scss";
// import axios from "axios";
import Navbar from "../../components/navigation/Navigation";
import Postingfrom from "../../components/postingForm/PostingForm";
import PostList from "../../components/ContainerPost/ContainerPost";
import FriendList from "../../components/ListFriends/ListFriends";
const cx = classNames.bind(styles);

const HomePage = () => {
    const [user, setUser] = useState(null);
    const navigate = useNavigate();
  
    useEffect(() => {
      // Lấy dữ liệu người dùng từ localStorage
      const storedUser = localStorage.getItem("user");
  
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      } else {
        navigate("/"); // Nếu chưa đăng nhập, quay lại trang Login
      }
    }, [navigate]);
  
    return (
      <>
            {/* Navbar */}
            <Navbar user={user} />

            {/* Form đăng bài */}
            <div className={cx("container-home")}>
                <Postingfrom user={user} />
            </div>

            {/* Bố cục bài viết + danh sách bạn bè */}
            <div className={cx("container-content")}>
                {/* Danh sách bài viết */}
                <div className={cx("container-post")}>
                    <PostList />
                </div>
                {/* Danh sách bạn bè */}
                <div className={cx("container-friends")}>
                    <FriendList />
                </div>
            </div>
        </>
    );
  };

export default HomePage;