import jwt from 'jsonwebtoken';

export const generateToken = (id: string, role: string): string => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET || 'spotify_clone_secret_key_123', {
    expiresIn: '30d',
  });
};
