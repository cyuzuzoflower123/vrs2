export function requireAuth(req, res, next) {
  if (!req.session.user) {
    return res.status(401).json({ message: 'Please login first' });
  }

  next();
}

export function requireAdmin(req, res, next) {
  if (!req.session.user) {
    return res.status(401).json({ message: 'Please login first' });
  }

  if (req.session.user.role !== 'admin') {
    return res.status(403).json({ message: 'Admin access only' });
  }

  next();
}

export function requireCustomer(req, res, next) {
  if (!req.session.user) {
    return res.status(401).json({ message: 'Please login first' });
  }

  if (req.session.user.role !== 'customer') {
    return res.status(403).json({ message: 'Customer access only' });
  }

  next();
}

