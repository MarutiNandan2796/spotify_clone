import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import path from 'path';
import dotenv from 'dotenv';
import fs from 'fs';

// Configurations
dotenv.config();
import { connectDB } from './config/db';
import { errorHandler } from './middleware/errorMiddleware';

// Routes
import authRoutes from './routes/auth';
import songRoutes from './routes/songs';
import artistRoutes from './routes/artists';
import albumRoutes from './routes/albums';
import playlistRoutes from './routes/playlists';
import likeRoutes from './routes/likes';
import historyRoutes from './routes/history';
import searchRoutes from './routes/search';
import adminRoutes from './routes/admin';

// Connect to Database
connectDB();

const app = express();

// Security Middlewares
app.use(helmet({
  crossOriginResourcePolicy: false, // Essential to allow loading media files locally
}));

// CORS Configuration
const allowedOrigins = [
  'http://localhost:3000',
  'http://127.0.0.1:3000',
  process.env.FRONTEND_URL,
].filter(Boolean) as string[];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
  })
);

// Rate Limiter
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 1000, // Limit each IP to 1000 requests per window
  message: {
    success: false,
    message: 'Too many requests from this IP, please try again after 15 minutes',
  },
});
app.use('/api', limiter);

// Request Parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Create local uploads directory if it doesn't exist
const uploadsPath = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadsPath)) {
  fs.mkdirSync(uploadsPath, { recursive: true });
}

// Serve static uploads
app.use('/uploads', express.static(uploadsPath));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/songs', songRoutes);
app.use('/api/artists', artistRoutes);
app.use('/api/albums', albumRoutes);
app.use('/api/playlists', playlistRoutes);
app.use('/api/likes', likeRoutes);
app.use('/api/history', historyRoutes);
app.use('/api/search', searchRoutes);
app.use('/api/admin', adminRoutes);

// Base Route / Health Check
app.get('/', (req, res) => {
  res.status(200).json({
    message: 'Spotify Clone API is running successfully',
    environment: process.env.NODE_ENV || 'development',
  });
});

// Central Error Handler
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});
