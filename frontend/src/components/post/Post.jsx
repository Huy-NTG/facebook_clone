/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import axios from "axios"; // Import axios
import classNames from "classnames/bind";
import { useNavigate } from "react-router-dom";
import ThumbUpOffAltIcon from '@mui/icons-material/ThumbUpOffAlt';
import CommentOutlinedIcon from '@mui/icons-material/CommentOutlined';
import ShareOutlinedIcon from '@mui/icons-material/ShareOutlined';
import styles from "./Post.module.scss";
import CommentSection from "../CommentSection/CommentSection";

import useNotificationSocket from "../../hooks/useNotificationSocket";   // 🔥 new

const cx = classNames.bind(styles);
const user = JSON.parse(sessionStorage.getItem("user"));
const userId = user?.id;

const Post = ({ post }) => {
    const navigate = useNavigate();
    const [likes, setLikes] = useState(0); // Số lượt thích
    const [isLiked, setIsLiked] = useState(false); // Trạng thái đã thích
    const [comments, setComments] = useState(0); // Số lượt bình luận
    const [showComments, setShowComments] = useState(false); // Ẩn/hiện bình luận

    // Fetch like and comment counts
    const fetchInteractionData = async () => {
        try {
            const [likeResponse, commentResponse] = await Promise.all([
                axios.get(`http://localhost:8080/api/likes/count?postId=${post.id}`),
                axios.get(`http://localhost:8080/api/comments/${post.id}`),
            ]);

            setLikes(likeResponse.data.count || 0);
            setComments(
                Array.isArray(commentResponse.data)
                    ? commentResponse.data.length
                    : commentResponse.data.count || commentResponse.data.comment_count || 0
            );
        } catch (err) {
            console.error('Error fetching interaction data:', err);
            setLikes(0);
            setComments(0);
        }
    };

    // Check if the user has liked the post
    const checkIsLiked = async () => {
        if (!userId) return;
        try {
            const res = await axios.get(`http://localhost:8080/api/likes/isLiked?postId=${post.id}&userId=${userId}`);
            setIsLiked(res.data); // true hoặc false
        } catch (error) {
            console.error("Lỗi khi kiểm tra trạng thái đã thích:", error);
        }
    };

    useEffect(() => {
        fetchInteractionData();
        checkIsLiked();
    }, [post.id, userId]);

    /* -------------------------------- like handler -------------------------------- */
        const handleLike = async () => {
            if (!userId) return alert("Bạn cần đăng nhập để thích.");

            /** 🔥 optimistic update */
            setIsLiked(cur => !cur);
            setLikes(c => (isLiked ? c - 1 : c + 1));

            try {
            const res = await fetch(
                `http://localhost:8080/api/likes/toggle?postId=${post.id}&userId=${userId}`,
                { method: "POST" }
            );
            if (!res.ok) throw new Error("Toggle like failed");
            } catch (e) {
            console.error("Lỗi like:", e);
            /** rollback khi lỗi */
            setIsLiked(cur => !cur);
            setLikes(c => (isLiked ? c + 1 : c - 1));
            }
        };

        /* ------------- hook thông báo realtime (đặt ở App cũng được) ---------------- */
        useNotificationSocket(userId);   // 🔥 chỉ 1 dòng, tự subscribe /queue/notifications


    const handleLike = async () => {
        if (!userId) {
            alert("Bạn cần đăng nhập để thích bài viết.");
            return;
        }
        try {
            await axios.post(`http://localhost:8080/api/likes/toggle?postId=${post.id}&userId=${userId}`);
            // Refresh like count and liked status
            await fetchInteractionData();
            await checkIsLiked();
        } catch (error) {
            console.error("Lỗi khi gửi yêu cầu thích bài viết:", error);
        }
    };


    return (
        <div className={cx("post")}>
            {/* Hiển thị ảnh đại diện và tên người dùng */}
            <div className={cx("post-header")}>
                <img 
                    src={post.avatarUrl ? `http://localhost:8080/uploads/${post.avatarUrl}` : "/assets/img/icons8-user-default-64.png"}
                    alt="Avatar"
                    className={cx("avatar")}
                    onError={(e) => e.target.src = "/assets/img/icons8-user-default-64.png"} // Ảnh mặc định nếu lỗi
                    onClick={() => navigate(`/profile/${post.userId}`)}
                    style={{ cursor: "pointer" }}
                />
                <div className={cx("post-info-container")}>
                    <p><strong>{post.fullName}</strong></p>
                    {/* Hiển thị thời gian đăng */}
                    <p className={cx("time")}>Đăng lúc: {new Date(post.createdAt).toLocaleString()}</p>
                </div>
            </div>
            {/* Nội dung bài viết */}
            <p>{post.content}</p>
            {/* Hiển thị hình ảnh bài viết nếu có */}
            {post.imageUrl && (
                <img 
                    src={`http://localhost:8080/uploads/${post.imageUrl}`}
                    alt="Post" 
                    className={cx("post-image")}
                />
            )}
            {/* 🔥 Thanh hiển thị số lượt thích và bình luận */}
            <div className={cx("like-count")}>
                <span>{likes} lượt thích</span>
                <span className={cx("comment-count")} onClick={() => setShowComments(!showComments)}>
                    {comments} bình luận
                </span>
            </div>
            {/* 🛠 Các nút tương tác */}
            <div className={cx("post-actions")}>
                <button className={cx("btn", { liked: isLiked })} onClick={handleLike}>
                    <ThumbUpOffAltIcon /> {isLiked ? "Đã thích" : "Thích"}
                </button>
                <button className={cx("btn")} onClick={() => setShowComments(!showComments)}>
                    <CommentOutlinedIcon /> Bình luận
                </button>
                <button className={cx("btn")}>
                    <ShareOutlinedIcon /> Chia sẻ
                </button>
            </div>
            {showComments && (
                <CommentSection
                    postId={post.id}
                    onClose={() => setShowComments(false)}
                    onCommentAdded={fetchInteractionData} // Refresh counts after new comment
                />
            )}
        </div>
    );
};

export default Post;