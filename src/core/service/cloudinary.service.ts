import cloudinary, { defaultUploadOptions } from "../config/cloudinary.config"
import { IDeleteResponse } from "../types/cloudinary/deleteResponse.interface"
import { IResourceResponse } from "../types/cloudinary/resourceResponse.interface"
import { IUploadResponse } from "../types/cloudinary/uploadResponse.interface"

export class CloudinaryService {
  private static readonly ALLOWED_TYPES = [
    "image/jpeg",
    "image/png",
    "image/webp",
  ]
  private static readonly MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB

  /**
   * Validate file before upload
   * @param file - The file to validate
   * @throws Error if validation fails
   */
  private static validateFile(file: File): void {
    if (!file) {
      throw new Error("No file provided")
    }

    if (!this.ALLOWED_TYPES.includes(file.type)) {
      throw new Error("Invalid file type. Only JPEG, PNG and WebP are allowed")
    }

    if (file.size > this.MAX_FILE_SIZE) {
      throw new Error("File size too large. Maximum size is 5MB")
    }
  }

  /**
   * Upload an image to Cloudinary
   * @param file - The image file to upload (File object or base64 string)
   * @returns Promise with upload result
   */
  static async uploadImage(file: File | string): Promise<IUploadResponse> {
    try {
      if (file instanceof File) {
        this.validateFile(file)
      }

      let result: IUploadResponse

      if (typeof file === "string") {
        // If file is base64 string
        result = (await cloudinary.uploader.upload(
          file,
          defaultUploadOptions
        )) as IUploadResponse
      } else {
        // If file is File object
        const formData = new FormData()
        formData.append("file", file)
        formData.append("upload_preset", defaultUploadOptions.upload_preset)

        const response = await fetch(
          `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/upload`,
          {
            method: "POST",
            body: formData,
          }
        )

        result = await response.json()
      }

      return result
    } catch (error) {
      console.error("Error uploading image to Cloudinary:", error)
      throw error
    }
  }

  /**
   * Get an image from Cloudinary by public ID
   * @param publicId - The public ID of the image
   * @returns Promise with image details
   */
  static async getImage(publicId: string): Promise<IResourceResponse> {
    try {
      const result = (await cloudinary.api.resource(
        publicId
      )) as IResourceResponse
      return result
    } catch (error) {
      console.error("Error getting image from Cloudinary:", error)
      throw error
    }
  }

  /**
   * Get list of images from Cloudinary
   * @param options - Options for listing images
   * @returns Promise with list of images
   */
  static async getListImages(
    options: {
      max_results?: number
      next_cursor?: string
      folder?: string
    } = {}
  ): Promise<{ resources: IResourceResponse[] }> {
    try {
      const result = await cloudinary.api.resources({
        type: "upload",
        resource_type: "image",
        max_results: options.max_results || 10,
        next_cursor: options.next_cursor,
        prefix: options.folder,
      })
      return result
    } catch (error) {
      console.error("Error getting list of images from Cloudinary:", error)
      throw error
    }
  }

  /**
   * Delete an image from Cloudinary
   * @param publicId - The public ID of the image to delete
   * @returns Promise with deletion result
   */
  static async deleteImage(publicId: string): Promise<IDeleteResponse> {
    try {
      const result = (await cloudinary.uploader.destroy(
        publicId
      )) as IDeleteResponse
      return result
    } catch (error) {
      console.error("Error deleting image from Cloudinary:", error)
      throw error
    }
  }

  /**
   * Get image URL with transformations
   * @param publicId - The public ID of the image
   * @param transformation - Cloudinary transformation string
   * @returns URL string
   */
  static getImageUrl(publicId: string, transformation?: string): string {
    return cloudinary.url(publicId, {
      secure: true,
      transformation: transformation
        ? [{ raw_transformation: transformation }]
        : undefined,
    })
  }

  /**
   * Get optimized image URL with popular transformations
   * @param publicId - The public ID of the image
   * @param type - Type of transformation ('banner' | 'thumbnail' | 'avatar' | 'product' | 'gallery' | 'cover')
   * @returns URL string
   */
  static getOptimizedImageUrl(
    publicId: string,
    type:
      | "banner"
      | "thumbnail"
      | "avatar"
      | "product"
      | "gallery"
      | "cover" = "thumbnail"
  ): string {
    const transformations = {
      // Banner cho header hoặc slideshow
      banner: "c_fill,g_auto,h_720,w_1280/q_auto,f_auto",

      // Thumbnail cho danh sách hoặc grid
      thumbnail: "c_scale,w_400,h_300,c_fill/q_auto,f_auto",

      // Avatar cho profile
      avatar: "c_thumb,g_face,w_200,h_200,c_fill/r_max/q_auto,f_auto",

      // Product cho sản phẩm
      product: "c_scale,w_600,h_600,c_fill/q_auto,f_auto",

      // Gallery cho gallery ảnh
      gallery: "c_scale,w_800,h_600,c_fill/q_auto,f_auto",

      // Cover cho cover image
      cover: "c_fill,g_auto,w_1200,h_400/q_auto,f_auto",
    }

    return this.getImageUrl(publicId, transformations[type])
  }
}
