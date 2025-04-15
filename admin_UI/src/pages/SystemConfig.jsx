import React from 'react';

const SystemConfig = () => {
  return (
    <div className="p-6 bg-gray-100 min-h-screen w-full">
      <h1 className="text-3xl font-bold mb-6">Quản lý hệ thống</h1>
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Cấu hình hệ thống</h2>
        <form>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Kích thước file tối đa (MB)</label>
            <input
              type="number"
              className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              defaultValue="10"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Kiểm duyệt bài viết</label>
            <select className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option>Bật</option>
              <option>Tắt</option>
            </select>
          </div>
          <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
            Lưu
          </button>
        </form>
      </div>
    </div>
  );
};

export default SystemConfig;