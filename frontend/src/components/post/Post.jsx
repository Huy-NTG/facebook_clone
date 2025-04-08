/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import classNames from "classnames/bind";
import styles from "./Post.module.scss";
import CommentSection from "../CommentSection/CommentSection";
const cx = classNames.bind(styles);
// eslint-disable-next-line react/prop-types
const user = JSON.parse(localStorage.getItem("user"));
const userId = user?.id;

const Post = ({ post }) => {
    const [likes, setLikes] = useState(0); // Số lượt thích
    const [isLiked, setIsLiked] = useState(false); // Trạng thái đã thích
    const [showComments, setShowComments] = useState(false); // Ẩn/hiện bình luận
    // 👉 Tách ra bên ngoài useEffect, nhưng vẫn nằm trong component Post
    //code đã chỉnh sửa để tranh lỗi liên quan đến việc cập nhật số lượt thích và trạng thái like
    const fetchLikeCount = async () => {
        try {
            const res = await fetch(`http://localhost:8080/api/likes/count?postId=${post.id}`);
            const data = await res.json();
            setLikes(data.count);
        } catch (error) {
            console.error("Lỗi khi lấy số lượt thích:", error);
        }
    };

    const checkIsLiked = async () => {
        if (!userId) return;
        try {
            const res = await fetch(`http://localhost:8080/api/likes/isLiked?postId=${post.id}&userId=${userId}`);
            const data = await res.json();
            setIsLiked(data); // true hoặc false
        } catch (error) {
            console.error("Lỗi khi kiểm tra trạng thái đã thích:", error);
        }
    };
    useEffect(() => {
        fetchLikeCount();
        checkIsLiked();
    }, [post.id, userId]);
    const handleLike = async () => {
    if (!userId) {
        alert("Bạn cần đăng nhập để thích bài viết.");
        return;
    }
    try {
        await fetch(`http://localhost:8080/api/likes/toggle?postId=${post.id}&userId=${userId}`, {
            method: "POST",
        });

        // Gọi lại để cập nhật số lượt thích và trạng thái like
        await fetchLikeCount();
        await checkIsLiked();
        } catch (error) {
            console.error("Lỗi khi gửi yêu cầu thích bài viết:", error);
        }
    };

    // code gốc bị lỗi related đến việc cập nhật số lượt thích và trạng thái like
    // const handleLike = async () => {
    //     if (!userId) {
    //         alert("Bạn cần đăng nhập để thích bài viết.");
    //         return;
    //     }
    //     try {
    //         const res = await fetch(`http://localhost:8080/api/likes/toggle?postId=${post.id}&userId=${userId}`, {
    //             method: "POST",
    //         });
    //         const data = await res.json();
    //         if (data.message === "liked") {
    //             setLikes((prev) => prev + 1);
    //             setIsLiked(true);
    //         } else if (data.message === "unliked") {
    //             setLikes((prev) => Math.max(0, prev - 1));
    //             setIsLiked(false);
    //         }
    //     } catch (error) {
    //         console.error("Lỗi khi gửi yêu cầu thích bài viết:", error);
    //     }
    // };
    // Lấy số lượt thích từ server khi component được mount    
    // useEffect(() => {
    //     const fetchLikeCount = async () => {
    //         try {
    //             const res = await fetch(`http://localhost:8080/api/likes/count?postId=${post.id}`);
    //             const data = await res.json();
    //             setLikes(data.count);
    //         } catch (error) {
    //             console.error("Lỗi khi lấy số lượt thích:", error);
    //         }
    //     };
    //     fetchLikeCount();
    // }, [post.id]);
    // Kiểm tra xem người dùng đã thích bài viết hay chưa
    // useEffect(() => {
    //     const checkIsLiked = async () => {
    //         if (!userId) return;
    //         try {
    //             const res = await fetch(`http://localhost:8080/api/likes/isLiked?postId=${post.id}&userId=${userId}`);
    //             const data = await res.json();
    //             setIsLiked(data); // true hoặc false
    //         } catch (error) {
    //             console.error("Lỗi khi kiểm tra trạng thái đã thích:", error);
    //         }
    //     };
    //     checkIsLiked();
    // }, [post.id, userId]);

    return (
        <div className={cx("post")}>
            {/* Hiển thị ảnh đại diện và tên người dùng */}
            <div className={cx("post-header")}>
                <img 
                    src={post.avatarUrl ? `http://localhost:8080/uploads/${post.avatarUrl}` : "/assets/img/icons8-user-default-64.png"}
                    alt="Avatar"
                    className={cx("avatar")}
                    onError={(e) => e.target.src = "/assets/img/icons8-user-default-64.png"} // Ảnh mặc định nếu lỗi
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
            {/* 🔥 Thanh hiển thị số lượt thích */}
            <div className={cx("like-count")}>
                {likes} lượt thích
            </div>
            {/* 🛠 Các nút tương tác */}
            <div className={cx("post-actions")}>
                <button className={cx("btn", { liked: isLiked })} onClick={handleLike}>
                    👍 {isLiked ? "Đã thích" : "Thích"}
                </button>
                <button className={cx("btn")} onClick={() => setShowComments(!showComments)}>
                    💬 Bình luận
                </button>
                <button className={cx("btn")}>🔗 Chia sẻ</button>
            </div>
            {showComments && <CommentSection  postId={post.id} onClose={() => setShowComments(false)} />}
        </div>
    );
};
export default Post;