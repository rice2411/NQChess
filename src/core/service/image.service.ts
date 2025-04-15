import { CloudinaryService } from "./cloudinary.service"

export class ImageService {
  /**
   * Tạo URL ảnh tối ưu cho banner (1280x720)
   */
  static getBannerUrl(publicId: string): string {
    return CloudinaryService.getOptimizedImageUrl(publicId, "banner")
  }

  /**
   * Tạo URL ảnh tối ưu cho thumbnail (400x300)
   */
  static getThumbnailUrl(publicId: string): string {
    return CloudinaryService.getOptimizedImageUrl(publicId, "thumbnail")
  }

  /**
   * Tạo URL ảnh tối ưu cho avatar (200x200)
   */
  static getAvatarUrl(publicId: string): string {
    return CloudinaryService.getOptimizedImageUrl(publicId, "avatar")
  }

  /**
   * Tạo URL ảnh tối ưu cho sản phẩm (600x600)
   */
  static getProductUrl(publicId: string): string {
    return CloudinaryService.getOptimizedImageUrl(publicId, "product")
  }

  /**
   * Tạo URL ảnh tối ưu cho gallery (800x600)
   */
  static getGalleryUrl(publicId: string): string {
    return CloudinaryService.getOptimizedImageUrl(publicId, "gallery")
  }

  /**
   * Tạo URL ảnh tối ưu cho cover (1200x400)
   */
  static getCoverUrl(publicId: string): string {
    return CloudinaryService.getOptimizedImageUrl(publicId, "cover")
  }

  /**
   * Tạo URL ảnh với kích thước tùy chỉnh
   */
  static getResizedUrl(
    publicId: string,
    width: number,
    height?: number
  ): string {
    const transformation = `w_${width}${height ? `,h_${height}` : ""},c_scale`
    return CloudinaryService.getImageUrl(publicId, transformation)
  }

  /**
   * Tạo URL ảnh với chất lượng tối ưu
   */
  static getOptimizedUrl(publicId: string): string {
    return CloudinaryService.getImageUrl(publicId, "q_auto,f_auto")
  }
}
