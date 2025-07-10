export interface CloudinaryUploadResponse {
  success: boolean;
  url?: string;
  publicId?: string;
  error?: string;
}

export interface CloudinaryDeleteResponse {
  success: boolean;
  error?: string;
}

export interface CloudinaryListResponse {
  success: boolean;
  resources?: any[];
  total?: number;
  error?: string;
}

export const CloudinaryService = {
  /**
   * Upload hình ảnh lên Cloudinary
   */
  async uploadImage(
    file: File,
    folder: string = 'nq-chess'
  ): Promise<CloudinaryUploadResponse> {
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('folder', folder);

      const response = await fetch('/api/cloudinary', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (data.success) {
        return {
          success: true,
          url: data.url,
          publicId: data.publicId,
        };
      } else {
        return {
          success: false,
          error: data.error || 'Upload failed',
        };
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      return {
        success: false,
        error: 'Không thể upload hình ảnh',
      };
    }
  },

  /**
   * Xóa hình ảnh từ Cloudinary
   */
  async deleteImage(imageUrl: string): Promise<CloudinaryDeleteResponse> {
    if (!imageUrl) {
      return {
        success: false,
        error: 'Image URL is required',
      };
    }

    try {
      // Extract public_id from Cloudinary URL
      const publicId = this.extractPublicIdFromUrl(imageUrl);

      if (!publicId) {
        return {
          success: false,
          error: 'Invalid Cloudinary URL format',
        };
      }

      const response = await fetch('/api/cloudinary', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ action: 'delete', publicId }),
      });

      const data = await response.json();

      if (data.success) {
        return { success: true };
      } else {
        return {
          success: false,
          error: data.error || 'Delete failed',
        };
      }
    } catch (error) {
      console.error('Error deleting image:', error);
      return {
        success: false,
        error: 'Không thể xóa hình ảnh',
      };
    }
  },

  /**
   * Lấy danh sách hình ảnh từ folder
   */
  async listImages(
    folder: string = 'nq-chess',
    maxResults: number = 50
  ): Promise<CloudinaryListResponse> {
    try {
      const response = await fetch(
        `/api/cloudinary?action=list&folder=${folder}&max_results=${maxResults}`
      );

      const data = await response.json();

      if (data.success) {
        return {
          success: true,
          resources: data.resources,
          total: data.total,
        };
      } else {
        return {
          success: false,
          error: data.error || 'Failed to fetch images',
        };
      }
    } catch (error) {
      console.error('Error fetching images:', error);
      return {
        success: false,
        error: 'Không thể lấy danh sách hình ảnh',
      };
    }
  },

  /**
   * Extract public_id từ Cloudinary URL
   */
  extractPublicIdFromUrl(imageUrl: string): string | null {
    try {
      // URL format: https://res.cloudinary.com/cloud_name/image/upload/v1234567890/folder/filename.jpg
      const urlParts = imageUrl.split('/');
      const uploadIndex = urlParts.findIndex(part => part === 'upload');

      if (uploadIndex === -1) {
        return null;
      }

      // Get everything after 'upload' and before the file extension
      const pathParts = urlParts.slice(uploadIndex + 2); // Skip 'upload' and version
      const publicId = pathParts.join('/').split('.')[0]; // Remove file extension

      return publicId;
    } catch (error) {
      console.error('Error extracting public ID:', error);
      return null;
    }
  },
};
