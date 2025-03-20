/* eslint-disable react/prop-types */
import { useState } from "react";
import classNames from "classnames/bind";
import styles from "./PostingForm.module.scss";
import { FaUserCircle } from "react-icons/fa"; // Import icon mặc định
import { FaVideo, FaImage, FaSmile } from "react-icons/fa"; // Import các icon
const cx = classNames.bind(styles);
import PostModal from "../postModal/PostModal";
// eslint-disable-next-line react/prop-types
const PostingForm = ({ user }) => {
    const [showForm, setShowForm] = useState(false); // Trạng thái hiển thị form
    return (
        <div className={cx("container-posting-form")}>
            <div className={cx("posting-form")}>
                <div className={cx("posting-form-left")}>
                    {user?.avatar ? (
                        <img
                            src={user.avatar}
                            alt="avatar"
                            onError={(e) => {
                                e.target.onerror = null;
                                e.target.style.display = "none";
                            }}
                        />
                    ) : (
                        <FaUserCircle className={cx("default-avatar")} size={40} />
                    )}
                </div>
                <div className={cx("posting-form-right")}>
                    <button className={cx("posting-btn")} onClick={() => setShowForm(true)}>Bạn ơi, bạn đang nghĩ gì thế?</button>
                </div>
            </div>
            <div className={cx("posting-form-footer")}>
                <button>
                    <FaVideo className={cx("icon")} size={20} style={{ marginRight: "5px", color: "red" }} />
                    Video trực tiếp
                </button>
                <button>
                    <FaImage size={20} className={cx("icon")} style={{ marginRight: "5px", color: "green" }} />
                    Ảnh/Video
                </button>
                <button>
                    <FaSmile size={20} className={cx("icon")} style={{ marginRight: "5px", color: "orange" }} />
                    Cảm xúc/Hoạt động
                </button>
            </div>
            {/* Hiển thị PostModal khi showForm === true */}
            {showForm && <PostModal user={user} onClose={() => setShowForm(false)} />}
        </div>
    );
};
export default PostingForm;