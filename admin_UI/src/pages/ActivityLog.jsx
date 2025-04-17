import React from 'react';

const ActivityLog = () => {
  const logs = [
    { id: 1, admin: 'Admin A', action: 'Xóa bài viết #123', time: '2025-04-14 10:00' },
  ];

  return (
    <div className="p-6 bg-gray-100 min-h-screen w-full">
      <h1 className="text-3xl font-bold mb-6">Nhật ký hoạt động</h1>
      <div className="bg-white rounded-lg shadow-md overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-gray-200">
              <th className="p-4">ID</th>
              <th className="p-4">Admin</th>
              <th className="p-4">Hành động</th>
              <th className="p-4">Thời gian</th>
            </tr>
          </thead>
          <tbody>
            {logs.map((log) => (
              <tr key={log.id} className="border-t">
                <td className="p-4">{log.id}</td>
                <td className="p-4">{log.admin}</td>
                <td className="p-4">{log.action}</td>
                <td className="p-4">{log.time}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ActivityLog;