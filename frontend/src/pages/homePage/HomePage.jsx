import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import classNames from "classnames/bind";
import styles from "./HomePage.module.scss";
import axios from "axios";
import Navbar from "../../components/navigation/Navigation";
import Postingfrom from "../../components/postingForm/PostingForm";
import PostList from "../../components/ContainerPost/ContainerPost";
import FriendList from "../../components/ListFriends/ListFriends";
import ChatContainer from "../../components/ChatContainer/ChatContainer";
const cx = classNames.bind(styles);

const HomePage = () => {
    const [user, setUser] = useState(null);
    const [loggedInUser, setLoggedInUser] = useState(null);
    const [activeChats, setActiveChats] = useState([]); // Quản lý trạng thái chat
    const navigate = useNavigate();
    const { id: paramId } = useParams(); // lấy id từ URL nếu có
    
    useEffect(() => {
        const storedUser = sessionStorage.getItem("user");
        if (!storedUser) {
            navigate("/");
            return;
        }
        const parsedUser = JSON.parse(storedUser);
        setLoggedInUser(parsedUser);
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

    // Hàm mở chat mới
    const openChat = (friend) => {
        // Kiểm tra xem chat với friend này đã tồn tại chưa
        if (!activeChats.find(chat => chat.id === friend.id)) {
            setActiveChats([...activeChats, friend]);
        }
    };

    // Hàm đóng chat
    const closeChat = (friend) => {
        setActiveChats(activeChats.filter(chat => chat.id !== friend.id));
    };

    if (!user || !loggedInUser) return <p>Đang tải dữ liệu...</p>;
  
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
                    <FriendList onOpenChat={openChat} />
                </div>
                
                {/* Container cho các chat box */}
                <ChatContainer 
                    activeChats={activeChats} 
                    closeChat={closeChat} 
                />
            </div>
        </>
    );
};

export default HomePage;