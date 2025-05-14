import React, { useEffect, useState } from 'react';
import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from '@headlessui/react';
import axios from 'axios';
import { Eye, Filter } from 'lucide-react';
import Pagination from '@mui/material/Pagination';

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

  // Calculate paginated posts
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
        likeCount: likeResponse.data.count || 0, // Assuming the API returns { count: number }
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
    return <div className="text-center py-10 text-gray-600">Đang tải dữ liệu...</div>;
  }

  if (error) {
    return <div className="text-red-500 text-center py-10">{error}</div>;
  }

  return (
    <div className="min-h-screen w-full bg-gray-100 px-6 py-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="text-center space-y-3">
          <h1 className="text-4xl font-bold text-gray-800">Quản lý bài viết</h1>
          <p className="text-lg text-gray-600">
            Quản lý nội dung bài viết trong hệ thống một cách dễ dàng
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-8">
          {/* Search & Filter */}
          <div className="flex items-center justify-between gap-4 mb-6">
            <input
              type="text"
              placeholder="Tìm kiếm bài viết..."
              className="w-full max-w-md px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition">
              <Filter size={16} /> Lọc
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm text-gray-700">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left font-semibold">#</th>
                  <th className="px-6 py-4 text-left font-semibold">Tác giả</th>
                  <th className="px-6 py-4 text-left font-semibold">Nội dung</th>
                  <th className="px-6 py-4 text-left font-semibold">Ngày đăng</th>
                  <th className="px-6 py-4 text-left font-semibold">Hình ảnh</th>
                  <th className="px-6 py-4 text-left font-semibold">Hành động</th>
                </tr>
              </thead>
              <tbody>
                {currentPosts.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="px-6 py-4 text-center text-gray-500">
                      Không có bài viết nào
                    </td>
                  </tr>
                ) : (
                  currentPosts.map((post, index) => (
                    <tr
                      key={post.id}
                      className="border-b border-gray-200 hover:bg-gray-50 transition items-center"
                    >
                      <td className="px-6 py-4 font-semibold">
                        {index + 1 + (currentPage - 1) * itemsPerPage}
                      </td>
                      <td className="p-5 flex items-center gap-3">
                        <img
                          src={
                            post.avatarUrl
                              ? `http://localhost:8080/uploads/${post.avatarUrl}`
                              : 'https://i.pravatar.cc/40?img=1'
                          }
                          alt={post.fullName || 'avatar'}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                        <span>{post.fullName || 'Chưa có tên'}</span>
                      </td>
                      <td className="px-6 py-4">
                        {post.content.length > 50
                          ? `${post.content.substring(0, 50)}...`
                          : post.content || 'Không có nội dung'}
                      </td>
                      <td className="px-6 py-4">
                        {post.createdAt
                          ? new Date(post.createdAt).toLocaleDateString()
                          : 'Không rõ'}
                      </td>
                      <td className="px-6 py-4">
                        {post.imageUrl ? (
                          <img
                            src={`http://localhost:8080/uploads/${post.imageUrl}`}
                            alt="post"
                            className="w-16 h-12 object-cover rounded-lg"
                          />
                        ) : (
                          'Không có hình'
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <Eye
                          className="w-5 h-5 text-blue-600 cursor-pointer hover:text-blue-800 transition"
                          onClick={() => handleViewDetails(post)}
                        />
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* MUI Pagination */}
          <div className="mt-6 flex justify-end">
            <Pagination
              count={totalPages}
              page={currentPage}
              onChange={handlePageChange}
              color="primary"
              shape="rounded"
            />
          </div>
        </div>

        {/* Modal */}
        <Dialog open={isModalOpen} onClose={() => setIsModalOpen(false)} className="relative z-50">
          <DialogBackdrop className="fixed inset-0 bg-black/40 backdrop-blur-sm transition-opacity" />
          <div className="fixed inset-0 flex items-center justify-center p-4">
            <DialogPanel className="bg-white max-w-5xl w-full rounded-lg shadow-2xl p-6">
              <DialogTitle className="text-xl font-semibold text-gray-900 border-b pb-4">
                Chi tiết bài viết
              </DialogTitle>
              {selectedPost && (
                <div className="mt-4 space-y-6">
                  {/* Header */}
                  <div className="flex items-center gap-3">
                    <img
                      src={
                        selectedPost.avatarUrl
                          ? `http://localhost:8080/uploads/${selectedPost.avatarUrl}`
                          : 'https://i.pravatar.cc/40?img=1'
                      }
                      alt="avatar"
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <div>
                      <p className="font-medium text-gray-900">{selectedPost.fullName || 'Không có tên'}</p>
                      <p className="text-sm text-gray-500">
                        {selectedPost.createdAt
                          ? new Date(selectedPost.createdAt).toLocaleString()
                          : 'Không rõ'}
                      </p>
                    </div>
                  </div>

                  {/* Post Image */}
                  <div className="w-full">
                    {selectedPost.imageUrl ? (
                      <img
                        src={`http://localhost:8080/uploads/${selectedPost.imageUrl}`}
                        alt="post"
                        className="w-full h-64 object-cover rounded-lg"
                      />
                    ) : (
                      <div className="w-full h-64 bg-gray-200 flex items-center justify-center rounded-lg">
                        Không có hình ảnh
                      </div>
                    )}
                  </div>

                  {/* Two Columns */}
                  <div className="grid grid-cols-2 gap-6">
                    {/* Interaction Column */}
                    <div className="space-y-4">
                      <h3 className="font-semibold text-gray-700">Thông tin tương tác</h3>
                      <div className="flex space-x-4">
                        <button className="flex items-center gap-2 px-3 py-2 bg-blue-100 text-blue-600 rounded-full hover:bg-blue-200 transition">
                          <span>Thích</span>
                          <span className="bg-blue-600 text-white rounded-full w-5 h-5 flex items-center justify-center">
                            {selectedPost.likeCount}
                          </span>
                        </button>
                        <button className="flex items-center gap-2 px-3 py-2 bg-blue-100 text-blue-600 rounded-full hover:bg-blue-200 transition">
                          Bình luận
                          <span className="bg-blue-600 text-white rounded-full w-5 h-5 flex items-center justify-center">
                            {selectedPost.commentCount}
                          </span>
                        </button>
                        <button className="flex items-center gap-2 px-3 py-2 bg-blue-100 text-blue-600 rounded-full hover:bg-blue-200 transition">
                          Chia sẻ
                        </button>
                      </div>
                    </div>

                    {/* Post Info Column */}
                    <div className="space-y-4">
                      <h3 className="font-semibold text-gray-700">Thông tin bài viết</h3>
                      <div className="space-y-2">
                        <p><span className="font-medium">ID:</span> {selectedPost.id || 'Không có ID'}</p>
                        <p><span className="font-medium">Người đăng:</span> {selectedPost.fullName || 'Không có tên'}</p>
                        <p><span className="font-medium">Trạng thái:</span> Đang hiển thị</p>
                      </div>
                    </div>
                  </div>

                  {/* Action Button */}
                  <div className="flex justify-end">
                    <button
                      onClick={() => setIsModalOpen(false)}
                      className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition"
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