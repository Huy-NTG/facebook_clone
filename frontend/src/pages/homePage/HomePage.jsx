import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import classNames from "classnames/bind";
import styles from "./HomePage.module.scss";
import axios from "axios";
import Navbar from "../../components/navigation/Navigation";
import Postingfrom from "../../components/postingForm/PostingForm";
import PostList from "../../components/ContainerPost/ContainerPost";
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
       {/* Truyền user vào Navbar */}
       <Navbar user={user} />
         <div className={cx("container-home")}>
            <Postingfrom user={user} />
         </div>
         {/* Hiển thị danh sách bài viết */}
         <div className={cx("container-post")}>
            <PostList />
         </div>
      </>
    );
  };

export default HomePage;