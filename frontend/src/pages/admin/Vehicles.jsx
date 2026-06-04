import { Plus, Save, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { api } from '../../api/http.js';
import EmptyState from '../../components/EmptyState.jsx';
import Notice from '../../components/Notice.jsx';
import PageHeader from '../../components/PageHeader.jsx';
import StatusBadge from '../../components/StatusBadge.jsx';

const blankVehicle = {
  plate_number: '',
  brand: '',
  model: '',
  year: new Date().getFullYear(),
  vehicle_type: '',
  purchase_price: '',
  status: 'available'
};

const statuses = ['available', 'reserved', 'rented', 'maintenance'];

export default function Vehicles() {
  const [vehicles, setVehicles] = useState([]);
  const [form, setForm] = useState(blankVehicle);
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  async function loadVehicles() {
    const data = await api.get('/vehicles');
    setVehicles(data.vehicles);
  }

  useEffect(() => {
    loadVehicles()
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  function updateField(event) {
    setForm({ ...form, [event.target.name]: event.target.value });
  }

  function startCreate() {
    setEditingId(null);
    setForm(blankVehicle);
    setShowForm(true);
    setMessage('');
    setError('');
  }

  function startEdit(vehicle) {
    setEditingId(vehicle.vehicleId);
    setForm({
      plate_number: vehicle.plate_number,
      brand: vehicle.brand,
      model: vehicle.model,
      year: vehicle.year,
      vehicle_type: vehicle.vehicle_type,
      purchase_price: vehicle.purchase_price,
      status: vehicle.status
    });
    setShowForm(true);
    setMessage('');
    setError('');
  }

  function closeForm() {
    setShowForm(false);
    setEditingId(null);
    setForm(blankVehicle);
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setMessage('');
    setError('');

    try {
      if (editingId) {
        await api.put(`/vehicles/${editingId}`, form);
        setMessage('Vehicle updated.');
      } else {
        await api.post('/vehicles', form);
        setMessage('Vehicle added.');
      }

      closeForm();
      await loadVehicles();
    } catch (err) {
      setError(err.message);
    }
  }

  async function deleteVehicle(id) {
    setMessage('');
    setError('');

    if (!confirm('Delete this vehicle?')) {
      return;
    }

    try {
      await api.delete(`/vehicles/${id}`);
      setMessage('Vehicle deleted.');
      await loadVehicles();
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <>
      <PageHeader
        title="Vehicles"
        description="Add and maintain the fleet."
        action={
          <button className="btn" onClick={startCreate}>
            <Plus size={16} />
            Add vehicle
          </button>
        }
      />

      <Notice message={message} />
      <Notice type="error" message={error} />

      {showForm && (
        <section className="panel mb-8 p-5">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-base font-semibold">{editingId ? 'Edit vehicle' : 'New vehicle'}</h2>
            <button className="btn-light" onClick={closeForm}>
              <X size={16} />
              Close
            </button>
          </div>
          <form className="grid gap-4 md:grid-cols-4" onSubmit={handleSubmit}>
            <div>
              <label className="label">Plate number</label>
              <input className="field" name="plate_number" value={form.plate_number} onChange={updateField} />
            </div>
            <div>
              <label className="label">Brand</label>
              <input className="field" name="brand" value={form.brand} onChange={updateField} />
            </div>
            <div>
              <label className="label">Model</label>
              <input className="field" name="model" value={form.model} onChange={updateField} />
            </div>
            <div>
              <label className="label">Year</label>
              <input className="field" name="year" type="number" value={form.year} onChange={updateField} />
            </div>
            <div>
              <label className="label">Type</label>
              <input className="field" name="vehicle_type" value={form.vehicle_type} onChange={updateField} />
            </div>
            <div>
              <label className="label">Purchase price</label>
              <input
                className="field"
                name="purchase_price"
                type="number"
                step="0.01"
                value={form.purchase_price}
                onChange={updateField}
              />
            </div>
            <div>
              <label className="label">Status</label>
              <select className="field" name="status" value={form.status} onChange={updateField}>
                {statuses.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex items-end">
              <button className="btn w-full">
                <Save size={16} />
                Save
              </button>
            </div>
          </form>
        </section>
      )}

      {loading ? (
        <p className="text-sm text-neutral-500">Loading vehicles...</p>
      ) : vehicles.length === 0 ? (
        <EmptyState title="No vehicles" text="Add the first vehicle to begin." />
      ) : (
        <div className="panel overflow-x-auto">
          <table className="w-full min-w-[900px] border-collapse">
            <thead>
              <tr className="table-head">
                <th className="px-4 py-3">Plate</th>
                <th className="px-4 py-3">Vehicle</th>
                <th className="px-4 py-3">Year</th>
                <th className="px-4 py-3">Type</th>
                <th className="px-4 py-3">Price</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {vehicles.map((vehicle) => (
                <tr key={vehicle.vehicleId}>
                  <td className="table-cell font-medium">{vehicle.plate_number}</td>
                  <td className="table-cell">
                    {vehicle.brand} {vehicle.model}
                  </td>
                  <td className="table-cell">{vehicle.year}</td>
                  <td className="table-cell">{vehicle.vehicle_type}</td>
                  <td className="table-cell">${Number(vehicle.purchase_price).toLocaleString()}</td>
                  <td className="table-cell">
                    <StatusBadge>{vehicle.status}</StatusBadge>
                  </td>
                  <td className="table-cell">
                    <div className="flex gap-2">
                      <button className="btn-light" onClick={() => startEdit(vehicle)}>
                        Edit
                      </button>
                      <button className="btn-light" onClick={() => deleteVehicle(vehicle.vehicleId)}>
                        Delete
                      </button>
                    </div>
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

