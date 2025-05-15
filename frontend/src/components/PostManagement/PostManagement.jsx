import React, { useEffect, useState } from 'react';
import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from '@headlessui/react';
import axios from 'axios';
import { Eye, Filter, LockKeyhole, LockOpen } from 'lucide-react';
import Pagination from '@mui/material/Pagination';
import Alert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';
import styles from './PostManagement.module.scss';

const PostManagement = () => {
  const [posts, setPosts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedPost, setSelectedPost] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
  const [postToToggle, setPostToToggle] = useState(null);

  useEffect(() => {
    axios
      .get('http://localhost:8080/api/posts')
      .then((res) => {
        setPosts(res.data);
        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
        setError('Không thể lấy thông tin bài viết!');
        console.error('Error fetching posts:', err);
      });
  }, []);

  const filteredPosts = posts.filter(
    (post) =>
      post.fullName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.content?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const indexOfLastPost = currentPage * itemsPerPage;
  const indexOfFirstPost = indexOfLastPost - itemsPerPage;
  const currentPosts = filteredPosts.slice(indexOfFirstPost, indexOfLastPost);
  const totalPages = Math.ceil(filteredPosts.length / itemsPerPage);

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  const fetchInteractionData = async (post) => {
    try {
      const [likeResponse, commentResponse] = await Promise.all([
        axios.get(`http://localhost:8080/api/likes/count?postId=${post.id}`),
        axios.get(`http://localhost:8080/api/comments/${post.id}`),
      ]);

      return {
        ...post,
        likeCount: likeResponse.data.count || 0,
        commentCount: Array.isArray(commentResponse.data) ? commentResponse.data.length : 0,
      };
    } catch (err) {
      console.error('Error fetching interaction data:', err);
      return {
        ...post,
        likeCount: 0,
        commentCount: 0,
      };
    }
  };

  const handleViewDetails = async (post) => {
    const postWithInteraction = await fetchInteractionData(post);
    setSelectedPost(postWithInteraction);
    setIsModalOpen(true);
  };

  const handleToggleStatus = (post) => {
    setPostToToggle(post);
    setIsConfirmDialogOpen(true);
  };

  const confirmToggleStatus = async () => {
  if (!postToToggle) return;

  try {
    const form = new FormData();
    const postJson = {
      id: postToToggle.id,
      status: !postToToggle.status
    };
    const postBlob = new Blob([JSON.stringify(postJson)], { type: "application/json" });
    form.append("post", postBlob);

    await axios.post('http://localhost:8080/api/posts/update', form, {
      headers: { "Content-Type": "multipart/form-data" }
    });

    setSnackbarMessage(
      postToToggle.status
        ? 'Đã ẩn bài viết thành công'
        : 'Đã hiển thị bài viết thành công'
    );
    setSnackbarSeverity('success');
    setSnackbarOpen(true);

    const res = await axios.get('http://localhost:8080/api/posts');
    setPosts(res.data);

    if (selectedPost && selectedPost.id === postToToggle.id) {
      setSelectedPost({ ...selectedPost, status: !postToToggle.status });
    }
  } catch (error) {
    console.error('Error updating post status:', error.response?.data || error.message);
    const errorMessage = error.response?.data || 'Có lỗi xảy ra khi cập nhật trạng thái';
    setSnackbarMessage(errorMessage);
    setSnackbarSeverity('error');
    setSnackbarOpen(true);
  } finally {
    setIsConfirmDialogOpen(false);
    setPostToToggle(null);
  }
};

  const cancelToggleStatus = () => {
    setIsConfirmDialogOpen(false);
    setPostToToggle(null);
  };

  const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbarOpen(false);
  };

  if (loading) {
    return <div className={styles.loading}>Đang tải dữ liệu...</div>;
  }

  if (error) {
    return <div className={styles.error}>{error}</div>;
  }

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <div className={styles.header}>
          <h1 className={styles.title}>Quản lý bài viết</h1>
          <p className={styles.subtitle}>
            Quản lý nội dung bài viết trong hệ thống một cách dễ dàng
          </p>
        </div>

        <div className={styles.card}>
          <div className={styles.searchFilter}>
            <input
              type="text"
              placeholder="Tìm kiếm bài viết..."
              className={styles.searchInput}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button className={styles.filterButton}>
              <Filter size={16} /> Lọc
            </button>
          </div>

          <div className={styles.tableWrapper}>
            <table className={styles.table}>
              <thead className={styles.tableHead}>
                <tr>
                  <th className={styles.th}>#</th>
                  <th className={styles.th}>Tác giả</th>
                  <th className={styles.th}>Nội dung</th>
                  <th className={styles.th}>Ngày đăng</th>
                  <th className={styles.th}>Hình ảnh</th>
                  <th className={styles.th}>Trạng thái</th>
                  <th className={styles.th}>Hành động</th>
                </tr>
              </thead>
              <tbody>
                {currentPosts.length === 0 ? (
                  <tr>
                    <td colSpan="7" className={styles.emptyTable}>
                      Không có bài viết nào
                    </td>
                  </tr>
                ) : (
                  currentPosts.map((post, index) => (
                    <tr key={post.id} className={styles.tr}>
                      <td className={styles.tdIndex}>
                        {index + 1 + (currentPage - 1) * itemsPerPage}
                      </td>
                      <td className={styles.authorCell}>
                        <img
                          src={
                            post.avatarUrl
                              ? `http://localhost:8080/api/posts/uploads/${post.avatarUrl}`
                              : 'https://i.pravatar.cc/40?img=1'
                          }
                          alt={post.fullName || 'avatar'}
                          className={styles.avatar}
                        />
                        <span>{post.fullName || 'Chưa có tên'}</span>
                      </td>
                      <td className={styles.td}>
                        {post.content?.length > 50
                          ? `${post.content.substring(0, 50)}...`
                          : post.content || 'Không có nội dung'}
                      </td>
                      <td className={styles.tdIndex}>
                        {post.createdAt
                          ? new Date(post.createdAt).toLocaleDateString()
                          : 'Không rõ'}
                      </td>
                      <td className={styles.tdIndex}>
                        {post.imageUrl ? (
                          <img
                            src={`http://localhost:8080/api/posts/uploads/${post.imageUrl}`}
                            alt="post"
                            className={styles.postImage}
                          />
                        ) : (
                          'Không có hình'
                        )}
                      </td>
                      <td className={styles.tdIndex}>
                        <span
                          className={`${styles.statusBadge} ${
                            post.status ? styles.statusActive : styles.statusHidden
                          }`}
                        >
                          {post.status ? 'Hiển thị' : 'Ẩn'}
                        </span>
                      </td>
                      <td className={styles.tdIndex}>
                        <Eye
                          className={styles.viewIcon}
                          onClick={() => handleViewDetails(post)}
                        />
                        {post.status ? (
                          <LockOpen
                            className={styles.viewIcon}
                            onClick={() => handleToggleStatus(post)}
                          />
                        ) : (
                          <LockKeyhole
                            className={styles.viewIconLock}
                            onClick={() => handleToggleStatus(post)}
                          />
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <div className={styles.pagination}>
            <Pagination
              count={totalPages}
              page={currentPage}
              onChange={handlePageChange}
              color="primary"
              shape="rounded"
            />
          </div>
        </div>

        {/* Post Details Modal */}
        <Dialog open={isModalOpen} onClose={() => setIsModalOpen(false)} className={styles.dialog}>
          <DialogBackdrop className={styles.backdrop} />
          <div className={styles.dialogContainer}>
            <DialogPanel className={styles.dialogPanel}>
              <DialogTitle className={styles.dialogTitle}>
                Chi tiết bài viết
              </DialogTitle>
              {selectedPost && (
                <div className={styles.modalContent}>
                  <div className={styles.modalHeader}>
                    <img
                      src={
                        selectedPost.avatarUrl
                          ? `http://localhost:8080/api/posts/uploads/${selectedPost.avatarUrl}`
                          : 'https://i.pravatar.cc/40?img=1'
                      }
                      alt="avatar"
                      className={styles.modalAvatar}
                    />
                    <div>
                      <p className={styles.modalAuthor}>
                        {selectedPost.fullName || 'Không có tên'}
                      </p>
                      <p className={styles.modalDate}>
                        {selectedPost.createdAt
                          ? new Date(selectedPost.createdAt).toLocaleString()
                          : 'Không rõ'}
                      </p>
                    </div>
                  </div>
                  <p>{selectedPost.content || 'Không có nội dung'}</p>
                  <div className={styles.modalImage}>
                    {selectedPost.imageUrl ? (
                      <img
                        src={`http://localhost:8080/api/posts/uploads/${selectedPost.imageUrl}`}
                        alt="post"
                        className={styles.modalPostImage}
                      />
                    ) : (
                      <div className={styles.noImage}>
                        Không có hình ảnh
                      </div>
                    )}
                  </div>

                  <div className={styles.modalColumns}>
                    <div className={styles.interactionColumn}>
                      <h3 className={styles.columnTitle}>Thông tin tương tác</h3>
                      <div className={styles.interactionButtons}>
                        <span className={styles.interactionButton}>
                          <span>Thích</span>
                          <span className={styles.countBadge}>
                            {selectedPost.likeCount}
                          </span>
                        </span>
                        <span className={styles.interactionButton}>
                          Bình luận
                          <span className={styles.countBadge}>
                            {selectedPost.commentCount}
                          </span>
                        </span>
                        <span className={styles.interactionButton}>
                          Chia sẻ
                        </span>
                      </div>
                    </div>

                    <div className={styles.infoColumn}>
                      <h3 className={styles.columnTitle}>Thông tin bài viết</h3>
                      <div className={styles.infoList}>
                        <p>
                          <span className={styles.infoLabel}>ID:</span>{' '}
                          {selectedPost.id || 'Không có ID'}
                        </p>
                        <p>
                          <span className={styles.infoLabel}>Người đăng:</span>{' '}
                          {selectedPost.fullName || 'Không có tên'}
                        </p>
                        <p>
                          <span className={styles.infoLabel}>Trạng thái:</span>{' '}
                          <span
                          className={`${styles.statusBadge} ${
                            selectedPost.status ? styles.statusActive : styles.statusHidden
                          }`}
                        >
                          {selectedPost.status ? 'Hiển thị' : 'Ẩn'}
                        </span>
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className={styles.modalActions}>
                    <button
                      onClick={() => handleToggleStatus(selectedPost)}
                      className={`${styles.statusToggleButton} ${
                        selectedPost.status ? styles.lockButton : styles.unlockButton
                      }`}
                    >
                      {selectedPost.status ? 'Ẩn bài viết' : 'Hiển thị bài viết'}
                    </button>
                    <button
                      onClick={() => setIsModalOpen(false)}
                      className={styles.closeButton}
                    >
                      Đóng
                    </button>
                  </div>
                </div>
              )}
            </DialogPanel>
          </div>
        </Dialog>

        {/* Confirmation Dialog */}
        <Dialog
          open={isConfirmDialogOpen}
          onClose={cancelToggleStatus}
          className={styles.dialog}
        >
          <DialogBackdrop className={styles.backdrop} />
          <div className={styles.dialogContainer}>
            <DialogPanel
              className={`${styles.dialogPanel} ${styles.confirmDialogPanel}`}
              role="dialog"
              aria-labelledby="confirm-dialog-title"
              aria-modal="true"
            >
              <DialogTitle id="confirm-dialog-title" className={styles.dialogTitle}>
                Xác nhận thay đổi trạng thái
              </DialogTitle>
              <div className={styles.modalContent}>
                <p>
                  Bạn có chắc chắn muốn{' '}
                  {postToToggle?.status ? 'ẩn' : 'hiển thị'} bài viết của "
                  {postToToggle?.fullName}"?
                </p>
                <div className={styles.modalActions}>
                  <button
                    onClick={confirmToggleStatus}
                    className={`${styles.statusToggleButton} ${
                      postToToggle?.status ? styles.lockButton : styles.unlockButton
                    }`}
                    autoFocus
                  >
                    Xác nhận
                  </button>
                  <button
                    onClick={cancelToggleStatus}
                    className={styles.closeButton}
                  >
                    Hủy
                  </button>
                </div>
              </div>
            </DialogPanel>
          </div>
        </Dialog>

        <Snackbar
          open={snackbarOpen}
          autoHideDuration={3000}
          onClose={handleCloseSnackbar}
          anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        >
          <Alert
            onClose={handleCloseSnackbar}
            severity={snackbarSeverity}
            sx={{ width: '100%' }}
          >
            {snackbarMessage}
          </Alert>
        </Snackbar>
      </div>
    </div>
  );
};

export default PostManagement;