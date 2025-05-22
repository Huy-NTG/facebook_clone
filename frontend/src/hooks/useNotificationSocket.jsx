/* eslint-disable no-unused-vars */
/* eslint-disable no-dupe-keys */
import { useEffect, useRef } from "react";
import { Client } from "@stomp/stompjs";
import { toast } from "react-toastify";

import { useNavigate } from "react-router-dom";
/**
 * Connects to ws://localhost:8080/ws and listens on /user/queue/notifications
 */
export default function useNotificationSocket(userId) {
  const clientRef = useRef(null);
  const navigate = useNavigate();
  useEffect(() => {
    if (!userId) return;                        // chưa đăng nhập → bỏ qua

    /* -------- 1. Tạo STOMP‑over‑WebSocket client ---------- */
    const client = new Client({
      //brokerURL: "ws://localhost:8080/ws",      // ✅ WebSocket thuần
      brokerURL: `ws://localhost:8080/ws?userId=${userId}`,
      reconnectDelay: 5_000,
      debug: s => console.log("[NOTI]", s),

      onConnect: () => {
        console.log("🔔 Notification‑socket connected");

        // 2. subscribe kênh cá nhân (Spring đã cấu hình setUserDestinationPrefix("/user"))
        client.subscribe("/user/queue/notifications", msg => {
          const noti = JSON.parse(msg.body);    // NotificationDTO
          console.log("🔔 got noti:", noti);

          // toast.info(noti.content, {
          //   position: "bottom-right",
          //   autoClose: 5_000,
          // });
            toast.info(
              <div style={{ display: "flex", alignItems: "center", cursor: "pointer", }}
              onClick={() => navigate(`/post/${noti.postId}`)}
              >
                <img
                  src={`http://localhost:8080/uploads/${noti.postImageUrl}`}
                  alt="post"
                  style={{ width: 50, height: 50, borderRadius: 8, marginRight: 8, objectFit: "cover" }}
                />
                <span>{noti.content}</span>
              </div>,
              {
                position: "bottom-right",
                autoClose: 5000,
              }
            );
        });
      }
    });

    client.activate();
    clientRef.current = client;

    /* -------- 3. cleanup khi unmount / userId đổi --------- */
    return () => {
      if (clientRef.current?.active) clientRef.current.deactivate();
    };
  }, [userId, navigate]);
}
