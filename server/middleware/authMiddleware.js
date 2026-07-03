import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { asyncHandler } from './errorMiddleware.js';

export const protect = asyncHandler(async (req, res, next) => {
  const authHeader = req.headers.authorization || '';
  const token = authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;

  if (!token) {
    res.status(401);
    throw new Error('Not authorized. Please log in.');
  }

  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  const user = await User.findById(decoded.id);

  if (!user) {
    res.status(401);
    throw new Error('User no longer exists.');
  }

  req.user = user;
  next();
});
