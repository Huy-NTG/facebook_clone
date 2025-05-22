import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import axios from "axios";
import Navbar from "../../components/navigation/Navigation";
import FriendRequestList from "../../components/friendRequestList/FriendRequestList";
const FriendPage = () => {
    const [user, setUser] = useState(null);
  const [loggedInUser, setLoggedInUser] = useState(null); // ✅ thêm state
  const navigate = useNavigate();
  const { id: paramId } = useParams(); // lấy id từ URL nếu có
  useEffect(() => {
    const storedUser = sessionStorage.getItem("user");
    if (!storedUser) {
      navigate("/");
      return;
    }
    const parsedUser = JSON.parse(storedUser);
    setLoggedInUser(parsedUser); // ✅ lưu user đăng nhập vào state
    const targetUserId = paramId || parsedUser.id;
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
  if (!user || !loggedInUser) return <p>Đang tải dữ liệu...</p>;

    return ( 
        <>
        {/* Navbar */}
        <Navbar user={user} />
        <FriendRequestList />
        </>
     );
}

export default FriendPage;
