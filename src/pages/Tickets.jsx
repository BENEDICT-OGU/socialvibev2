import React, { useEffect, useState } from 'react';
import api from '../api';

export default function Tickets() {
  const [tickets, setTickets] = useState([]);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);

  useEffect(() => {
    fetchTickets(page);
  }, [page]);

  const fetchTickets = async (page) => {
    try {
      const res = await api.get('/tickets', { params: { page } });
      setTickets(res.data.tickets);
      setPages(res.data.pages);
    } catch {
      alert('Failed to fetch tickets');
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Support Tickets</h2>
      <table className="min-w-full bg-white rounded shadow overflow-hidden">
        <thead className="bg-gray-200 text-left">
          <tr>
            <th className="p-3">User</th>
            <th className="p-3">Subject</th>
            <th className="p-3">Message</th>
            <th className="p-3">Status</th>
            <th className="p-3">Created At</th>
          </tr>
        </thead>
        <tbody>
          {tickets.map(t => (
            <tr key={t._id} className="border-b hover:bg-gray-50">
              <td className="p-3">{t.user?.username || 'N/A'}</td>
              <td className="p-3">{t.subject}</td>
              <td className="p-3">{t.message}</td>
              <td className="p-3 capitalize">{t.status}</td>
              <td className="p-3">{new Date(t.createdAt).toLocaleString()}</td>
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
