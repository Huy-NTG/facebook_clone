/* eslint-disable react/prop-types */
// eslint-disable-next-line no-unused-vars
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import classNames from "classnames/bind";
import styles from "./PostingForm.module.scss";
import { FaUserCircle } from "react-icons/fa"; // Import icon mặc định
import { FaVideo, FaImage, FaSmile } from "react-icons/fa"; // Import các icon
const cx = classNames.bind(styles);
import PostModal from "../postModal/PostModal";
// eslint-disable-next-line react/prop-types
const PostingForm = ({ user, variant = "home" }) => {
    const [showForm, setShowForm] = useState(false); // Trạng thái hiển thị form
    const navigate = useNavigate();
    
    const [currentUser, setCurrentUser] = useState(null);

    useEffect(() => {
        const storedUser = sessionStorage.getItem("user");
        if (storedUser) {
            setCurrentUser(JSON.parse(storedUser));
        }
    }, []);
    return (
        <div className={cx("container-posting-form", variant)}>
            <div className={cx("posting-form")}>
                <div className={cx("posting-form-left")}>
                    {currentUser?.avatarUrl ? (
                        <img
                            src={`http://localhost:8080/uploads/${currentUser.avatarUrl}`} // API backend
                            alt="avatar"
                            className={cx("avatar")}
                            onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = "/assets/img/icons8-user-default-64.png"; // Ảnh mặc định
                            }}
                            onClick={() => navigate(`/profile/${currentUser.id}`)}
                            style={{ cursor: "pointer" }}
                        />
                    ) : (
                        <FaUserCircle className={cx("default-avatar")} size={40} />
                    )}
                </div>
                <div className={cx("posting-form-right")}>
                    <button className={cx("posting-btn")} onClick={() => setShowForm(true)}>Bạn ơi, bạn đang nghĩ gì thế?</button>
                </div>
            </div>
            <hr />
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