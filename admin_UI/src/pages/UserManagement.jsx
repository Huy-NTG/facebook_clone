// src/components/admin/UserManagement.js
import React from 'react';

const UserManagement = () => {
  const users = [
    { id: 1, name: 'John Doe', email: 'john@example.com', status: 'Active' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', status: 'Blocked' },
  ];

  return (
    <div className="min-h-screen bg-gray-100 p-6 w-full">
      <h1 className="text-3xl font-bold mb-6">User Management</h1>
      
      {/* Tìm kiếm */}
      <input
        type="text"
        placeholder="Search users..."
        className="w-full p-2 mb-4 border rounded-lg"
      />

      {/* Danh sách người dùng */}
      <div className="bg-white rounded-lg shadow overflow-x-auto">
        <table className="min-w-full">
          <thead>
            <tr className="bg-gray-200">
              <th className="p-3 text-left">ID</th>
              <th className="p-3 text-left">Name</th>
              <th className="p-3 text-left">Email</th>
              <th className="p-3 text-left">Status</th>
              <th className="p-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} className="border-t">
                <td className="p-3">{user.id}</td>
                <td className="p-3">{user.name}</td>
                <td className="p-3">{user.email}</td>
                <td className="p-3">{user.status}</td>
                <td className="p-3">
                  <button className="bg-blue-500 text-white px-3 py-1 rounded mr-2">View</button>
                  <button className="bg-red-500 text-white px-3 py-1 rounded">Block</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserManagement;