import jwt from 'jsonwebtoken';

/**
 * Generates a signed JSON Web Token (JWT) containing user ID and role details.
 * Expired duration is set to 30 days.
 * @param id - The user ID to include in the token payload
 * @param role - The user's role ('user' | 'admin') to include in the token payload
 * @returns Signed JWT string
 */
export const generateToken = (id: string, role: string): string => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET || 'spotify_clone_secret_key_123', {
    expiresIn: '30d',
  });
};
