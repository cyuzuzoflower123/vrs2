import express from 'express';
import bcrypt from 'bcryptjs';
import { pool } from '../config/db.js';
import { requiredFields } from '../utils/validators.js';

const router = express.Router();

router.post('/signup', async (req, res, next) => {
  const missing = requiredFields(req.body, [
    'username',
    'password',
    'gender',
    'full_name',
    'national_ID',
    'phone',
    'email',
    'address'
  ]);

  if (missing.length > 0) {
    return res.status(400).json({ message: `Missing fields: ${missing.join(', ')}` });
  }

  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();

    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    const [userResult] = await connection.execute(
      'INSERT INTO user (username, password, gender, role) VALUES (?, ?, ?, ?)',
      [req.body.username, hashedPassword, req.body.gender, 'customer']
    );

    await connection.execute(
      `INSERT INTO customer (userId, full_name, national_ID, phone, email, address)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [
        userResult.insertId,
        req.body.full_name,
        req.body.national_ID,
        req.body.phone,
        req.body.email,
        req.body.address
      ]
    );

    await connection.commit();
    res.status(201).json({ message: 'Account created successfully' });
  } catch (error) {
    await connection.rollback();

    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ message: 'Username, national ID, or email already exists' });
    }

    next(error);
  } finally {
    connection.release();
  }
});

router.post('/login', async (req, res, next) => {
  const missing = requiredFields(req.body, ['username', 'password']);

  if (missing.length > 0) {
    return res.status(400).json({ message: `Missing fields: ${missing.join(', ')}` });
  }

  try {
    const [users] = await pool.execute('SELECT * FROM user WHERE username = ?', [req.body.username]);
    const user = users[0];

    if (!user) {
      return res.status(401).json({ message: 'Invalid username or password' });
    }

    const hasBcryptPassword = user.password.startsWith('$2a$') || user.password.startsWith('$2b$');
    const passwordMatches = hasBcryptPassword
      ? await bcrypt.compare(req.body.password, user.password)
      : req.body.password === user.password;

    if (!passwordMatches) {
      return res.status(401).json({ message: 'Invalid username or password' });
    }

    if (!hasBcryptPassword) {
      const upgradedPassword = await bcrypt.hash(req.body.password, 10);
      await pool.execute('UPDATE user SET password = ? WHERE userId = ?', [
        upgradedPassword,
        user.userId
      ]);
    }

    let customerId = null;

    if (user.role === 'customer') {
      const [customers] = await pool.execute('SELECT customerId FROM customer WHERE userId = ?', [
        user.userId
      ]);
      customerId = customers[0]?.customerId || null;
    }

    req.session.user = {
      userId: user.userId,
      username: user.username,
      role: user.role,
      customerId
    };

    res.json({ user: req.session.user });
  } catch (error) {
    next(error);
  }
});

router.get('/me', (req, res) => {
  res.json({ user: req.session.user || null });
});

router.post('/logout', (req, res) => {
  req.session.destroy(() => {
    res.clearCookie('swift_wheels_session');
    res.json({ message: 'Logged out successfully' });
  });
});

export default router;
