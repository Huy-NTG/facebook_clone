/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { useState, useEffect, useRef } from "react";
import classNames from "classnames/bind";
import styles from './SettingForm.module.scss';
import axios from "axios";

const cx = classNames.bind(styles);

const SettingForm = ({ user, onClose }) => {
  const [formData, setFormData] = useState({});
  const [previewAvatar, setPreviewAvatar] = useState('');
  const fileInputRef = useRef(null);

  useEffect(() => {
    setFormData({ ...user });
    setPreviewAvatar(`http://localhost:8080/uploads/${user.avatarUrl}`);
  }, [user]);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    const form = new FormData();
  
    // Tạo JSON blob từ thông tin người dùng để gửi dưới key "user"
    const userJson = {
      id: formData.id,
      fullName: formData.fullName,
      bio: formData.bio,
      birthday: formData.birthday,
      gender: formData.gender
    };
  
    const userBlob = new Blob([JSON.stringify(userJson)], {
      type: "application/json"
    });
  
    form.append("user", userBlob);
  
    if (formData.avatarFile) {
      form.append("avatarFile", formData.avatarFile);
    }
  
    try {
      const response = await axios.post("http://localhost:8080/auth/update", form, {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      });
      alert("Cập nhật thành công!");
      onClose();
    } catch (err) {
      alert("Cập nhật thất bại!");
      console.error(err);
      
    }
  };
  
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPreviewAvatar(URL.createObjectURL(file));
      setFormData(prev => ({ ...prev, avatarFile: file })); // lưu file để upload nếu cần
    }
  };

  const triggerFileSelect = () => {
    fileInputRef.current.click();
  };

  return (
    <div className={cx("modal")}>
      <div className={cx("modal-content")}>
        <h2>Chỉnh sửa hồ sơ</h2>

        <label>Email:</label>
        <input 
          name="email" 
          value={formData.email || ''} 
          onChange={handleChange} 
        />
        <label>Họ và tên:</label>
        <input 
          name="fullName" 
          value={formData.fullName || ''} 
          onChange={handleChange} 
        />
        <label>Ảnh đại diện:</label>
        <div className={cx("avatar-section")}>
          <img 
            src={previewAvatar || undefined} 
            alt="avatar" 
            className={cx("avatar")}
          />
          <button type="button" onClick={triggerFileSelect} className={cx("select-image-button")}>
            Chọn ảnh
          </button>
          <input 
            type="file" 
            accept="image/*" 
            ref={fileInputRef} 
            style={{ display: "none" }}
            onChange={handleFileChange}
          />
        </div>

        <label>Tiểu sử:</label>
        <textarea 
          name="bio" 
          value={formData.bio || ''} 
          onChange={handleChange} 
        ></textarea>

        <label>Ngày sinh:</label>
        <input 
          type="date" 
          name="birthday" 
          value={formData.birthday || ''} 
          onChange={handleChange} 
        />

        <label>Giới tính:</label>
        <select 
          name="gender" 
          value={formData.gender || ''} 
          onChange={handleChange}
        >
          <option value="">-- Chọn giới tính --</option>
          <option value="MALE">Nam</option>
          <option value="FEMALE">Nữ</option>
          <option value="OTHER">Khác</option>
        </select>

        <div className={cx("button-group")}>
          <button onClick={onClose}>Đóng</button>
          <button onClick={handleSubmit}>Lưu</button>
        </div>
      </div>
    </div>
  );
};

export default SettingForm;