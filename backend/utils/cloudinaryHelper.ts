import { cloudinary, isCloudinaryConfigured } from '../config/cloudinary';
import fs from 'fs';

export const uploadToCloudinary = async (
  filePath: string,
  resourceType: 'image' | 'video' | 'raw' | 'auto'
): Promise<string> => {
  const fileName = filePath.split(/[\\/]/).pop();
  const fallbackUrl = `/uploads/${fileName}`;

  if (!isCloudinaryConfigured) {
    console.log(`Cloudinary is not configured. File stored locally: ${fallbackUrl}`);
    return fallbackUrl;
  }

  try {
    const result = await cloudinary.uploader.upload(filePath, {
      folder: 'spotify_clone',
      resource_type: resourceType,
    });

    // Delete local temporary file
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    return result.secure_url;
  } catch (error) {
    console.error('Cloudinary upload failed, using local fallback:', error);
    return fallbackUrl;
  }
};
