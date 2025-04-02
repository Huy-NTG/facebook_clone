import { useEffect, useState } from "react";
import FriendRequest from "../friendRequest/FriendRequest";
import classNames from "classnames/bind";
import styles from "./FriendRequestList.module.scss";
const cx = classNames.bind(styles);
const FriendRequestList = () => {
  const [requests, setRequests] = useState([]);
  const user = JSON.parse(localStorage.getItem("user"));
  const userId = user?.id;

  useEffect(() => {
    if (!userId) return;
    fetch(`http://localhost:8080/api/friends/${userId}/pending-requests`)
      .then((res) => res.json())
      .then((data) => setRequests(data))
      .catch((error) => console.error("Lỗi khi lấy danh sách lời mời:", error));
  }, [userId]);

  const handleAccept = async (requestId) => {
    try {
      await fetch(`http://localhost:8080/api/friend-requests/${requestId}/accept`, {
        method: "POST",
      });
      setRequests(requests.filter((req) => req.id !== requestId));
    } catch (error) {
      console.error("Lỗi khi chấp nhận lời mời:", error);
    }
  };

  const handleReject = async (requestId) => {
    try {
      await fetch(`http://localhost:8080/api/friend-requests/${requestId}/reject`, {
        method: "POST",
      });
      setRequests(requests.filter((req) => req.id !== requestId));
    } catch (error) {
      console.error("Lỗi khi từ chối lời mời:", error);
    }
  };

  return (
    <div className={cx("friend-request-list")}>
      <h2>Lời mời kết bạn</h2>
      <div className={cx("friend-request-container")}>
      {requests.length > 0 ? (
        requests.map((req) => (
          <FriendRequest key={req.id} request={req} onAccept={handleAccept} onReject={handleReject} />
        ))
      ) : (
        <p>Không có lời mời kết bạn nào</p>
      )}
      </div>
    </div>
  );
};

export default FriendRequestList;
