import { Car, ClipboardList, Users } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../api/http.js';
import Notice from '../../components/Notice.jsx';
import PageHeader from '../../components/PageHeader.jsx';

export default function AdminDashboard() {
  const [stats, setStats] = useState({ vehicles: 0, customers: 0, reservations: 0 });
  const [error, setError] = useState('');

  useEffect(() => {
    Promise.all([api.get('/vehicles'), api.get('/customers'), api.get('/reservations')])
      .then(([vehicleData, customerData, reservationData]) => {
        setStats({
          vehicles: vehicleData.vehicles.length,
          customers: customerData.customers.length,
          reservations: reservationData.reservations.length
        });
      })
      .catch((err) => setError(err.message));
  }, []);

  const cards = [
    { label: 'Vehicles', value: stats.vehicles, to: '/admin/vehicles', icon: Car },
    { label: 'Customers', value: stats.customers, to: '/admin/customers', icon: Users },
    { label: 'Reservations', value: stats.reservations, to: '/admin/reservations', icon: ClipboardList }
  ];

  return (
    <>
      <PageHeader title="Admin dashboard" description="Manage the Swift Wheels rental workflow." />
      <Notice type="error" message={error} />
      <div className="grid gap-4 md:grid-cols-3">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <Link key={card.label} to={card.to} className="panel block p-5 transition hover:border-black">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-neutral-500">{card.label}</p>
                  <p className="mt-2 text-3xl font-bold text-black">{card.value}</p>
                </div>
                <Icon size={28} />
              </div>
            </Link>
          );
        })}
      </div>
    </>
  );
}

