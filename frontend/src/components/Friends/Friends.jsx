/* eslint-disable react/prop-types */
import { useState } from "react";
import PropTypes from "prop-types";
import classNames from "classnames/bind";
import styles from "./Friends.module.scss";
import ChatBox from "../ChatBox/Chatbox"; 
const cx = classNames.bind(styles);

const Friend = ({ friend, showMessageButton = true, onClick }) => { // Thêm prop showMessageButton để bật/tắt nút “Nhắn tin”
  const [isChatOpen, setIsChatOpen] = useState(false);

  return (
    <>
      <div className={cx("friend-card")}>
        <img
          src={friend.avatarUrl ? `http://localhost:8080/uploads/${friend.avatarUrl}` : "/assets/img/icons8-user-default-64.png"}
          alt={friend.fullName}
          className={cx("avatar")}
          onClick={() => onClick?.(friend)} // chú ý hàm này
          style={{ cursor: "pointer" }}
        />
        <div className={cx("friend-info")}>
          <p
            className={cx("friend-name")}
            onClick={() => onClick?.(friend)}
            style={{ cursor: "pointer" }}
          >
            {friend.fullName}
          </p>
          {showMessageButton && (
            <button className={cx("message-btn")} onClick={() => setIsChatOpen(true)}>Nhắn tin</button>
          )}
        </div>
      </div>
      {isChatOpen && <ChatBox friend={friend} onClose={() => setIsChatOpen(false)} />}
    </>
  );
};


Friend.propTypes = {
  friend: PropTypes.shape({
    avatarUrl: PropTypes.string,
    fullName: PropTypes.string.isRequired,
  }).isRequired,
};

export default Friend;
