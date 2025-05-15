import { useState, useEffect } from "react";
import axios from "axios";
import classNames from "classnames/bind";
import styles from "./CommentSection.module.scss";
import Comment from "../Comment/Comment";

const cx = classNames.bind(styles);

// eslint-disable-next-line react/prop-types
const CommentSection = ({ postId, onClose }) => {
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState("");
    // 🟢 Lấy dữ liệu user từ sessionStorage
    const user = JSON.parse(sessionStorage.getItem("user"));
    useEffect(() => {
        axios.get(`http://localhost:8080/api/comments/${postId}`)
            .then(response => setComments(response.data))
            .catch(error => console.error("Lỗi:", error));
    }, [postId]);

    const handleAddComment = () => {
        if (!newComment.trim()) return; // Ngăn gửi bình luận rỗng
        if (!user) {
            console.error("Người dùng chưa đăng nhập!");
            return;
        }

        axios.post("http://localhost:8080/api/comments/add", {
            postId,
            userId: user.id, // ✅ Lấy userId từ sessionStorage
            content: newComment
        })        
        .then(response => {
            setComments([...comments, response.data]);
            setNewComment("");
        })
        .catch(error => console.error("Lỗi gửi bình luận:", error));
    };

    return (
        <div className={cx("modal-overlay")}>
            <div className={cx("modal")}>
                <button className={cx("close-btn")} onClick={onClose}>✖</button>
                <div className={cx("title-comment-section")}>
                    <h3>Bình luận</h3>
                </div>
                <div className={cx("comments-list")}>
                    {comments.length === 0 ? (
                        <p>Chưa có bình luận nào</p>
                    ) : (
                        comments.map(comment => (
                            <Comment key={comment.id} comment={comment} />
                        ))
                    )}
                </div>
                <div className={cx("comment-input")}>
                    <input
                        type="text"
                        placeholder="Viết bình luận..."
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                    />
                    <button onClick={handleAddComment}>Gửi</button>
                </div>
            </div>
        </div>
    );
};

export default CommentSection;
