import { useEffect, useState } from 'react';
import { api } from '../../api/http.js';
import EmptyState from '../../components/EmptyState.jsx';
import Notice from '../../components/Notice.jsx';
import PageHeader from '../../components/PageHeader.jsx';

export default function Customers() {
  const [customers, setCustomers] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get('/customers')
      .then((data) => setCustomers(data.customers))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <PageHeader title="Customers" description="Registered customers from signup." />
      <Notice type="error" message={error} />
      {loading ? (
        <p className="text-sm text-neutral-500">Loading customers...</p>
      ) : customers.length === 0 ? (
        <EmptyState title="No customers" text="Customer accounts will appear here after signup." />
      ) : (
        <div className="panel overflow-x-auto">
          <table className="w-full min-w-[820px] border-collapse">
            <thead>
              <tr className="table-head">
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">National ID</th>
                <th className="px-4 py-3">Phone</th>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">Address</th>
                <th className="px-4 py-3">Username</th>
              </tr>
            </thead>
            <tbody>
              {customers.map((customer) => (
                <tr key={customer.customerId}>
                  <td className="table-cell font-medium">{customer.full_name}</td>
                  <td className="table-cell">{customer.national_ID}</td>
                  <td className="table-cell">{customer.phone}</td>
                  <td className="table-cell">{customer.email}</td>
                  <td className="table-cell">{customer.address}</td>
                  <td className="table-cell">{customer.username}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}

