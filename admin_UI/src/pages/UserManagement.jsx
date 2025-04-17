import React from 'react';
// import { Card } from '@/components/ui/card';
// import { Input } from '@/components/ui/input';
// import { Button } from '@/components/ui/button';
import { Eye, Check, Filter } from 'lucide-react';

const users = [
  {
    id: 1,
    name: 'Nguyễn Văn A',
    username: '@nguyenvana',
    email: 'nguyenvana@example.com',
    role: 'Quản trị viên',
    status: 'Hoạt động',
    date: '2023-01-15',
    avatar: 'https://i.pravatar.cc/40?img=1',
  },
  {
    id: 2,
    name: 'Trần Thị B',
    username: '@tranthib',
    email: 'tranthib@example.com',
    role: 'Người dùng',
    status: 'Hoạt động',
    date: '2023-02-10',
    avatar: 'https://i.pravatar.cc/40?img=2',
  },
  {
    id: 3,
    name: 'Lê Văn C',
    username: '@levanc',
    email: 'levanc@example.com',
    role: 'Người dùng',
    status: 'Không hoạt động',
    date: '2023-03-05',
    avatar: 'https://i.pravatar.cc/40?img=3',
  },
  {
    id: 4,
    name: 'Phạm Thị D',
    username: '@phamthid',
    email: 'phamthid@example.com',
    role: 'Người dùng',
    status: 'Bị cấm',
    date: '2023-03-20',
    avatar: 'https://i.pravatar.cc/40?img=4',
  },
  {
    id: 5,
    name: 'Hoàng Văn E',
    username: '@hoangvane',
    email: 'hoangvane@example.com',
    role: 'Người dùng',
    status: 'Hoạt động',
    date: '2023-04-01',
    avatar: 'https://i.pravatar.cc/40?img=5',
  },
];

const statusStyle = {
  'Hoạt động': 'bg-green-600 text-white',
  'Không hoạt động': 'bg-orange-600 text-white',
  'Bị cấm': 'bg-red-600 text-white',
};

const roleStyle = {
  'Quản trị viên': 'bg-indigo-600 text-white',
  'Người dùng': 'bg-gray-200 text-black',
};

export default function UserManagement() {
  return (
    <div className="px-[5%] pt-5 space-y-10 bg-zinc-200 w-full">
      {/* Header */}
      <div className='space-y-4'>
        <h1 className="text-3xl font-semibold text-center">Quản lý người dùng</h1>
        <p className="text-center text-gray-600">
          Quản lý thông tin và quyền của người dùng trong hệ thống
        </p>
      </div>

      {/* Content */}
      <div className='space-y-6 bg-white p-7 rounded-md shadow-xl'>
        {/* Search & Filter */}
        <div className="flex items-center justify-between gap-2">
          <input placeholder="Tìm kiếm người dùng..." className="w-full max-w-md border p-2 border-zinc-400 rounded-md" />
          <button variant="outline" className="flex gap-2 cursor-pointer hover:scale-105 duration-120">
            <Filter size={16} /> Lọc
          </button>
        </div>

        {/* Table */}
        <div className="overflow-auto">
          <table className="min-w-full text-md">
            <thead>
              <tr className="text-left">
                <th className="p-3">ID</th>
                <th className="p-3">Người dùng</th>
                <th className="p-3">Email</th>
                <th className="p-3">Vai trò</th>
                <th className="p-3">Trạng thái</th>
                <th className="p-3">Ngày đăng ký</th>
                <th className="p-3">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id} className="border-t">
                  <td className="p-3">{user.id}</td>
                  <td className="p-3 flex items-center gap-2">
                    <img
                      src={user.avatar}
                      alt={user.name}
                      className="w-8 h-8 rounded-full"
                    />
                    <div>
                      <div className="font-medium">{user.name}</div>
                      <div className="text-gray-500 text-xs">{user.username}</div>
                    </div>
                  </td>
                  <td className="p-3">{user.email}</td>
                  <td className="p-3">
                    <span className={`px-2 py-1 rounded-full text-xs ${roleStyle[user.role]}`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="p-3">
                    <span className={`px-2 py-1 rounded-full text-xs ${statusStyle[user.status]}`}>
                      {user.status}
                    </span>
                  </td>
                  <td className="p-3">{user.date}</td>
                  <td className="p-3 flex gap-2">
                    <Eye className="w-4 h-4 text-gray-600 cursor-pointer" />
                    <Check className="w-4 h-4 text-gray-600 cursor-pointer" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="text-sm text-gray-600 flex justify-between">
          <span>Số hàng mỗi trang: 5</span>
          <span>1-5 của 5</span>
        </div>
      </div>
    </div>
  );
} 
