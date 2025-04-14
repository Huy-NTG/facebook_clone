import Navbar from "../../components/navigation/Navigation";
import ProfileHeader from "../../components/ProfileHeader/ProfileHeader";
import ListFriendsByID from "../../components/ListFriendsByID/ListFriendsByID";
import PostList from "../../components/ContainerPost/ContainerPost";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import classNames from "classnames/bind";
import styles from "./ProfilePage.module.scss";

const cx = classNames.bind(styles);

const Profilepage = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const { id: paramId } = useParams(); // lấy id từ URL nếu có

  useEffect(() => {
    const storedUser = localStorage.getItem("user");

    if (!storedUser) {
      navigate("/");
      return;
    }

    const loggedInUser = JSON.parse(storedUser);
    const targetUserId = paramId || loggedInUser.id;

    axios
      .get(`http://localhost:8080/auth/${targetUserId}`)
      .then((res) => {
        setUser(res.data);
      })
      .catch((err) => {
        console.error("Không thể lấy thông tin người dùng", err);
        navigate("/");
      });
  }, [navigate, paramId]);

  if (!user) return <p>Đang tải dữ liệu...</p>;

  return (
    <>
      <Navbar user={user} />
      <ProfileHeader userId={user.id} />
      <div className={cx("container_friend_and_post")}>
        <div className={cx("container_friend_ and_ profile")}>
          <ListFriendsByID userId={user.id} />
        </div>
        <div className={cx("container_post")}>
          <PostList userId={user.id} />
        </div>
        
      </div>
    </>
  );
};

export default Profilepage;
