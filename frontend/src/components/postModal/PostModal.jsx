/* eslint-disable react/prop-types */
import classNames from "classnames/bind";
import styles from "./PostModal.module.scss";
import { FaUserCircle, FaTimes } from "react-icons/fa"; // Import các icon
import { FaImage, FaUserFriends, FaSmile, FaMapMarkerAlt, FaGift, FaVideo } from "react-icons/fa";
import { useState, useRef } from "react";
const cx = classNames.bind(styles);
// eslint-disable-next-line react/prop-types
const PostModal = ({ user, onClose }) => {
    const [postContent, setPostContent] = useState(""); // Theo dõi nội dung bài viết
    const [image, setImage] = useState(null);
    const [showImageUpload, setShowImageUpload] = useState(false);
    const [loading, setLoading] = useState(false); // Trạng thái gửi bài viết
    const fileInputRef = useRef(null); // Tạo tham chiếu đến input file
    const handleChange = (e) => {
        setPostContent(e.target.value);
    };
    const handleImageChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            const imageUrl = URL.createObjectURL(file);
            setImage(imageUrl);
            setShowImageUpload(true);
        }
    };
    // 🛠 Gửi bài viết lên backend
    const handlePostSubmit = async () => {
        if (!postContent.trim() && !image) return;
        setLoading(true);
        try {
            // Lấy thông tin người dùng từ sessionStorage
            const storedUser = JSON.parse(sessionStorage.getItem("user"));
            const userId = storedUser?.id || 1; // Lấy ID từ user, nếu không có thì mặc định là 1
    
            const formData = new FormData();
            formData.append("userId", userId);
            formData.append("content", postContent);
            if (fileInputRef.current?.files[0]) {
                formData.append("image", fileInputRef.current.files[0]); 
            }
    
            const response = await fetch("http://localhost:8080/api/posts/create", {
                method: "POST",
                body: formData,
            });
    
            const result = await response.json();
            if (response.ok) {
                alert(result.message);
                setPostContent("");
                setImage(null);
                setShowImageUpload(false);
                fileInputRef.current.value = "";
                onClose();
            } else {
                alert(result.error);
            }
        } catch (error) {
            console.error("Lỗi khi gửi bài viết:", error);
        } finally {
            setLoading(false);
        }
    };    
    return (
        <div className={cx("overlay")}>
            <div className={cx("post-modal")}>
                <div className={cx("post-modal-title-header")}>
                    <h3>Tạo bài viết</h3>
                    <button onClick={onClose} className={cx("cancel-btn")}><FaTimes size={24} onClick={onClose} style={{ cursor: "pointer" }} /></button>
                </div>
                <div className={cx("post-modal-body")}>
                    <form action="">
                    <div className={cx("modal-user-info")}>
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
                        <span className={cx("user-name")}>{user?.username || "Người dùng"}</span>
                    </div>
                    <textarea 
                        placeholder="Bạn ơi, bạn đang nghĩ gì?"
                        value={postContent}
                        onChange={handleChange}
                        className={cx("post-textarea")} />
                        {/* Hiển thị vùng chọn ảnh dưới textarea */}
                        {/* Vùng chọn ảnh */}
                    {showImageUpload && (
                        <div className={cx("image-upload-area")}>
                             {/* Nút đóng phân vùng ảnh */}
                             <div className={cx("close-btn")} onClick={() => setShowImageUpload(false)}>
                                <FaTimes size={20} style={{ color: "red", cursor: "pointer" }} />
                            </div>
                            {image ? (
                                <img src={image} alt="preview" className={cx("image-preview")} />                          
                            ) : (
                                <button
                                    type="button"
                                    onClick={() => fileInputRef.current.click()} // Kích hoạt input file khi nhấn
                                    className={cx("upload-btn")}
                                >
                                    <FaImage size={20} style={{ color: "green", marginRight: "5px" }} />
                                    Thêm ảnh hoặc kéo thả
                                </button>
                            )}
                            <input
                                ref={fileInputRef} // Gán ref vào input
                                type="file"
                                accept="image/*"
                                onChange={handleImageChange}
                                style={{ display: "none" }} // Ẩn input file
                            />
                        </div>
                    )}
                    <div className={cx("post-options")}>
                        <h4>Thêm vào bài viết của bạn</h4>
                                <div className={cx("option-buttons-group")}>
                                    <button 
                                        type="button" 
                                        className={cx("image-upload-btn")} 
                                        onClick={() => setShowImageUpload(true)}
                                    >
                                        <FaImage size={20} style={{ color: "green", marginRight: "5px" }} />
                                    </button>
                                    <button>
                                        <FaUserFriends size={20} style={{ color: "blue", marginRight: "5px" }} />
                                    </button>
                                    <button>
                                        <FaSmile size={20} style={{ color: "orange", marginRight: "5px" }} />
                                    </button>
                                    <button>
                                        <FaMapMarkerAlt size={20} style={{ color: "red", marginRight: "5px" }} />
                                    </button>
                                    <button>
                                        <FaGift size={20} style={{ color: "purple", marginRight: "5px" }} />
                                    </button>
                                    <button>
                                        <FaVideo size={20} style={{ color: "red", marginRight: "5px" }} />
                                    </button>
                            </div>
                        </div>
                    </form>
                </div>
                <div className={cx("post-actions")}>
                {/* // Chỉ bật khi có nội dung hợp lệ */}
                <button 
                    className={cx("submit-btn")}  
                    disabled={(!postContent.trim() && !image) || loading} 
                    onClick={handlePostSubmit}
                >
                    {loading ? "Đang đăng..." : "Đăng"}
                </button>  
                </div>
            </div>
        </div>
    );
};
export default PostModal;