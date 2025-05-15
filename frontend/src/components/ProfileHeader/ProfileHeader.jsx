  /* eslint-disable react/prop-types */
  /* eslint-disable no-unused-vars */
  import classNames from "classnames/bind";
  import styles from './ProfileHeader.module.scss';
  import { useEffect, useState } from "react";
  import { useNavigate } from "react-router-dom";
  import axios from "axios";

  const cx = classNames.bind(styles);

  const ProfileHeader = ({ userId }) => {
    const [user, setUser] = useState(null);
    const [currentUserId, setCurrentUserId] = useState(null); // <- Thêm biến này
    const navigate = useNavigate();
    const [friendRequestStatus, setFriendRequestStatus] = useState(null);

    const handleSendFriendRequest = async () => {
      try {
        await axios.post(`http://localhost:8080/api/friends/request`, null, {
          params: {
            senderId: currentUserId,
            receiverId: userId
          }
        });
        setFriendRequestStatus("SENT");
      } catch (error) {
        console.error("Lỗi gửi lời mời kết bạn:", error);
        setFriendRequestStatus("error");
      }
    };
    
    useEffect(() => {
      if (!userId) return;

      const storedUser = sessionStorage.getItem("user");
      if (storedUser) {
        const parsedUser = JSON.parse(storedUser);
        setCurrentUserId(parsedUser.id);

        axios
          .get(`http://localhost:8080/api/friends/status`, {
            params: {
              currentUserId: parsedUser.id,
              profileUserId: userId
            }
          })
          .then(res => setFriendRequestStatus(res.data))
          .catch(err => {
            console.error("Không thể lấy trạng thái kết bạn", err);
            setFriendRequestStatus("NONE");
          });
      }

      axios
        .get(`http://localhost:8080/auth/${userId}`)
        .then((res) => setUser(res.data))
        .catch((err) => {
          console.error("Không thể lấy thông tin người dùng", err);
          navigate("/");
        });
    }, [userId, navigate]);


    if (!user) return <p>Đang tải thông tin...</p>;

    return (
      <div className={cx("profile-header")}>
        <div className={cx("header-container")}>
            <img 
              src={`http://localhost:8080/uploads/${user.avatarUrl}`} 
              alt="avatar" 
              className={cx("avatar")}
            />
            <div className={cx("user-info")}>
              <h2 className={cx("username")}>{user.username}</h2>
              {user.bio && <p className={cx("bio")}>{user.bio}</p>}
            </div>
        </div>

        {/* ✅ Chỉ hiển thị nếu là người dùng hiện tại */}
        {currentUserId !== userId && (
          <div className={cx("change_profile_btn")}>
            {friendRequestStatus === "FRIENDS" && (
              <button className={cx("btn", "friends")} disabled>Đã là bạn bè</button>
            )}
            {friendRequestStatus === "SENT" && (
              <button className={cx("btn", "sent")} disabled>Đã gửi lời mời</button>
            )}
            {friendRequestStatus === "PENDING" && (
              <>
                <button className={cx("btn", "accept")}>Xác nhận</button>
                <button className={cx("btn", "reject")}>Từ chối</button>
              </>
            )}
            {friendRequestStatus === "NONE" && (
              <button onClick={handleSendFriendRequest} className={cx("btn")}>
                Thêm bạn bè
              </button>
            )}
            
          </div>
        )}
        {/* ✅ Chỉ hiển thị nếu là người dùng hiện tại */}
        {currentUserId === userId && (
          <div className={cx("change_profile_btn")}>
            <button className={cx("btn")}>Chỉnh sửa hồ sơ</button>
          </div>
        )}
      </div>
    );
  };

  export default ProfileHeader;