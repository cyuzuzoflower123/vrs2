import express from 'express';
import { pool } from '../config/db.js';
import { requireAdmin, requireAuth, requireCustomer } from '../middleware/auth.js';
import { isValidDateRange, requiredFields } from '../utils/validators.js';

const router = express.Router();

router.get('/', requireAuth, async (req, res, next) => {
  try {
    const params = [];
    let whereClause = '';

    if (req.session.user.role === 'customer') {
      whereClause = 'WHERE r.customerId = ?';
      params.push(req.session.user.customerId);
    }

    const [reservations] = await pool.execute(
      `SELECT r.reserveId,
              DATE_FORMAT(r.reservation_Date, '%Y-%m-%d') AS reservation_Date,
              DATE_FORMAT(r.start_date, '%Y-%m-%d') AS start_date,
              DATE_FORMAT(r.end_date, '%Y-%m-%d') AS end_date,
              DATE_FORMAT(r.rental_date, '%Y-%m-%d') AS rental_date,
              r.rental_fee,
              r.rental_status,
              r.reservation_status,
              c.full_name, c.national_ID, c.phone,
              v.vehicleId, v.plate_number, v.brand, v.model, v.year, v.vehicle_type
       FROM reservation_rental r
       INNER JOIN customer c ON c.customerId = r.customerId
       INNER JOIN vehicle v ON v.vehicleId = r.vehicleId
       ${whereClause}
       ORDER BY r.reserveId DESC`,
      params
    );

    res.json({ reservations });
  } catch (error) {
    next(error);
  }
});

router.post('/', requireCustomer, async (req, res, next) => {
  const missing = requiredFields(req.body, ['vehicleId', 'start_date', 'end_date']);

  if (missing.length > 0) {
    return res.status(400).json({ message: `Missing fields: ${missing.join(', ')}` });
  }

  if (!isValidDateRange(req.body.start_date, req.body.end_date)) {
    return res.status(400).json({ message: 'Start date must be before or equal to end date' });
  }

  try {
    const [vehicles] = await pool.execute(
      "SELECT vehicleId FROM vehicle WHERE vehicleId = ? AND status = 'available'",
      [req.body.vehicleId]
    );

    if (!vehicles[0]) {
      return res.status(400).json({ message: 'Vehicle is not available' });
    }

    await pool.execute(
      `INSERT INTO reservation_rental
       (customerId, vehicleId, reservation_Date, start_date, end_date, reservation_status, rental_date)
       VALUES (?, ?, CURDATE(), ?, ?, 'pending', ?)`,
      [
        req.session.user.customerId,
        req.body.vehicleId,
        req.body.start_date,
        req.body.end_date,
        req.body.start_date
      ]
    );

    res.status(201).json({ message: 'Reservation created successfully' });
  } catch (error) {
    next(error);
  }
});

router.patch('/:id/status', requireAdmin, async (req, res, next) => {
  const allowedStatuses = ['pending', 'approved', 'rejected', 'completed', 'cancelled'];

  if (!allowedStatuses.includes(req.body.reservation_status)) {
    return res.status(400).json({ message: 'Invalid reservation status' });
  }

  try {
    await pool.execute('UPDATE reservation_rental SET reservation_status = ? WHERE reserveId = ?', [
      req.body.reservation_status,
      req.params.id
    ]);

    res.json({ message: 'Reservation status updated successfully' });
  } catch (error) {
    next(error);
  }
});

router.patch('/:id/rental', requireAdmin, async (req, res, next) => {
  const allowedStatuses = ['not_started', 'active', 'returned', 'cancelled'];
  const rentalStatus = req.body.rental_status || 'not_started';
  const rentalFee = Number(req.body.rental_fee || 0);
  const rentalDate = req.body.rental_date || null;

  if (!allowedStatuses.includes(rentalStatus)) {
    return res.status(400).json({ message: 'Invalid rental status' });
  }

  if (Number.isNaN(rentalFee) || rentalFee < 0) {
    return res.status(400).json({ message: 'Rental fee must be zero or higher' });
  }

  try {
    await pool.execute(
      `UPDATE reservation_rental
       SET rental_date = ?, rental_fee = ?, rental_status = ?
       WHERE reserveId = ?`,
      [rentalDate, rentalFee, rentalStatus, req.params.id]
    );

    res.json({ message: 'Rental details updated successfully' });
  } catch (error) {
    next(error);
  }
});

router.delete('/:id', requireAdmin, async (req, res, next) => {
  try {
    await pool.execute('DELETE FROM reservation_rental WHERE reserveId = ?', [req.params.id]);
    res.json({ message: 'Reservation deleted successfully' });
  } catch (error) {
    next(error);
  }
});

export default router;
