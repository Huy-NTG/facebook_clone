/* eslint-disable react/prop-types */
import { useState } from "react";
import classNames from "classnames/bind";
import styles from "./FriendRequest.module.scss";

const cx = classNames.bind(styles);

const FriendRequest = ({ request, onAccept, onReject }) => {
  const [loading, setLoading] = useState(false);

  const handleAccept = async () => {
    setLoading(true);
    await onAccept(request.id);
    setLoading(false);
  };

  const handleReject = async () => {
    setLoading(true);
    await onReject(request.id);
    setLoading(false);
  };

  return (
    <div className={cx("friend-request")}>
      <img 
        src={request.avatarUrl ? `http://localhost:8080/uploads/${request.avatarUrl}` : "/assets/img/icons8-user-default-64.png"} 
        alt="Avatar" 
        className={cx("avatar")} 
      />
      <div className={cx("request-info")}>
        <p>{request.fullName}</p>
        <div className={cx("request-actions")}>
          <button onClick={handleAccept} disabled={loading} className={cx("accept-btn")}>
             Xác nhận
          </button>
          <button onClick={handleReject} disabled={loading} className={cx("reject-btn")}>
             Xóa
          </button>
        </div>
      </div>
    </div>
  );
};

export default FriendRequest;
