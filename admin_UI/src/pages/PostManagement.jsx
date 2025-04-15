// src/components/admin/PostManagement.js
import React from 'react';

const PostManagement = () => {
  const posts = [
    { id: 1, author: 'John Doe', content: 'Hello world!', status: 'Public' },
    { id: 2, author: 'Jane Smith', content: 'Nice day!', status: 'Pending' },
  ];

  return (
    <div className="min-h-screen bg-gray-100 p-6 w-full">
      <h1 className="text-3xl font-bold mb-6">Post Management</h1>
      
      {/* Tìm kiếm */}
      <input
        type="text"
        placeholder="Search posts..."
        className="w-full p-2 mb-4 border rounded-lg"
      />

      {/* Danh sách bài viết */}
      <div className="bg-white rounded-lg shadow overflow-x-auto">
        <table className="min-w-full">
          <thead>
            <tr className="bg-gray-200">
              <th className="p-3 text-left">ID</th>
              <th className="p-3 text-left">Author</th>
              <th className="p-3 text-left">Content</th>
              <th className="p-3 text-left">Status</th>
              <th className="p-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {posts.map((post) => (
              <tr key={post.id} className="border-t">
                <td className="p-3">{post.id}</td>
                <td className="p-3">{post.author}</td>
                <td className="p-3">{post.content}</td>
                <td className="p-3">{post.status}</td>
                <td className="p-3">
                  <button className="bg-blue-500 text-white px-3 py-1 rounded mr-2">View</button>
                  <button className="bg-red-500 text-white px-3 py-1 rounded">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PostManagement;