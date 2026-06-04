import { useEffect, useState } from 'react';
import { api } from '../../api/http.js';
import EmptyState from '../../components/EmptyState.jsx';
import Notice from '../../components/Notice.jsx';
import PageHeader from '../../components/PageHeader.jsx';
import StatusBadge from '../../components/StatusBadge.jsx';

const statuses = ['pending', 'approved', 'rejected', 'completed', 'cancelled'];
const rentalStatuses = ['not_started', 'active', 'returned', 'cancelled'];

export default function Reservations() {
  const [reservations, setReservations] = useState([]);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  async function loadReservations() {
    const data = await api.get('/reservations');
    setReservations(data.reservations);
  }

  useEffect(() => {
    loadReservations()
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  async function updateStatus(id, status) {
    setMessage('');
    setError('');

    try {
      await api.patch(`/reservations/${id}/status`, { reservation_status: status });
      setMessage('Reservation status updated.');
      await loadReservations();
    } catch (err) {
      setError(err.message);
    }
  }

  async function updateRentalDetails(reservation) {
    setMessage('');
    setError('');

    try {
      await api.patch(`/reservations/${reservation.reserveId}/rental`, {
        rental_date: reservation.rental_date || null,
        rental_fee: reservation.rental_fee || 0,
        rental_status: reservation.rental_status || 'not_started'
      });
      setMessage('Rental details updated.');
      await loadReservations();
    } catch (err) {
      setError(err.message);
    }
  }

  function updateReservationField(id, field, value) {
    setReservations((currentReservations) =>
      currentReservations.map((reservation) =>
        reservation.reserveId === id ? { ...reservation, [field]: value } : reservation
      )
    );
  }

  async function deleteReservation(id) {
    setMessage('');
    setError('');

    if (!confirm('Delete this reservation?')) {
      return;
    }

    try {
      await api.delete(`/reservations/${id}`);
      setMessage('Reservation deleted.');
      await loadReservations();
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <>
      <PageHeader title="Reservations" description="Review customer reservation requests." />
      <Notice message={message} />
      <Notice type="error" message={error} />
      {loading ? (
        <p className="text-sm text-neutral-500">Loading reservations...</p>
      ) : reservations.length === 0 ? (
        <EmptyState title="No reservations" text="Customer requests will appear here." />
      ) : (
        <div className="panel overflow-x-auto">
          <table className="w-full min-w-[1180px] border-collapse">
            <thead>
              <tr className="table-head">
                <th className="px-4 py-3">Customer</th>
                <th className="px-4 py-3">Vehicle</th>
                <th className="px-4 py-3">Dates</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Change status</th>
                <th className="px-4 py-3">Rental details</th>
                <th className="px-4 py-3">Action</th>
              </tr>
            </thead>
            <tbody>
              {reservations.map((reservation) => (
                <tr key={reservation.reserveId}>
                  <td className="table-cell">
                    <div className="font-medium">{reservation.full_name}</div>
                    <div className="text-xs text-neutral-500">{reservation.phone}</div>
                  </td>
                  <td className="table-cell">
                    {reservation.plate_number} - {reservation.brand} {reservation.model}
                  </td>
                  <td className="table-cell">
                    {reservation.start_date} to {reservation.end_date}
                  </td>
                  <td className="table-cell">
                    <StatusBadge>{reservation.reservation_status}</StatusBadge>
                  </td>
                  <td className="table-cell">
                    <select
                      className="field"
                      value={reservation.reservation_status}
                      onChange={(event) => updateStatus(reservation.reserveId, event.target.value)}
                    >
                      {statuses.map((status) => (
                        <option key={status} value={status}>
                          {status}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="table-cell">
                    <div className="grid min-w-[340px] grid-cols-[1fr_1fr] gap-2">
                      <input
                        className="field"
                        type="date"
                        value={reservation.rental_date || ''}
                        onChange={(event) =>
                          updateReservationField(reservation.reserveId, 'rental_date', event.target.value)
                        }
                      />
                      <input
                        className="field"
                        type="number"
                        min="0"
                        step="0.01"
                        value={reservation.rental_fee || ''}
                        placeholder="Fee"
                        onChange={(event) =>
                          updateReservationField(reservation.reserveId, 'rental_fee', event.target.value)
                        }
                      />
                      <select
                        className="field"
                        value={reservation.rental_status || 'not_started'}
                        onChange={(event) =>
                          updateReservationField(reservation.reserveId, 'rental_status', event.target.value)
                        }
                      >
                        {rentalStatuses.map((status) => (
                          <option key={status} value={status}>
                            {status}
                          </option>
                        ))}
                      </select>
                      <button className="btn-light" onClick={() => updateRentalDetails(reservation)}>
                        Save rental
                      </button>
                    </div>
                  </td>
                  <td className="table-cell">
                    <button className="btn-light" onClick={() => deleteReservation(reservation.reserveId)}>
                      Delete
                    </button>
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
