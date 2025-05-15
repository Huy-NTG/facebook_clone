import { useEffect, useState } from "react";
import Friend from "../Friends/Friends";
import classNames from "classnames/bind";
import styles from "./ListFriend.module.scss";

const cx = classNames.bind(styles);

const FriendList = () => {
  const [friends, setFriends] = useState([]);
  
  // Lấy user từ sessionStorage
  const user = JSON.parse(sessionStorage.getItem("user"));
  const userId = user?.id;

  useEffect(() => {
    if (!userId) {
      console.error("Không tìm thấy userId trong sessionStorage");
      return;
    }
  
    fetch(`http://localhost:8080/api/friends/${userId}`)
      .then((response) => response.json())
      .then((data) => setFriends(data))
      .catch((error) => console.error("Lỗi khi tải danh sách bạn bè:", error));
  }, [userId]);

  return (
    <div className={cx("friend-list")}>
      <h2>Người liên hệ</h2>
      {friends.length > 0 ? (
        friends.map((friend) => <Friend key={friend.id} friend={friend} />)
      ) : (
        <p>Chưa có bạn bè nào</p>
      )}
    </div>
  );
};

export default FriendList;