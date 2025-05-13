import React, { useEffect, useState } from 'react';
import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from '@headlessui/react';
import { Eye, Filter } from 'lucide-react';

const PostManagement = () => {
  const [posts, setPosts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [error, setError] = useState(null);
  const [selectedPost, setSelectedPost] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Sample data
  const sampleData = [
    {
      id: 9,
      userId: 6,
      fullName: "Phạm Ngọc Châu Thành",
      avatarUrl: "e13ad65a-5383-49d4-89d6-0a61f1271d9a_1375180-luffy-gear-5-sun-god-nika-one-piece-4k-pc-wallpaper.jpg",
      content: "adfxg",
      imageUrl: null,
      createdAt: "2025-05-06T20:21:00"
    }
  ];

  useEffect(() => {
    try {
      setPosts(sampleData);
    } catch (err) {
      setError('Không thể lấy thông tin bài viết!');
      console.error('Error fetching posts:', err);
    }
  }, []);

  const filteredPosts = posts.filter((post) =>
    post.fullName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    post.content?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (error) {
    return <div className="text-red-500 text-center py-10">{error}</div>;
  }

  const handleViewDetails = (post) => {
    setSelectedPost(post);
    setIsModalOpen(true);
  };

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
                {filteredPosts.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="px-6 py-4 text-center text-gray-500">
                      Không có bài viết nào
                    </td>
                  </tr>
                ) : (
                  filteredPosts.map((post, index) => (
                    <tr
                      key={post.id}
                      className="border-b border-gray-200 hover:bg-gray-50 transition"
                    >
                      <td className="px-6 py-4 font-semibold">{index + 1}</td>
                      <td className="px-6 py-4 flex items-center gap-3">
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
                            className="w-16 h-16 object-cover rounded-lg"
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

          {/* Pagination */}
          <div className="mt-6 flex justify-end">
            <div className="flex items-center gap-3 bg-gray-50 px-4 py-2 rounded-lg">
              <button className="text-gray-600 hover:text-gray-900 text-xl">&lt;</button>
              <span className="font-medium text-gray-700">1 / 5</span>
              <button className="text-gray-600 hover:text-gray-900 text-xl">&gt;</button>
            </div>
          </div>
        </div>

        {/* Modal */}
        <Dialog open={isModalOpen} onClose={() => setIsModalOpen(false)} className="relative z-50">
          <DialogBackdrop className="fixed inset-0 bg-black/40 backdrop-blur-sm transition-opacity" />
          <div className="fixed inset-0 flex items-center justify-center p-4">
            <DialogPanel className="bg-white max-w-lg w-full p-8 rounded-2xl shadow-2xl space-y-6 transform transition-all">
              <DialogTitle className="text-2xl font-bold text-gray-800 border-b border-gray-200 pb-4 text-center">
                Thông tin bài viết
              </DialogTitle>
              {selectedPost && (
                <div className="space-y-8 text-gray-700">
                  <div className="grid grid-cols-2 gap-4 text-base">
                    <div className="font-semibold">Tác giả:</div>
                    <div className="text-right">{selectedPost.fullName || 'Không có tên'}</div>
                    <div className="font-semibold">Nội dung:</div>
                    <div className="text-right">{selectedPost.content || 'Không có nội dung'}</div>
                    <div className="font-semibold">Ngày đăng:</div>
                    <div className="text-right">
                      {new Date(selectedPost.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="font-semibold">Ảnh đại diện:</div>
                    <div className="flex justify-center">
                      <img
                        src={
                          selectedPost.avatarUrl
                            ? `http://localhost:8080/uploads/${selectedPost.avatarUrl}`
                            : 'https://i.pravatar.cc/100?img=1'
                        }
                        alt="avatar"
                        className="w-24 h-24 rounded-full object-cover shadow-md"
                      />
                    </div>
                  </div>
                  {selectedPost.imageUrl && (
                    <div className="space-y-3">
                      <div className="font-semibold">Hình ảnh bài viết:</div>
                      <div className="flex justify-center">
                        <img
                          src={`http://localhost:8080/uploads/${selectedPost.imageUrl}`}
                          alt="post"
                          className="w-48 h-48 object-cover rounded-lg shadow-md"
                        />
                      </div>
                    </div>
                  )}
                </div>
              )}
              <button
                onClick={() => setIsModalOpen(false)}
                className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Đóng
              </button>
            </DialogPanel>
          </div>
        </Dialog>
      </div>
    </div>
  );
};

export default PostManagement;