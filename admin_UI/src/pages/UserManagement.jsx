import React, { useEffect, useState } from 'react';
import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from '@headlessui/react'
import axios from 'axios';
import { Eye, Check, Filter } from 'lucide-react';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [error, setError] = useState(null);
  // const [loading, setLoading] = useState(true);

  //Hook for modal
  const [selectedUser, setSelectedUser] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);


  useEffect(() => {
    axios
      .get('http://localhost:8080/auth/users')
      .then((res) => {
        setUsers(res.data);
        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
        setError('Không thể lấy thông tin người dùng!');
        console.error('Error fetching users:', err);
      });
  }, []);

  const filteredUsers = users.filter((user) =>
    user.username?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // if (loading) {
  //   return <div>Đang tải dữ liệu...</div>;
  // }

  if (error) {
    return <div className="text-red-300">{error}</div>;
  }

  const getRoleColor = (role) => {
    switch (role?.toLowerCase()) {
      case 'admin':
        return 'bg-red-500';
      case 'moderator':
        return 'bg-yellow-500';
      default:
        return 'bg-blue-500';
    }
  };

  const handleViewDetails = (user) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };


  return (
    <div className="px-[4%] py-5 space-y-10 bg-gray-200 w-full">
      <div className='space-y-4'>
        <h1 className="text-3xl font-semibold text-center text-shadow-sm">Quản lý người dùng</h1>
        <p className="text-center text-gray-600 text-shadow-sm">
          Quản lý thông tin và quyền của người dùng trong hệ thống
        </p>
      </div>

      <div className='space-y-6 bg-white p-7 rounded-md shadow-xl'>
        {/* Search & Filter */}
        <div className="flex items-center justify-between gap-2">
          <input
            type="text"
            placeholder="Tìm kiếm người dùng..."
            className="w-full max-w-md border p-2 border-zinc-400 rounded-md mb-4 shadow-md"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {/* <button variant="outline" className="flex gap-2 cursor-pointer hover:scale-105 duration-120">
            <Filter size={16} /> Lọc
          </button> */}
        </div>

        <div className="overflow-auto">
          <table className="min-w-full text-[13px] border-[1px] border-gray-200 shadow-xl ">
            <thead>
              <tr>
                <th className="px-6 py-3 border-b border-zinc-300">#</th>
                <th className="font-semibold border-b border-zinc-300">Người dùng</th>
                <th className="font-semibold border-b border-zinc-300">Email</th>
                <th className="font-semibold border-b border-zinc-300">Ngày tham gia</th>
                <th className="font-semibold border-b border-zinc-300">Giới tính</th>
                <th className="font-semibold border-b border-zinc-300">Vai trò</th>
                <th className="pr-6 font-semibold border-b border-zinc-300">Hành động</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan="8" className="p-3 text-center">
                    Không có người dùng nào
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user, index) => (
                  <tr
                    key={user.id}
                    className='border-b border-zinc-200'
                  >
                    <td className="p-6 font-semibold">{index + 1}</td>
                    <td className="p-3 flex items-center">
                      <span className="p-3">
                        <img
                          src={
                            user.avatarUrl
                              ? `http://localhost:8080/uploads/${user.avatarUrl}`
                              : 'https://i.pravatar.cc/40?img=1'
                          }
                          alt={user.username || 'avatar'}
                          className="w-8 h-8 rounded-full"
                        />
                      </span>
                      {user.username || 'Chưa có tên'}</td>
                    <td className="p-3">{user.email || 'Không có email'}

                    </td>
                    <td className="p-3">
                      {user.createdAt
                        ? new Date(user.createdAt).toLocaleDateString()
                        : 'Không rõ'}
                    </td>
                    <td className="p-3">
                      <span
                        className='px-4 py-2 rounded-full text-sm bg-gray-500 text-white'
                      >
                        {user.gender === 'MALE' ? 'Nam' : 'Nữ'}
                      </span>
                    </td>
                    <td className="p-3">
                      <span
                        className={`px-2 py-1 rounded-full text-xs text-white ${getRoleColor(
                          user.role
                        )}`}
                      >
                        {user.role || 'Người dùng'}
                      </span>
                    </td>
                    {/* <td className="p-3 space-x-2">
                  <button className="bg-red-600 hover:bg-red-700 text-white text-sm px-3 py-1 rounded-md">
                    Block
                  </button>
                  <button className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-3 py-1 rounded-md">
                    Xem chi tiết
                  </button>
                </td> */}
                    <td className="pl-10 space-y-2">
                      <Eye
                        className="w-4 h-4 text-gray-600 cursor-pointer"
                        onClick={() => handleViewDetails(user)}
                      />
                      {/* <Check className="w-4 h-4 text-gray-600 cursor-pointer" /> */}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        <div className="text-sm text-black flex justify-end pr-3 items-center">
          <div className="p-2 bg-zinc-100 rounded-lg flex items-center gap-3">
            <span className="text-2xl text-gray-500 cursor-pointer hover:text-black">&lt;</span>
            <span className="font-medium text-gray-700">1 / 5</span>
            <span className="text-2xl text-gray-500 cursor-pointer hover:text-black">&gt;</span>
          </div>
        </div>

      </div>

      {/* Div modal */}
      <Dialog open={isModalOpen} onClose={() => setIsModalOpen(false)} className="relative z-50">
        <DialogBackdrop className="fixed inset-0 bg-black/30 backdrop-blur-sm" />

        <div className="fixed inset-0 flex items-center justify-center p-4">
          <DialogPanel className="bg-white max-w-md w-full p-6 rounded-xl shadow-lg space-y-4">
            <DialogTitle className="text-xl font-bold pb-4 border-b border-zinc-400 text-center">Thông tin người dùng</DialogTitle>

            {selectedUser && (
              <div className="space-y-6 text-md">
                {/* Grid 2 cột cho thông tin */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="font-semibold">Tên:</div>
                  <div className="text-right">{selectedUser.username || 'Không có tên'}</div>

                  <div className="font-semibold">Email:</div>
                  <div className="text-right">{selectedUser.email || 'Không có email'}</div>

                  <div className="font-semibold">Vai trò:</div>
                  <div className="text-right">{selectedUser.role || 'Người dùng'}</div>

                  <div className="font-semibold">Giới tính:</div>
                  <div className="text-right">{selectedUser.gender === 'MALE' ? 'Nam' : 'Nữ'}</div>

                  <div className="font-semibold">Ngày tham gia:</div>
                  <div className="text-right">
                    {new Date(selectedUser.createdAt).toLocaleDateString()}
                  </div>
                </div>

                {/* Ảnh đại diện */}
                <div className="space-y-2">
                  <div className="font-semibold text-left">Ảnh đại diện:</div>
                  <div className="flex justify-center">
                    <img
                      src={
                        selectedUser.avatarUrl
                          ? `http://localhost:8080/uploads/${selectedUser.avatarUrl}`
                          : 'https://i.pravatar.cc/100?img=1'
                      }
                      alt="avatar"
                      className="w-20 h-20 rounded-full"
                    />
                  </div>
                </div>
              </div>
            )}


            <button
              onClick={() => setIsModalOpen(false)}
              className="mt-4 w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 cursor-pointer"
            >
              Đóng
            </button>
          </DialogPanel>
        </div>
      </Dialog>

    </div>
  );
};

export default UserManagement;
