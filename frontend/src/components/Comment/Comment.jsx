/* eslint-disable react/prop-types */
import classNames from "classnames/bind";
import styles from "./Comment.module.scss";

const cx = classNames.bind(styles);

// eslint-disable-next-line react/prop-types
const Comment = ({ comment }) => {
    return (
        <div className={cx("comment")}>
            <img 
                src={comment.avatarUrl ? `http://localhost:8080/uploads/${comment.avatarUrl}` : "/assets/img/icons8-user-default-64.png"} 
                alt="Avatar" 
                className={cx("avatar")}
            />
            <div className={cx("comment-content")}>
                <strong>{comment.userName}</strong>
                <p>{comment.content}</p>
            </div>
        </div>
    );
};

export default Comment;
