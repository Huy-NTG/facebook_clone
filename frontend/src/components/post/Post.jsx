/* eslint-disable react/prop-types */
import { useState } from "react";
import classNames from "classnames/bind";
import styles from "./Post.module.scss";
import CommentSection from "../CommentSection/CommentSection";
const cx = classNames.bind(styles);
// eslint-disable-next-line react/prop-types
const Post = ({ post }) => {
    const [likes, setLikes] = useState(0); // Số lượt thích
    const [isLiked, setIsLiked] = useState(false); // Trạng thái đã thích
    const [showComments, setShowComments] = useState(false); // Ẩn/hiện bình luận
    const handleLike = () => {
        setLikes(isLiked ? likes - 1 : likes + 1);
        setIsLiked(!isLiked);
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