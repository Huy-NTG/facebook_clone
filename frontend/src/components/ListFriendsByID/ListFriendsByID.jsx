/* eslint-disable react/prop-types */
import classNames from "classnames/bind";
import styles from './ListFriendsByID.module.scss';
import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
const cx = classNames.bind(styles);

const ListFriendsByID = ({ userId }) => {
  const [friends, setFriends] = useState([]);
  const navigate = useNavigate(); // <- THÊM DÒNG NÀY
  useEffect(() => {
    axios
      .get(`http://localhost:8080/api/friends/${userId}`)
      .then((res) => {
        setFriends(res.data);
      })
      .catch((err) => {
        console.error("Không thể lấy danh sách bạn bè", err);
      });
  }, [userId]);
  const handleClickFriend = (friendId) => {
    navigate(`/profile/${friendId}`);
  };

  return (
    <div className={cx("friend-list-container")}>
      <h3 className={cx("title")}>Danh sách bạn bè</h3>
      <div className={cx("friend-list")}>
        {friends.map((friend) => (
          <div 
            key={friend.id} 
            className={cx("friend-item")}
            onClick={() => handleClickFriend(friend.id)} // <- BẮT SỰ KIỆN CLICK
        >
            <img
              src={`http://localhost:8080/uploads/${friend.avatarUrl}`}
              alt={friend.username}
              className={cx("avatar")}
            />
            <p className={cx("username")}>{friend.username}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ListFriendsByID;
