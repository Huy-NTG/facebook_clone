import React, { useEffect, useState } from 'react';
import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from '@headlessui/react';
import axios from 'axios';
import { Eye, Filter, LockOpen, LockKeyhole } from 'lucide-react';
import Pagination from '@mui/material/Pagination';
import Alert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';
import styles from './UserManagement.module.scss';
import EmailIcon from '@mui/icons-material/Email';
import MaleIcon from '@mui/icons-material/Male';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import CoPresentIcon from '@mui/icons-material/CoPresent';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');
  // New state for confirmation dialog
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
  const [userToToggle, setUserToToggle] = useState(null);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await axios.get('http://localhost:8080/auth/all');
      setUsers(res.data);
      setLoading(false);
    } catch (err) {
      setLoading(false);
      setError('Không thể lấy thông tin người dùng!');
      console.error('Error fetching users:', err);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const filteredUsers = users.filter((user) =>
    user.username?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const indexOfLastUser = currentPage * itemsPerPage;
  const indexOfFirstUser = indexOfLastUser - itemsPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  const getRoleColor = (role) => {
    switch (role?.toLowerCase()) {
      case 'admin':
        return styles.roleAdmin;
      case 'moderator':
        return styles.roleModerator;
      default:
        return styles.roleUser;
    }
  };

  const handleViewDetails = (user) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbarOpen(false);
  };

  const handleToggleStatus = async (user) => {
    setUserToToggle(user); // Store user to toggle
    setIsConfirmDialogOpen(true); // Open confirmation dialog
  };

  const confirmToggleStatus = async () => {
    if (!userToToggle) return;

    try {
      const form = new FormData();
      const userJson = {
        id: userToToggle.id,
        status: !userToToggle.status
      };
      const userBlob = new Blob([JSON.stringify(userJson)], {
        type: "application/json"
      });
      form.append("user", userBlob);

      await axios.post("http://localhost:8080/auth/update", form, {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      });

      setSnackbarMessage(
        userToToggle.status
          ? 'Đã khóa người dùng thành công'
          : 'Đã mở khóa người dùng thành công'
      );
      setSnackbarSeverity('success');
      setSnackbarOpen(true);

      await fetchUsers();
      if (selectedUser && selectedUser.id === userToToggle.id) {
        setSelectedUser({ ...selectedUser, status: !userToToggle.status });
      }
    } catch (error) {
      console.error('Error updating user status:', error.response?.data || error.message);
      setSnackbarMessage('Có lỗi xảy ra khi cập nhật trạng thái');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    } finally {
      setIsConfirmDialogOpen(false); // Close dialog
      setUserToToggle(null); // Clear user
    }
  };

  const cancelToggleStatus = () => {
    setIsConfirmDialogOpen(false);
    setUserToToggle(null);
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
          <h1 className={styles.title}>Quản lý người dùng</h1>
          <p className={styles.subtitle}>
            Quản lý thông tin và quyền của người dùng trong hệ thống một cách dễ dàng
          </p>
        </div>

        <div className={styles.card}>
          <div className={styles.searchFilter}>
            <input
              type="text"
              placeholder="Tìm kiếm người dùng..."
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
                  <th className={styles.th}>Người dùng</th>
                  <th className={styles.th}>Email</th>
                  <th className={styles.th}>Ngày tham gia</th>
                  <th className={styles.th}>Giới tính</th>
                  <th className={styles.th}>Vai trò</th>
                  <th className={styles.th}>Trạng thái</th>
                  <th className={styles.th}>Hành động</th>
                </tr>
              </thead>
              <tbody>
                {currentUsers.length === 0 ? (
                  <tr>
                    <td colSpan="8" className={styles.emptyTable}>
                      Không có người dùng nào
                    </td>
                  </tr>
                ) : (
                  currentUsers.map((user, index) => (
                    <tr key={user.id} className={styles.tr}>
                      <td className={styles.th}>
                        {index + 1 + (currentPage - 1) * itemsPerPage}
                      </td>
                      <td className={styles.userCell}>
                        <img
                          src={
                            user.avatarUrl
                              ? `http://localhost:8080/uploads/${user.avatarUrl}`
                              : 'https://i.pravatar.cc/40?img=1'
                          }
                          alt={user.username || 'avatar'}
                          className={styles.avatar}
                        />
                        <span>{user.username || 'Chưa có tên'}</span>
                      </td>
                      <td className={styles.td}>
                        {user.email || 'Không có email'}
                      </td>
                      <td className={styles.td}>
                        {user.createdAt
                          ? new Date(user.createdAt).toLocaleDateString()
                          : 'Không rõ'}
                      </td>
                      <td className={styles.tdIndex}>
                        <span className={styles.genderBadge}>
                          {user.gender === 'MALE'
                            ? 'Nam'
                            : user.gender === 'FEMALE'
                            ? 'Nữ'
                            : 'Khác'}
                        </span>
                      </td>
                      <td className={styles.tdIndex}>
                        <span className={`${styles.roleBadge} ${getRoleColor(user.role)}`}>
                          {user.role || 'Người dùng'}
                        </span>
                      </td>
                      <td className={styles.tdIndex}>
                        <span
                          className={`${styles.statusBadge} ${
                            user.status === true ? styles.statusActive : styles.statusHidden
                          }`}
                        >
                          {user.status === true ? 'Đang hoạt động' : 'Bị khóa'}
                        </span>
                      </td>
                      <td className={styles.tdIndex}>
                        <Eye
                          className={styles.viewIcon}
                          onClick={() => handleViewDetails(user)}
                        />
                        {user.role === 'ADMIN' ? "" : (user.status === true ? (
                            <LockOpen
                            className={styles.viewIcon}
                            onClick={() => handleToggleStatus(user)}
                            />
                        ) : (
                            <LockKeyhole
                            className={styles.viewIconLock}
                            onClick={() => handleToggleStatus(user)}
                            />
                        ))}
                        
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

        {/* User Details Modal */}
        <Dialog open={isModalOpen} onClose={() => setIsModalOpen(false)} className={styles.dialog}>
          <DialogBackdrop className={styles.backdrop} />
          <div className={styles.dialogContainer}>
            <DialogPanel className={styles.dialogPanel}>
              <DialogTitle className={styles.dialogTitle}>
                Thông tin người dùng
              </DialogTitle>
              {selectedUser && (
                <div className={styles.modalContent}>
                  <div className={styles.modalProfile}>
                    <div className={styles.modalAvatarContainer}>
                      <img
                        src={
                          selectedUser.avatarUrl
                            ? `http://localhost:8080/uploads/${selectedUser.avatarUrl}`
                            : 'https://i.pravatar.cc/100?img=1'
                        }
                        alt="avatar"
                        className={styles.modalAvatar}
                      />
                    </div>
                    <div className={styles.modalDetails}>
                      <h2 className={styles.modalUsername}>
                        {selectedUser.username || 'Không có tên'}
                      </h2>
                      <p className={styles.modalDetailItem}>
                        <span className={styles.icon}>
                          <EmailIcon />
                        </span>{' '}
                        Email: {selectedUser.email || 'Không có email'}
                      </p>
                      <p className={styles.modalDetailItem}>
                        <span className={styles.icon}>
                          <MaleIcon />
                        </span>{' '}
                        Giới tính:{' '}
                        {selectedUser.gender === 'MALE'
                          ? 'Nam'
                          : selectedUser.gender === 'FEMALE'
                          ? 'Nữ'
                          : 'Khác'}
                      </p>
                      <p className={styles.modalDetailItem}>
                        <span className={styles.icon}>
                          <CalendarMonthIcon />
                        </span>{' '}
                        Ngày tham gia:{' '}
                        {selectedUser.createdAt
                          ? new Date(selectedUser.createdAt).toLocaleDateString()
                          : 'Không rõ'}
                      </p>
                      <p className={styles.modalDetailItem}>
                        <span className={styles.icon}>
                          <CoPresentIcon />
                        </span>{' '}
                        Vai trò: {selectedUser.role || 'Người dùng'}
                      </p>
                      <p className={styles.modalDetailItem}>
                        <span className={styles.infoLabel}>Trạng thái:</span>{' '}
                            <span
                            className={`${styles.statusBadge} ${
                            selectedUser.status ? styles.statusActive : styles.statusHidden
                            }`}
                        >
                            {selectedUser.status ? 'Đang hoạt động' : 'Bị khóa'}
                        </span>
                      </p>
                    </div>
                  </div>
                  <div className={styles.modalActions}>
                    {selectedUser.role === 'ADMIN' ? "" : (<button
                      onClick={() => handleToggleStatus(selectedUser)}
                      className={`${styles.statusToggleButton} ${
                        selectedUser.status === true ? styles.lockButton : styles.unlockButton
                      }`}
                    >
                      {selectedUser.status === true ? 'Khóa tài khoản' : 'Mở khóa tài khoản'}
                    </button>)}
                    
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
            <DialogPanel className={styles.dialogPanel}>
              <DialogTitle className={styles.dialogTitle}>
                Xác nhận thay đổi trạng thái
              </DialogTitle>
              <div className={styles.modalContent}>
                <p>
                  Bạn có chắc chắn muốn{' '}
                  {userToToggle?.status ? 'khóa' : 'mở khóa'} tài khoản "
                  {userToToggle?.username}"?
                </p>
                <div className={styles.modalActions}>
                  <button
                    onClick={confirmToggleStatus}
                    className={`${styles.statusToggleButton} ${
                      userToToggle?.status ? styles.lockButton : styles.unlockButton
                    }`}
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

export default UserManagement;