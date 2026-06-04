import { Printer } from 'lucide-react';
import { useEffect, useState } from 'react';
import { api } from '../../api/http.js';
import EmptyState from '../../components/EmptyState.jsx';
import Notice from '../../components/Notice.jsx';
import PageHeader from '../../components/PageHeader.jsx';
import StatusBadge from '../../components/StatusBadge.jsx';

function formatMoney(value) {
  return Number(value || 0).toLocaleString(undefined, {
    style: 'currency',
    currency: 'USD'
  });
}

function show(value) {
  return value || '-';
}

export default function Report() {
  const [reportRows, setReportRows] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get('/reservations')
      .then((data) => setReportRows(data.reservations))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <PageHeader
        title="Report"
        description="Customer rental and reservation report."
        action={
          <button className="btn print:hidden" onClick={() => window.print()} disabled={loading || reportRows.length === 0}>
            <Printer size={16} />
            Print report
          </button>
        }
      />
      <Notice type="error" message={error} />

      {loading ? (
        <p className="text-sm text-neutral-500">Loading report...</p>
      ) : reportRows.length === 0 ? (
        <EmptyState title="No report data" text="Customer reservations will appear here." />
      ) : (
        <section className="print-area">
          <div className="mb-5 hidden print:block">
            <h1 className="text-xl font-bold text-black">Swift Wheels Rental Report</h1>
            <p className="mt-1 text-sm text-neutral-600">Printed on {new Date().toLocaleDateString()}</p>
          </div>
          <div className="panel overflow-x-auto print:overflow-visible print:border-0">
          <table className="w-full min-w-[1100px] border-collapse">
            <thead>
              <tr className="table-head">
                <th className="px-4 py-3">Customer full name</th>
                <th className="px-4 py-3">National ID</th>
                <th className="px-4 py-3">Phone number</th>
                <th className="px-4 py-3">Reservation date</th>
                <th className="px-4 py-3">Rental date</th>
                <th className="px-4 py-3">Reservation status</th>
                <th className="px-4 py-3">Return date</th>
                <th className="px-4 py-3">Rental fee</th>
              </tr>
            </thead>
            <tbody>
              {reportRows.map((row) => (
                <tr key={row.reserveId}>
                  <td className="table-cell font-medium">{row.full_name}</td>
                  <td className="table-cell">{row.national_ID}</td>
                  <td className="table-cell">{row.phone}</td>
                  <td className="table-cell">{show(row.reservation_Date)}</td>
                  <td className="table-cell">{show(row.rental_date)}</td>
                  <td className="table-cell">
                    <StatusBadge>{row.reservation_status}</StatusBadge>
                  </td>
                  <td className="table-cell">{show(row.end_date)}</td>
                  <td className="table-cell">{formatMoney(row.rental_fee)}</td>
                </tr>
              ))}
            </tbody>
          </table>
          </div>
        </section>
      )}
    </>
  );
}
