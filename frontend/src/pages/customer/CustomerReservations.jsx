import { CalendarPlus } from 'lucide-react';
import { useEffect, useState } from 'react';
import { api } from '../../api/http.js';
import EmptyState from '../../components/EmptyState.jsx';
import Notice from '../../components/Notice.jsx';
import PageHeader from '../../components/PageHeader.jsx';
import StatusBadge from '../../components/StatusBadge.jsx';

const initialForm = {
  vehicleId: '',
  start_date: '',
  end_date: ''
};

export default function CustomerReservations() {
  const [vehicles, setVehicles] = useState([]);
  const [reservations, setReservations] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  async function loadData() {
    const [vehicleData, reservationData] = await Promise.all([
      api.get('/vehicles/available'),
      api.get('/reservations')
    ]);
    setVehicles(vehicleData.vehicles);
    setReservations(reservationData.reservations);
  }

  useEffect(() => {
    loadData()
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  function updateField(event) {
    setForm({ ...form, [event.target.name]: event.target.value });
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setMessage('');
    setError('');

    try {
      await api.post('/reservations', form);
      setForm(initialForm);
      setMessage('Reservation request sent.');
      await loadData();
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <>
      <PageHeader
        title="My reservations"
        description="Choose an available vehicle and send a reservation request."
      />

      <Notice message={message} />
      <Notice type="error" message={error} />

      <section className="panel mb-8 p-5">
        <form className="grid gap-4 md:grid-cols-[1.3fr_1fr_1fr_auto]" onSubmit={handleSubmit}>
          <div>
            <label className="label">Vehicle</label>
            <select className="field" name="vehicleId" value={form.vehicleId} onChange={updateField}>
              <option value="">Select vehicle</option>
              {vehicles.map((vehicle) => (
                <option key={vehicle.vehicleId} value={vehicle.vehicleId}>
                  {vehicle.plate_number} - {vehicle.brand} {vehicle.model}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="label">Start date</label>
            <input className="field" type="date" name="start_date" value={form.start_date} onChange={updateField} />
          </div>
          <div>
            <label className="label">End date</label>
            <input className="field" type="date" name="end_date" value={form.end_date} onChange={updateField} />
          </div>
          <div className="flex items-end">
            <button className="btn w-full">
              <CalendarPlus size={16} />
              Reserve
            </button>
          </div>
        </form>
      </section>

      {loading ? (
        <p className="text-sm text-neutral-500">Loading reservations...</p>
      ) : reservations.length === 0 ? (
        <EmptyState title="No reservations yet" text="Your submitted reservations will appear here." />
      ) : (
        <div className="panel overflow-x-auto">
          <table className="w-full min-w-[760px] border-collapse">
            <thead>
              <tr className="table-head">
                <th className="px-4 py-3">Vehicle</th>
                <th className="px-4 py-3">Type</th>
                <th className="px-4 py-3">Start</th>
                <th className="px-4 py-3">End</th>
                <th className="px-4 py-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {reservations.map((reservation) => (
                <tr key={reservation.reserveId}>
                  <td className="table-cell">
                    {reservation.plate_number} - {reservation.brand} {reservation.model}
                  </td>
                  <td className="table-cell">{reservation.vehicle_type}</td>
                  <td className="table-cell">{reservation.start_date}</td>
                  <td className="table-cell">{reservation.end_date}</td>
                  <td className="table-cell">
                    <StatusBadge>{reservation.reservation_status}</StatusBadge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}

