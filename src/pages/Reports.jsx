import React, { useEffect, useState } from 'react';
import axiosInstance from '../api';

export default function Reports() {
  const [reports, setReports] = useState([]);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);

  useEffect(() => {
    fetchReports(page);
  }, [page]);

  const fetchReports = async (page) => {
    try {
      const res = await axiosInstance.get('/reports', { params: { page } });
      setReports(res.data.reports);
      setPages(res.data.pages);
    } catch {
      alert('Failed to fetch reports');
    }
  };

  const resolveReport = async (id) => {
    try {
      await axiosInstance.post(`/reports/${id}/resolve`);
      fetchReports(page);
    } catch {
      alert('Failed to resolve report');
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Content Reports</h2>
      <table className="min-w-full bg-white rounded shadow overflow-hidden">
        <thead className="bg-gray-200 text-left">
          <tr>
            <th className="p-3">Reported By</th>
            <th className="p-3">Reason</th>
            <th className="p-3">Details</th>
            <th className="p-3">Resolved</th>
            <th className="p-3">Actions</th>
          </tr>
        </thead>
        <tbody>
          {reports.map(r => (
            <tr key={r._id} className="border-b hover:bg-gray-50">
              <td className="p-3">{r.reportedBy?.username || 'N/A'}</td>
              <td className="p-3">{r.reason}</td>
              <td className="p-3">{r.details || '-'}</td>
              <td className="p-3">{r.resolved ? 'Yes' : 'No'}</td>
              <td className="p-3">
                {!r.resolved && (
                  <button
                    onClick={() => resolveReport(r._id)}
                    className="px-3 py-1 rounded bg-green-600 text-white"
                  >
                    Mark Resolved
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="mt-4 flex justify-center space-x-2">
        <button
          disabled={page <= 1}
          onClick={() => setPage(page - 1)}
          className="px-3 py-1 rounded bg-gray-300 disabled:opacity-50"
        >
          Prev
        </button>
        <span className="px-3 py-1">{page} / {pages}</span>
        <button
          disabled={page >= pages}
          onClick={() => setPage(page + 1)}
          className="px-3 py-1 rounded bg-gray-300 disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
}
