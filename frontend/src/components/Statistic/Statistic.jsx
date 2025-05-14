import React, { useEffect, useState } from 'react';
import { FaUsers, FaRegNewspaper, FaComments, FaThumbsUp, FaUserCheck, FaUserSlash } from 'react-icons/fa';
import styles from './Statistic.module.scss';
import axios from 'axios';

function getMonthYear(dateString) {
  const d = new Date(dateString);
  return `${d.getMonth() + 1}-${d.getFullYear()}`;
}

const Statistic = () => {
  const [stats, setStats] = useState({
    users: 0,
    posts: 0,
    comments: 0,
    likes: 0,
    newUsersThisMonth: 0,
    newPostsThisMonth: 0,
    activeUsers: 0,
    lockedUsers: 0,
    topUsers: [],
    topCommentedPost: null,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      try {
        // Lấy danh sách người dùng
        const usersRes = await axios.get('http://localhost:8080/auth/all');
        const users = Array.isArray(usersRes.data) ? usersRes.data : [];
        // Lấy danh sách bài viết
        const postsRes = await axios.get('http://localhost:8080/api/posts');
        const posts = Array.isArray(postsRes.data) ? postsRes.data : [];
        // Lấy danh sách bình luận (nếu có API)
        let comments = [];
        try {
          const commentsRes = await axios.get('http://localhost:8080/api/comments');
          comments = Array.isArray(commentsRes.data) ? commentsRes.data : [];
        } catch {
          comments = [];
        }
        // Lấy số lượng like cho từng post
        let totalLikes = 0;
        for (let post of posts) {
          try {
            const likeRes = await axios.get(`http://localhost:8080/api/likes/count?postId=${post.id}`);
            totalLikes += likeRes.data.count || 0;
          } catch {}
        }
        // Thống kê top 3 user có nhiều bài viết nhất
        const userPostCount = {};
        posts.forEach(post => {
          userPostCount[post.userId] = (userPostCount[post.userId] || 0) + 1;
        });
        const topUsers = Object.entries(userPostCount)
          .map(([userId, count]) => {
            const user = users.find(u => u.id === Number(userId));
            return { user, count };
          })
          .filter(item => item.user)
          .sort((a, b) => b.count - a.count)
          .slice(0, 3);
        // Thống kê bài viết có nhiều bình luận nhất
        const postCommentCount = {};
        comments.forEach(comment => {
          postCommentCount[comment.post_id || comment.postId] = (postCommentCount[comment.post_id || comment.postId] || 0) + 1;
        });
        let topCommentedPost = null;
        if (Object.keys(postCommentCount).length > 0) {
          const topPostId = Object.entries(postCommentCount).sort((a, b) => b[1] - a[1])[0][0];
          const post = posts.find(p => p.id === Number(topPostId));
          topCommentedPost = post ? { ...post, commentCount: postCommentCount[topPostId] } : null;
        }
        // Số lượng người dùng mới trong tháng
        const now = new Date();
        const thisMonth = now.getMonth() + 1;
        const thisYear = now.getFullYear();
        const newUsersThisMonth = users.filter(u => {
          if (!u.createdAt) return false;
          const d = new Date(u.createdAt);
          return d.getMonth() + 1 === thisMonth && d.getFullYear() === thisYear;
        }).length;
        // Số lượng bài viết mới trong tháng
        const newPostsThisMonth = posts.filter(p => {
          if (!p.createdAt) return false;
          const d = new Date(p.createdAt);
          return d.getMonth() + 1 === thisMonth && d.getFullYear() === thisYear;
        }).length;
        // Số user đang hoạt động và bị khóa
        const activeUsers = users.filter(u => u.status === true).length;
        const lockedUsers = users.filter(u => u.status === false).length;
        setStats({
          users: users.length,
          posts: posts.length,
          comments: comments.length,
          likes: totalLikes,
          newUsersThisMonth,
          newPostsThisMonth,
          activeUsers,
          lockedUsers,
          topUsers,
          topCommentedPost,
        });
      } catch (error) {
        console.error('Lỗi khi lấy thống kê:', error);
      }
      setLoading(false);
    };
    fetchStats();
  }, []);

  if (loading) return <div className={styles.loading}>Đang tải thống kê...</div>;

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Thống kê hệ thống</h1>
      <div className={styles['stat-list']}>
        <div className={styles['stat-item']}>
          <FaUsers size={40} color="#1976d2" />
          <div>
            <div className={styles['stat-value']}>{stats.users}</div>
            <div className={styles['stat-label']}>Người dùng</div>
          </div>
        </div>
        <div className={styles['stat-item']}>
          <FaRegNewspaper size={40} color="#43a047" />
          <div>
            <div className={styles['stat-value']}>{stats.posts}</div>
            <div className={styles['stat-label']}>Bài viết</div>
          </div>
        </div>
        <div className={styles['stat-item']}>
          <FaComments size={40} color="#fbc02d" />
          <div>
            <div className={styles['stat-value']}>{stats.comments}</div>
            <div className={styles['stat-label']}>Bình luận</div>
          </div>
        </div>
        <div className={styles['stat-item']}>
          <FaThumbsUp size={40} color="#e53935" />
          <div>
            <div className={styles['stat-value']}>{stats.likes}</div>
            <div className={styles['stat-label']}>Tổng lượt like</div>
          </div>
        </div>
      </div>
      <div style={{marginTop: 32}}>
        <h2 style={{fontSize: 22, fontWeight: 600, marginBottom: 12}}>Top 3 user có nhiều bài viết nhất</h2>
        <table style={{width: '100%', background: '#fff', borderRadius: 8, boxShadow: '0 2px 8px #0001', marginBottom: 24}}>
          <thead>
            <tr style={{background: '#f4f6fa'}}>
              <th style={{padding: 8}}>Tên</th>
              <th style={{padding: 8}}>Email</th>
              <th style={{padding: 8}}>Số bài viết</th>
            </tr>
          </thead>
          <tbody>
            {stats.topUsers.map((item, idx) => (
              <tr key={item.user.id} style={{textAlign: 'center'}}>
                <td style={{padding: 8}}>{item.user.username}</td>
                <td style={{padding: 8}}>{item.user.email}</td>
                <td style={{padding: 8}}>{item.count}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <h2 style={{fontSize: 22, fontWeight: 600, marginBottom: 12}}>Bài viết có nhiều bình luận nhất</h2>
        {stats.topCommentedPost ? (
          <div style={{background: '#fff', borderRadius: 8, boxShadow: '0 2px 8px #0001', padding: 16, marginBottom: 24}}>
            <div><b>Nội dung:</b> {stats.topCommentedPost.content}</div>
            <div><b>Tác giả:</b> {stats.topCommentedPost.fullName || stats.topCommentedPost.username}</div>
            <div><b>Số bình luận:</b> {stats.topCommentedPost.commentCount}</div>
          </div>
        ) : <div>Không có dữ liệu.</div>}
        <div style={{display: 'flex', gap: 32, marginTop: 24}}>
          <div style={{background: '#fff', borderRadius: 8, boxShadow: '0 2px 8px #0001', padding: 16, flex: 1}}>
            <h3 style={{fontWeight: 600}}>Người dùng mới trong tháng</h3>
            <div style={{fontSize: 24, fontWeight: 700, color: '#1976d2'}}>{stats.newUsersThisMonth}</div>
          </div>
          <div style={{background: '#fff', borderRadius: 8, boxShadow: '0 2px 8px #0001', padding: 16, flex: 1}}>
            <h3 style={{fontWeight: 600}}>Bài viết mới trong tháng</h3>
            <div style={{fontSize: 24, fontWeight: 700, color: '#43a047'}}>{stats.newPostsThisMonth}</div>
          </div>
          <div style={{background: '#fff', borderRadius: 8, boxShadow: '0 2px 8px #0001', padding: 16, flex: 1}}>
            <h3 style={{fontWeight: 600}}>User đang hoạt động</h3>
            <div style={{fontSize: 24, fontWeight: 700, color: '#1976d2', display: 'flex', alignItems: 'center', gap: 8}}><FaUserCheck /> {stats.activeUsers}</div>
          </div>
          <div style={{background: '#fff', borderRadius: 8, boxShadow: '0 2px 8px #0001', padding: 16, flex: 1}}>
            <h3 style={{fontWeight: 600}}>User bị khóa</h3>
            <div style={{fontSize: 24, fontWeight: 700, color: '#e53935', display: 'flex', alignItems: 'center', gap: 8}}><FaUserSlash /> {stats.lockedUsers}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Statistic; 