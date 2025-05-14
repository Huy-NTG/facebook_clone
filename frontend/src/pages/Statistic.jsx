import React, { useEffect, useState } from 'react';
import { FaUsers, FaRegNewspaper, FaComments } from 'react-icons/fa';

const Statistic = () => {
  // Dữ liệu giả lập, có thể thay bằng API thực tế
  const [stats, setStats] = useState({
    users: 120,
    posts: 350,
    comments: 980,
  });

  // Nếu muốn lấy dữ liệu thực tế, dùng useEffect gọi API ở đây
  // useEffect(() => {
  //   // Gọi API lấy số lượng users, posts, comments
  // }, []);

  return (
    <div style={{ padding: 32, minHeight: '100vh', background: '#f4f6fa' }}>
      <h1 style={{ fontSize: 32, fontWeight: 700, marginBottom: 32 }}>Thống kê hệ thống</h1>
      <div style={{ display: 'flex', gap: 32 }}>
        <div style={{ background: '#fff', borderRadius: 12, padding: 32, flex: 1, boxShadow: '0 2px 8px #0001', display: 'flex', alignItems: 'center', gap: 16 }}>
          <FaUsers size={40} color="#1976d2" />
          <div>
            <div style={{ fontSize: 24, fontWeight: 600 }}>{stats.users}</div>
            <div style={{ color: '#888' }}>Người dùng</div>
          </div>
        </div>
        <div style={{ background: '#fff', borderRadius: 12, padding: 32, flex: 1, boxShadow: '0 2px 8px #0001', display: 'flex', alignItems: 'center', gap: 16 }}>
          <FaRegNewspaper size={40} color="#43a047" />
          <div>
            <div style={{ fontSize: 24, fontWeight: 600 }}>{stats.posts}</div>
            <div style={{ color: '#888' }}>Bài viết</div>
          </div>
        </div>
        <div style={{ background: '#fff', borderRadius: 12, padding: 32, flex: 1, boxShadow: '0 2px 8px #0001', display: 'flex', alignItems: 'center', gap: 16 }}>
          <FaComments size={40} color="#fbc02d" />
          <div>
            <div style={{ fontSize: 24, fontWeight: 600 }}>{stats.comments}</div>
            <div style={{ color: '#888' }}>Bình luận</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Statistic; 