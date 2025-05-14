import React, { useEffect, useState } from 'react';
import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from '@headlessui/react';
import axios from 'axios';
import { Eye, Filter } from 'lucide-react';
import Pagination from '@mui/material/Pagination';
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
                    <td colSpan="6" className={styles.emptyTable}>
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
                            ? `http://localhost:8080/uploads/${post.avatarUrl}`
                            : 'https://i.pravatar.cc/40?img=1'
                        }
                        alt={post.fullName || 'avatar'}
                        className={styles.avatar}
                        />
                        <span>{post.fullName || 'Chưa có tên'}</span>
                    </td>
                    <td className={styles.td}>
                        {post.content.length > 50
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
                            src={`http://localhost:8080/uploads/${post.imageUrl}`}
                            alt="post"
                            className={styles.postImage}
                        />
                        ) : (
                        'Không có hình'
                        )}
                    </td>
                    <td className={styles.tdIndex}>
                        <Eye
                        className={styles.viewIcon}
                        onClick={() => handleViewDetails(post)}
                        />
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
                        ? `http://localhost:8080/uploads/${selectedPost.avatarUrl}`
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
                    <p>
                    {selectedPost.content || 'Không có nội dung'}
                    </p>
                <div className={styles.modalImage}>
                    {selectedPost.imageUrl ? (
                    <img
                        src={`http://localhost:8080/uploads/${selectedPost.imageUrl}`}
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
                        Đang hiển thị
                        </p>
                    </div>
                    </div>
                </div>

                <div className={styles.modalActions}>
                    <button
                    onClick={() => setIsModalOpen(false)}
                    className={styles.lockButton}
                    >
                    Khóa bài viết
                    </button>
                </div>
                </div>
            )}
            </DialogPanel>
        </div>
        </Dialog>
    </div>
    </div>
);
};

export default PostManagement;