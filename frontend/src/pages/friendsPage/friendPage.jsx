import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/navigation/Navigation";
import FriendRequestList from "../../components/friendRequestList/FriendRequestList";
const FriendPage = () => {
    // eslint-disable-next-line no-unused-vars
    const [user, setUser] = useState(null);
    const navigate = useNavigate();
  
    useEffect(() => {
      // Lấy dữ liệu người dùng từ sessionStorage
      const storedUser = sessionStorage.getItem("user");
  
      // if (storedUser) {
      //   setUser(JSON.parse(storedUser));
      // } else {
      //   navigate("/"); // Nếu chưa đăng nhập, quay lại trang Login
      // }
    }, [navigate]);
    return ( 
        <>
        {/* Navbar */}
        <Navbar user={user} />
        <FriendRequestList />
        </>
     );
}

export default FriendPage;
