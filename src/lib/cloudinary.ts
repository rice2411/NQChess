import { v2 as cloudinary } from 'cloudinary';

// Cấu hình Cloudinary
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Upload hình ảnh
export const uploadImage = async (file: File, folder: string = 'nq-chess') => {
  try {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || 'nq-chess');
    formData.append('folder', folder);

    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
      {
        method: 'POST',
        body: formData,
      }
    );

    const data = await response.json();
    return { url: data.secure_url, publicId: data.public_id, error: null };
  } catch (error: unknown) {
    const errMsg = error instanceof Error ? error.message : String(error);
    return { url: null, publicId: null, error: errMsg };
  }
};

// Xóa hình ảnh
export const deleteImage = async (publicId: string) => {
  try {
    const response = await fetch('/api/cloudinary/delete', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ publicId }),
    });

    const data = await response.json();
    return { success: data.success, error: data.error };
  } catch (error: unknown) {
    const errMsg = error instanceof Error ? error.message : String(error);
    return { success: false, error: errMsg };
  }
};

// Transform hình ảnh
export const getOptimizedImageUrl = (url: string, options: {
  width?: number;
  height?: number;
  quality?: number;
  format?: 'auto' | 'webp' | 'jpg' | 'png';
} = {}) => {
  const { width, height, quality = 80, format = 'auto' } = options;
  
  if (!url.includes('cloudinary.com')) {
    return url;
  }

  const transformations = [];
  
  if (width) transformations.push(`w_${width}`);
  if (height) transformations.push(`h_${height}`);
  transformations.push(`q_${quality}`);
  transformations.push(`f_${format}`);

  if (transformations.length === 0) {
    return url;
  }

  const baseUrl = url.split('/upload/')[0];
  const imagePath = url.split('/upload/')[1];
  
  return `${baseUrl}/upload/${transformations.join(',')}/${imagePath}`;
};

// Lấy danh sách hình ảnh từ folder
export const getImagesFromFolder = async (folder: string = 'nq-chess') => {
  try {
    const response = await fetch(`/api/cloudinary/list?folder=${folder}`);
    const data = await response.json();
    return { images: data.resources, error: null };
  } catch (error: unknown) {
    const errMsg = error instanceof Error ? error.message : String(error);
    return { images: [], error: errMsg };
  }
};

export default cloudinary; 