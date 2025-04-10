import { useState, useEffect } from 'react';
import styles from './profile.module.css';
import axios from 'axios';

function Profile() {
    const [profile, setProfile] = useState({
        fullName: '',
        bio: '',
        location: '',
        birthday: '',
        profilePicture: ''
    });
    const [isEditing, setIsEditing] = useState(false);
    const [activeSection, setActiveSection] = useState('info'); // 'info', 'bio', 'photo'
    const [selectedImage, setSelectedImage] = useState(null);
    const [editSections, setEditSections] = useState({
        avatar: false,
        bio: false,
        info: false
    });
    const [bioText, setBioText] = useState('Mô tả bản thân...');
    const [isEditingBio, setIsEditingBio] = useState(false);

    // Lấy thông tin profile từ backend
    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const userId = localStorage.getItem('userId');
                const response = await axios.get(`http://localhost:8080/api/users/${userId}`);
                setProfile(response.data);
            } catch (error) {
                console.error('Lỗi khi lấy thông tin profile:', error);
            }
        };
        fetchProfile();
    }, []);

    // Các hàm xử lý riêng cho từng phần
    const handleUpdatePhoto = async (e) => {
        e.preventDefault();
        try {
            const userId = localStorage.getItem('userId');
            const formData = new FormData();
            if (selectedImage) {
                formData.append('profilePicture', selectedImage);
                await axios.put(`http://localhost:8080/api/users/${userId}/photo`, formData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
                setIsEditing(false);
            }
        } catch (error) {
            console.error('Lỗi khi cập nhật ảnh:', error);
        }
    };

    const handleUpdateBio = async (e) => {
        e.preventDefault();
        try {
            const userId = localStorage.getItem('userId');
            await axios.put(`http://localhost:8080/api/users/${userId}/bio`, {
                bio: profile.bio
            });
            setIsEditing(false);
        } catch (error) {
            console.error('Lỗi khi cập nhật tiểu sử:', error);
        }
    };

    const handleUpdateInfo = async (e) => {
        e.preventDefault();
        try {
            const userId = localStorage.getItem('userId');
            await axios.put(`http://localhost:8080/api/users/${userId}/info`, {
                fullName: profile.fullName,
                location: profile.location,
                birthday: profile.birthday
            });
            setIsEditing(false);
        } catch (error) {
            console.error('Lỗi khi cập nhật thông tin:', error);
        }
    };

    return (
        <div className={styles.profileContainer}>
            <div className={styles.profileHeader}>
                {/* Phần ảnh đại diện */}
                <div className={styles.profilePictureContainer}>
                    <img
                        className={styles.profilePicture}
                        src={profile.profilePicture || "./src/assets/image/profile.png"}
                        alt="Profile"
                    />
                </div>

                <div className={styles.profileInfo}>
                    {/* Phần tiểu sử */}
                    <div className={styles.bioSection}>
                        <h2>{profile.fullName}</h2>
                        <p>{profile.bio}</p>
                    </div>

                    {/* Phần thông tin cá nhân */}
                    <div className={styles.infoSection}>
                        <p>Địa chỉ: {profile.location}</p>
                        <p>Ngày sinh: {profile.birthday}</p>
                    </div>

                    {/* Nút chỉnh sửa chính */}
                    <button 
                        className={styles.mainEditButton}
                        onClick={() => setIsEditing(true)}
                    >
                        Chỉnh sửa trang cá nhân
                    </button>
                </div>
            </div>

            {/* Overlay chính */}
            {isEditing && (
                <div className={styles.overlay}>
                    <div className={styles.editDialog}>
                        <div className={styles.dialogHeader}>
                            <h2>Chỉnh sửa trang cá nhân</h2>
                            <button 
                                className={styles.closeButton}
                                onClick={() => setIsEditing(false)}
                            >
                                &#x2715;
                            </button>
                        </div>
                        
                        <div className={styles.dialogContent}>
                            {/* Tiểu sử */}
                            <div className={styles.editSection}>
                                <div className={styles.sectionHeader}>
                                    <h3>Tiểu sử</h3>
                                    {!isEditingBio ? (
                                        <button 
                                            className={styles.editSectionButton}
                                            onClick={() => setIsEditingBio(true)}
                                        >
                                            Thêm
                                        </button>
                                    ) : (
                                        <button 
                                            className={styles.bioCloseButton}
                                            onClick={() => setIsEditingBio(false)}
                                        >
                                            Hủy
                                        </button>
                                    )}
                                </div>
                                
                                {!isEditingBio ? (
                                    <div className={styles.bioContent}>
                                        <p>{profile.bio || "Mô tả về bạn"}</p>
                                    </div>
                                ) : (
                                    <div className={styles.bioEditContainer}>
                                        <form onSubmit={handleUpdateBio} className={styles.bioEditForm}>
                                            <textarea
                                                className={styles.bioTextarea}
                                                value={profile.bio}
                                                onChange={(e) => setProfile({...profile, bio: e.target.value})}
                                                placeholder="Mô tả về bạn"
                                                maxLength={101}
                                            />
                                            <div className={styles.bioFooter}>
                                                <div className={styles.bioCharCount}>
                                                    Còn {101 - (profile.bio?.length || 0)} ký tự
                                                </div>
                                                <div className={styles.bioControls}>
                                                    <div className={styles.bioVisibility}>
                                                        <img src="./src/assets/icons/public.png" alt="public" />
                                                        <span>Công khai</span>
                                                    </div>
                                                    <div className={styles.bioButtons}>
                                                        <button type="submit" className={styles.bioSaveButton}>
                                                            Lưu
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </form>
                                    </div>
                                )}
                            </div>

                            {/* Ảnh đại diện */}
                            <div className={styles.editSection}>
                                <div className={styles.sectionHeader}>
                                    <h3>Ảnh đại diện</h3>
                                    <button 
                                        className={styles.editSectionButton}
                                        onClick={() => setEditSections({...editSections, avatar: true})}
                                    >
                                        Chỉnh sửa
                                    </button>
                                </div>
                                <div className={styles.avatarPreview}>
                                    <img
                                        src={profile.profilePicture || "./src/assets/image/profile.png"}
                                        alt="Avatar"
                                    />
                                </div>
                            </div>

                            {/* Phần giới thiệu */}
                            <div className={styles.editSection}>
                                <div className={styles.sectionHeader}>
                                    <h3>Chỉnh sửa phần giới thiệu</h3>
                                    <button 
                                        className={styles.editSectionButton}
                                        onClick={() => setEditSections({...editSections, info: true})}
                                    >
                                        Chỉnh sửa
                                    </button>
                                </div>
                                <div className={styles.infoContent}>
                                    <div className={styles.infoItem}>
                                        <p>Tên: <strong>{profile.fullName}</strong></p>
                                    </div>
                                    <div className={styles.infoItem}>
                                        <p>Địa chỉ: <strong>{profile.location}</strong></p>
                                    </div>
                                    <div className={styles.infoItem}>
                                        <p>Ngày sinh: <strong>{profile.birthday}</strong></p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Overlay chỉnh sửa ảnh đại diện */}
            {editSections.avatar && (
                <div className={styles.overlay}>
                    <div className={styles.editDialog}>
                        <div className={styles.dialogHeader}>
                            <h2>Cập nhật ảnh đại diện</h2>
                            <button 
                                className={styles.closeButton}
                                onClick={() => setEditSections({...editSections, avatar: false})}
                            >
                                &#x2715;
                            </button>
                        </div>
                        <form onSubmit={handleUpdatePhoto} className={styles.uploadForm}>
                            <input
                                type="file"
                                onChange={(e) => setSelectedImage(e.target.files[0])}
                                accept="image/*"
                            />
                            <button type="submit" className={styles.saveButton}>
                                Lưu thay đổi
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {/* Overlay chỉnh sửa thông tin */}
            {editSections.info && (
                <div className={styles.overlay}>
                    <div className={styles.editDialog}>
                        <div className={styles.dialogHeader}>
                            <h2>Chỉnh sửa thông tin</h2>
                            <button 
                                className={styles.closeButton}
                                onClick={() => setEditSections({...editSections, info: false})}
                            >
                                &#x2715;
                            </button>
                        </div>
                        <form onSubmit={handleUpdateInfo} className={styles.editForm}>
                            <div className={styles.formGroup}>
                                <label>Họ và tên</label>
                                <input
                                    type="text"
                                    value={profile.fullName}
                                    onChange={(e) => setProfile({...profile, fullName: e.target.value})}
                                    placeholder="Họ và tên"
                                />
                            </div>
                            <div className={styles.formGroup}>
                                <label>Địa chỉ</label>
                                <input
                                    type="text"
                                    value={profile.location}
                                    onChange={(e) => setProfile({...profile, location: e.target.value})}
                                    placeholder="Địa chỉ"
                                />
                            </div>
                            <div className={styles.formGroup}>
                                <label>Ngày sinh</label>
                                <input
                                    type="date"
                                    value={profile.birthday}
                                    onChange={(e) => setProfile({...profile, birthday: e.target.value})}
                                />
                            </div>
                            <div className={styles.formButtons}>
                                <button type="submit" className={styles.saveButton}>Lưu thông tin</button>
                                <button 
                                    type="button" 
                                    className={styles.cancelButton}
                                    onClick={() => setEditSections({...editSections, info: false})}
                                >
                                    Hủy
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Profile;