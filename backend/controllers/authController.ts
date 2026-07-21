import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import User from '../models/User';
import { generateToken } from '../utils/tokenHelper';
import { uploadToCloudinary } from '../utils/cloudinaryHelper';
import { AuthRequest } from '../middleware/authMiddleware';

/**
 * Registers a new user. The first registered user is automatically assigned the 'admin' role.
 * @param req - Express request object containing name, email, and password
 * @param res - Express response object
 * @param next - Next function callback
 */
export const register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide all details' });
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ success: false, message: 'User already exists with this email' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Make first registered user an Admin for testing ease
    const userCount = await User.countDocuments({});
    const role = userCount === 0 ? 'admin' : 'user';

    const defaultAvatar = `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(name)}`;

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role,
      avatar: defaultAvatar,
    });

    const token = generateToken(user._id.toString(), user.role);

    res.status(201).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Logins an existing user by verifying credentials and returning a JWT token.
 * @param req - Express request object containing email and password
 * @param res - Express response object
 * @param next - Next function callback
 */
export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please enter email and password' });
    }

    const user = await User.findOne({ email });
    if (!user || !user.password) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const token = generateToken(user._id.toString(), user.role);

    res.status(200).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Retrieves the current logged in user's profile based on the JWT payload.
 * @param req - AuthRequest object containing current user identity
 * @param res - Express response object
 * @param next - Next function callback
 */
export const getMe = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Updates the profile of the current logged in user (name, password, avatar).
 * @param req - AuthRequest object containing new profile fields and optional avatar file
 * @param res - Express response object
 * @param next - Next function callback
 */
export const updateProfile = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { name, password } = req.body;
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    if (name) user.name = name;

    if (password) {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);
    }

    if (req.file) {
      const avatarUrl = await uploadToCloudinary(req.file.path, 'image');
      user.avatar = avatarUrl;
    }

    await user.save();

    res.status(200).json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
      },
    });
  } catch (error) {
    next(error);
  }
};
