import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
});

// Cloudinary upload options interface
export interface CloudinaryUploadOptions {
  folder?: string;
  public_id?: string;
  overwrite?: boolean;
  resource_type?: 'image' | 'video' | 'auto';
  transformation?: string;
  tags?: string[];
  context?: Record<string, string>;
}

// Cloudinary upload result interface
export interface CloudinaryUploadResult {
  public_id: string;
  secure_url: string;
  url: string;
  width: number;
  height: number;
  format: string;
  resource_type: string;
  bytes: number;
  created_at: string;
  etag: string;
  placeholder: boolean;
  version_id?: string;
  tags: string[];
}

// Cloudinary error interface
export interface CloudinaryError {
  message: string;
  http_code: number;
  request_id: string;
}

// Upload image to Cloudinary
export const uploadImage = async (
  file: File | string,
  options: CloudinaryUploadOptions = {}
): Promise<CloudinaryUploadResult> => {
  try {
    const uploadOptions = {
      folder: options.folder || 'luxiormall',
      resource_type: 'image' as const,
      overwrite: options.overwrite || false,
      transformation: options.transformation || 'f_auto,q_auto',
      tags: options.tags || ['luxiormall'],
      context: options.context || {},
      ...options,
    };

    let result: CloudinaryUploadResult;

    if (typeof file === 'string') {
      // Upload from URL
      result = await cloudinary.uploader.upload(file, uploadOptions);
    } else {
      // Upload from File object
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', process.env.CLOUDINARY_UPLOAD_PRESET || 'luxiormall_unsigned');
      
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
        {
          method: 'POST',
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error(`Upload failed: ${response.statusText}`);
      }

      result = await response.json();
    }

    return result;
  } catch (error) {
    console.error('Error uploading image to Cloudinary:', error);
    throw new Error(error instanceof Error ? error.message : 'Failed to upload image');
  }
};

// Upload video to Cloudinary
export const uploadVideo = async (
  file: File | string,
  options: CloudinaryUploadOptions = {}
): Promise<CloudinaryUploadResult> => {
  try {
    const uploadOptions = {
      folder: options.folder || 'luxiormall/videos',
      resource_type: 'video' as const,
      overwrite: options.overwrite || false,
      transformation: options.transformation || 'f_auto,q_auto',
      tags: options.tags || ['luxiormall', 'video'],
      context: options.context || {},
      ...options,
    };

    let result: CloudinaryUploadResult;

    if (typeof file === 'string') {
      // Upload from URL
      result = await cloudinary.uploader.upload(file, uploadOptions);
    } else {
      // Upload from File object
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', process.env.CLOUDINARY_UPLOAD_PRESET || 'luxiormall_unsigned');
      
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/video/upload`,
        {
          method: 'POST',
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error(`Upload failed: ${response.statusText}`);
      }

      result = await response.json();
    }

    return result;
  } catch (error) {
    console.error('Error uploading video to Cloudinary:', error);
    throw new Error(error instanceof Error ? error.message : 'Failed to upload video');
  }
};

// Delete asset from Cloudinary
export const deleteAsset = async (publicId: string): Promise<boolean> => {
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    return result.result === 'ok';
  } catch (error) {
    console.error('Error deleting asset from Cloudinary:', error);
    throw new Error(error instanceof Error ? error.message : 'Failed to delete asset');
  }
};

// Generate optimized image URL
export const getOptimizedImageUrl = (
  publicId: string,
  options: {
    width?: number;
    height?: number;
    quality?: number;
    format?: 'auto' | 'webp' | 'jpg' | 'png';
    crop?: 'fill' | 'scale' | 'fit' | 'thumb';
  } = {}
): string => {
  const {
    width,
    height,
    quality = 'auto',
    format = 'auto',
    crop = 'fill',
  } = options;

  let transformation = 'f_auto,q_auto';

  if (width && height) {
    transformation += `,c_${crop},w_${width},h_${height}`;
  } else if (width) {
    transformation += `,w_${width}`;
  } else if (height) {
    transformation += `,h_${height}`;
  }

  if (quality !== 'auto') {
    transformation += `,q_${quality}`;
  }

  if (format !== 'auto') {
    transformation += `,f_${format}`;
  }

  return cloudinary.url(publicId, {
    transformation: transformation,
    secure: true,
  });
};

// Generate thumbnail URL
export const getThumbnailUrl = (
  publicId: string,
  width: number = 300,
  height: number = 300
): string => {
  return cloudinary.url(publicId, {
    transformation: `c_thumb,w_${width},h_${height},f_auto,q_auto`,
    secure: true,
  });
};

// Generate responsive image URLs for different screen sizes
export const getResponsiveImageUrls = (
  publicId: string,
  baseWidth: number = 800
): {
  sm: string; // 640px
  md: string; // 768px
  lg: string; // 1024px
  xl: string; // 1280px
  '2xl': string; // 1536px
} => {
  return {
    sm: getOptimizedImageUrl(publicId, { width: Math.round(baseWidth * 0.5) }),
    md: getOptimizedImageUrl(publicId, { width: Math.round(baseWidth * 0.6) }),
    lg: getOptimizedImageUrl(publicId, { width: Math.round(baseWidth * 0.75) }),
    xl: getOptimizedImageUrl(publicId, { width: baseWidth }),
    '2xl': getOptimizedImageUrl(publicId, { width: Math.round(baseWidth * 1.25) }),
  };
};

// Upload multiple images
export const uploadMultipleImages = async (
  files: File[],
  options: CloudinaryUploadOptions = {}
): Promise<CloudinaryUploadResult[]> => {
  try {
    const uploadPromises = files.map(file => uploadImage(file, options));
    const results = await Promise.all(uploadPromises);
    return results;
  } catch (error) {
    console.error('Error uploading multiple images:', error);
    throw new Error(error instanceof Error ? error.message : 'Failed to upload multiple images');
  }
};

// Generate image with text overlay (for product badges, etc.)
export const generateImageWithText = (
  publicId: string,
  text: string,
  options: {
    fontSize?: number;
    fontWeight?: number;
    color?: string;
    position?: 'top' | 'bottom' | 'left' | 'right';
    offset?: number;
  } = {}
): string => {
  const {
    fontSize = 40,
    fontWeight = 'bold',
    color = 'white',
    position = 'top',
    offset = 20,
  } = options;

  let textPosition: string;
  switch (position) {
    case 'top':
      textPosition = `g_north,y_${offset}`;
      break;
    case 'bottom':
      textPosition = `g_south,y_${offset}`;
      break;
    case 'left':
      textPosition = `g_west,x_${offset}`;
      break;
    case 'right':
      textPosition = `g_east,x_${offset}`;
      break;
    default:
      textPosition = `g_north,y_${offset}`;
  }

  const transformation = `l_text:Arial_${fontSize}_${fontWeight}_${color}:${text},${textPosition}`;

  return cloudinary.url(publicId, {
    transformation,
    secure: true,
  });
};

// Get asset information
export const getAssetInfo = async (publicId: string): Promise<any> => {
  try {
    const result = await cloudinary.api.resource(publicId);
    return result;
  } catch (error) {
    console.error('Error getting asset info from Cloudinary:', error);
    throw new Error(error instanceof Error ? error.message : 'Failed to get asset info');
  }
};

// Search assets by tag
export const searchAssetsByTag = async (
  tag: string,
  options: {
    maxResults?: number;
    nextCursor?: string;
  } = {}
): Promise<any> => {
  try {
    const { maxResults = 20, nextCursor } = options;
    
    const result = await cloudinary.search
      .expression(`tags:${tag}`)
      .max_results(maxResults)
      .next_cursor(nextCursor)
      .execute();
    
    return result;
  } catch (error) {
    console.error('Error searching assets by tag:', error);
    throw new Error(error instanceof Error ? error.message : 'Failed to search assets');
  }
};

// Export Cloudinary instance for advanced usage
export { cloudinary };
