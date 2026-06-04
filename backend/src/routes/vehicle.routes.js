import express from 'express';
import { pool } from '../config/db.js';
import { requireAdmin, requireAuth } from '../middleware/auth.js';
import { requiredFields } from '../utils/validators.js';

const router = express.Router();

router.get('/available', requireAuth, async (req, res, next) => {
  try {
    const [vehicles] = await pool.execute(
      `SELECT vehicleId, plate_number, brand, model, year, vehicle_type, purchase_price, status
       FROM vehicle
       WHERE status = 'available'
       ORDER BY brand, model`
    );

    res.json({ vehicles });
  } catch (error) {
    next(error);
  }
});

router.get('/', requireAdmin, async (req, res, next) => {
  try {
    const [vehicles] = await pool.execute(
      `SELECT vehicleId, plate_number, brand, model, year, vehicle_type, purchase_price, status
       FROM vehicle
       ORDER BY vehicleId DESC`
    );

    res.json({ vehicles });
  } catch (error) {
    next(error);
  }
});

router.post('/', requireAdmin, async (req, res, next) => {
  const missing = requiredFields(req.body, [
    'plate_number',
    'brand',
    'model',
    'year',
    'vehicle_type',
    'purchase_price',
    'status'
  ]);

  if (missing.length > 0) {
    return res.status(400).json({ message: `Missing fields: ${missing.join(', ')}` });
  }

  try {
    await pool.execute(
      `INSERT INTO vehicle (plate_number, brand, model, year, vehicle_type, purchase_price, status)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        req.body.plate_number,
        req.body.brand,
        req.body.model,
        req.body.year,
        req.body.vehicle_type,
        req.body.purchase_price,
        req.body.status
      ]
    );

    res.status(201).json({ message: 'Vehicle added successfully' });
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ message: 'Plate number already exists' });
    }

    next(error);
  }
});

router.put('/:id', requireAdmin, async (req, res, next) => {
  const missing = requiredFields(req.body, [
    'plate_number',
    'brand',
    'model',
    'year',
    'vehicle_type',
    'purchase_price',
    'status'
  ]);

  if (missing.length > 0) {
    return res.status(400).json({ message: `Missing fields: ${missing.join(', ')}` });
  }

  try {
    await pool.execute(
      `UPDATE vehicle
       SET plate_number = ?, brand = ?, model = ?, year = ?, vehicle_type = ?, purchase_price = ?, status = ?
       WHERE vehicleId = ?`,
      [
        req.body.plate_number,
        req.body.brand,
        req.body.model,
        req.body.year,
        req.body.vehicle_type,
        req.body.purchase_price,
        req.body.status,
        req.params.id
      ]
    );

    res.json({ message: 'Vehicle updated successfully' });
  } catch (error) {
    next(error);
  }
});

router.delete('/:id', requireAdmin, async (req, res, next) => {
  try {
    await pool.execute('DELETE FROM vehicle WHERE vehicleId = ?', [req.params.id]);
    res.json({ message: 'Vehicle deleted successfully' });
  } catch (error) {
    next(error);
  }
});

export default router;

