// src/components/admin/ReportManagement.js
import React from 'react';

const ReportManagement = () => {
  const reports = [
    { id: 1, reporter: 'Jane', target: 'Post #1', reason: 'Spam', status: 'Pending' },
  ];

  return (
    <div className="min-h-screen bg-gray-100 p-6 w-full">
      <h1 className="text-3xl font-bold mb-6">Report Management</h1>
      
      {/* Danh sách báo cáo */}
      <div className="bg-white rounded-lg shadow overflow-x-auto">
        <table className="min-w-full">
          <thead>
            <tr className="bg-gray-200">
              <th className="p-3 text-left">ID</th>
              <th className="p-3 text-left">Reporter</th>
              <th className="p-3 text-left">Target</th>
              <th className="p-3 text-left">Reason</th>
              <th className="p-3 text-left">Status</th>
              <th className="p-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {reports.map((report) => (
              <tr key={report.id} className="border-t">
                <td className="p-3">{report.id}</td>
                <td className="p-3">{report.reporter}</td>
                <td className="p-3">{report.target}</td>
                <td className="p-3">{report.reason}</td>
                <td className="p-3">{report.status}</td>
                <td className="p-3">
                  <button className="bg-green-500 text-white px-3 py-1 rounded mr-2">Resolve</button>
                  <button className="bg-red-500 text-white px-3 py-1 rounded">Dismiss</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ReportManagement;