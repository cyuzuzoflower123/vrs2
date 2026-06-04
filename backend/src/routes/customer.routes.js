import express from 'express';
import { pool } from '../config/db.js';
import { requireAdmin } from '../middleware/auth.js';

const router = express.Router();

router.get('/', requireAdmin, async (req, res, next) => {
  try {
    const [customers] = await pool.execute(
      `SELECT c.customerId, c.full_name, c.national_ID, c.phone, c.email, c.address,
              u.username, u.gender
       FROM customer c
       INNER JOIN user u ON u.userId = c.userId
       ORDER BY c.customerId DESC`
    );

    res.json({ customers });
  } catch (error) {
    next(error);
  }
});

export default router;

