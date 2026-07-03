import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { asyncHandler } from '../middleware/errorMiddleware.js';

const createToken = (userId) =>
  jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });

const sendAuthResponse = (res, user, statusCode = 200) => {
  res.status(statusCode).json({
    token: createToken(user._id),
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      addresses: user.addresses,
      createdAt: user.createdAt,
    },
  });
};

export const register = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password || password.length < 6) {
    res.status(400);
    throw new Error('Name, email, and a 6+ character password are required.');
  }

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    res.status(409);
    throw new Error('An account with this email already exists.');
  }

  const user = await User.create({ name, email, password });
  sendAuthResponse(res, user, 201);
});

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400);
    throw new Error('Email and password are required.');
  }

  const user = await User.findOne({ email }).select('+password');

  if (!user || !(await user.comparePassword(password))) {
    res.status(401);
    throw new Error('Invalid email or password.');
  }

  sendAuthResponse(res, user);
});

export const getProfile = asyncHandler(async (req, res) => {
  res.json({
    id: req.user._id,
    name: req.user.name,
    email: req.user.email,
    role: req.user.role,
    addresses: req.user.addresses,
    createdAt: req.user.createdAt,
  });
});

export const updateProfile = asyncHandler(async (req, res) => {
  const { name, email, password, addresses } = req.body;
  const user = await User.findById(req.user._id).select('+password');

  if (email && email !== user.email) {
    const emailExists = await User.findOne({ email });
    if (emailExists) {
      res.status(409);
      throw new Error('This email is already used by another account.');
    }
    user.email = email;
  }

  if (name) user.name = name;
  if (password) user.password = password;
  if (Array.isArray(addresses)) user.addresses = addresses;

  await user.save();
  sendAuthResponse(res, user);
});
