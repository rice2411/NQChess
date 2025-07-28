import {
  collection,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  query,
  where,
  orderBy,
  QueryConstraint,
  limit,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Post } from '@/interfaces/post.interface';
import { CloudinaryService } from '@/services/cloudinary.service';
import { COLLECTIONS } from '@/constants/collections';

export class PostService {
  // ===== POST MANAGEMENT =====

  /**
   * Lấy tất cả bài viết
   */
  static async getAllPosts(): Promise<Post[]> {
    try {
      const q = query(
        collection(db, COLLECTIONS.POSTS),
        orderBy('createdAt', 'desc')
      );
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }) as Post);
    } catch (error) {
      console.error('Error fetching posts:', error);
      throw new Error('Không thể lấy danh sách bài viết');
    }
  }

  /**
   * Lấy bài viết theo ID
   */
  static async getPostById(id: string): Promise<Post | null> {
    try {
      const docRef = doc(db, COLLECTIONS.POSTS, id);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() } as Post;
      }
      return null;
    } catch (error) {
      console.error('Error fetching post:', error);
      throw new Error('Không thể lấy thông tin bài viết');
    }
  }

  /**
   * Tìm kiếm bài viết theo tiêu đề
   */
  static async searchPostsByTitle(searchText: string): Promise<Post[]> {
    try {
      if (!searchText.trim()) {
        return this.getAllPosts();
      }

      const q = query(
        collection(db, COLLECTIONS.POSTS),
        where('title', '>=', searchText),
        where('title', '<=', searchText + '\uf8ff'),
        orderBy('title')
      );

      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }) as Post);
    } catch (error) {
      console.error('Error searching posts:', error);
      throw new Error('Không thể tìm kiếm bài viết');
    }
  }

  /**
   * Lọc bài viết theo trạng thái
   */
  static async getPostsByStatus(status: Post['status']): Promise<Post[]> {
    try {
      const q = query(
        collection(db, COLLECTIONS.POSTS),
        where('status', '==', status),
        orderBy('createdAt', 'desc')
      );

      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }) as Post);
    } catch (error) {
      console.error('Error filtering posts by status:', error);
      throw new Error('Không thể lọc bài viết theo trạng thái');
    }
  }

  /**
   * Lọc bài viết theo danh mục
   */
  static async getPostsByCategory(category: string): Promise<Post[]> {
    try {
      const q = query(
        collection(db, COLLECTIONS.POSTS),
        where('category', '==', category),
        orderBy('createdAt', 'desc')
      );

      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }) as Post);
    } catch (error) {
      console.error('Error filtering posts by category:', error);
      throw new Error('Không thể lọc bài viết theo danh mục');
    }
  }

  /**
   * Thêm bài viết mới
   */
  static async createPost(
    postData: Omit<
      Post,
      'id' | 'createdAt' | 'updatedAt' | 'viewCount' | 'authorName'
    >
  ): Promise<Post> {
    try {
      const now = new Date().toISOString();
      const newPost = {
        ...postData,
        viewCount: 0,
        createdAt: now,
        updatedAt: now,
      };

      const docRef = await addDoc(collection(db, COLLECTIONS.POSTS), newPost);
      return { id: docRef.id, ...newPost } as Post;
    } catch (error) {
      console.error('Error creating post:', error);
      throw new Error('Không thể thêm bài viết');
    }
  }

  /**
   * Cập nhật bài viết
   */
  static async updatePost(
    id: string,
    postData: Partial<Omit<Post, 'id' | 'createdAt'>>
  ): Promise<void> {
    try {
      // Lấy thông tin bài viết hiện tại
      const currentPost = await this.getPostById(id);
      if (!currentPost) {
        throw new Error('Không tìm thấy bài viết');
      }

      // Xử lý ảnh đại diện nếu có thay đổi
      await this.handleFeaturedImageUpdate(currentPost, postData);

      const updateData = {
        ...postData,
        updatedAt: new Date().toISOString(),
      };

      await updateDoc(doc(db, COLLECTIONS.POSTS, id), updateData);
    } catch (error) {
      console.error('Error updating post:', error);
      throw new Error('Không thể cập nhật bài viết');
    }
  }

  /**
   * Xử lý cập nhật ảnh đại diện - xóa ảnh cũ nếu có ảnh mới
   */
  private static async handleFeaturedImageUpdate(
    currentPost: Post,
    newPostData: Partial<Omit<Post, 'id' | 'createdAt'>>
  ): Promise<void> {
    // Normalize URLs để so sánh chính xác
    const currentImage = this.normalizeUrl(currentPost.featuredImage);
    const newImage = this.normalizeUrl(newPostData.featuredImage);
    const areDifferent = currentImage !== newImage;

    // Chỉ xóa ảnh cũ nếu có ảnh mới và khác với ảnh hiện tại
    if (
      newPostData.featuredImage &&
      currentPost.featuredImage &&
      areDifferent
    ) {
      await this.deletePostFeaturedImage(currentPost.featuredImage);
    }
  }

  /**
   * Normalize URL để so sánh chính xác
   */
  private static normalizeUrl(url: string | undefined): string {
    if (!url) return '';

    try {
      // Loại bỏ protocol và trailing slash
      return url.replace(/^https?:\/\//, '').replace(/\/$/, '');
    } catch (error) {
      console.warn('Error normalizing URL:', url, error);
      return url;
    }
  }

  /**
   * Xóa ảnh từ Cloudinary
   */
  static async deleteImageFromCloudinary(imageUrl: string): Promise<boolean> {
    if (!imageUrl) {
      return false;
    }

    try {
      const deleteResult = await CloudinaryService.deleteImage(imageUrl);

      if (deleteResult.success) {
        return true;
      } else {
        console.warn('Failed to delete image:', deleteResult.error);
        return false;
      }
    } catch (error) {
      console.error('Error deleting image:', error);
      return false;
    }
  }

  /**
   * Xóa nhiều ảnh từ Cloudinary
   */
  static async deleteMultipleImagesFromCloudinary(
    imageUrls: string[]
  ): Promise<void> {
    if (!imageUrls || imageUrls.length === 0) {
      return;
    }

    const deletePromises = imageUrls.map(async imageUrl => {
      try {
        await this.deleteImageFromCloudinary(imageUrl);
      } catch (error) {
        console.warn(`Failed to delete image: ${imageUrl}`, error);
        // Không throw error để tiếp tục xóa các ảnh khác
      }
    });

    await Promise.allSettled(deletePromises);
  }

  /**
   * Xóa ảnh đại diện của bài viết từ Cloudinary (deprecated - use deleteImageFromCloudinary)
   */
  static async deletePostFeaturedImage(imageUrl: string): Promise<boolean> {
    return this.deleteImageFromCloudinary(imageUrl);
  }

  /**
   * Xóa bài viết
   */
  static async deletePost(id: string): Promise<void> {
    try {
      const post = await this.getPostById(id);
      if (post) {
        // Thu thập tất cả ảnh cần xóa
        const imagesToDelete: string[] = [];

        // Thêm featuredImage nếu có
        if (post.featuredImage) {
          imagesToDelete.push(post.featuredImage);
        }

        // Thêm tất cả ảnh từ field images nếu có
        if (post.images && Array.isArray(post.images)) {
          imagesToDelete.push(...post.images);
        }

        // Loại bỏ các ảnh trùng lặp (nếu featuredImage cũng có trong images)
        const uniqueImages = [...new Set(imagesToDelete)];

        // Xóa tất cả ảnh từ Cloudinary
        if (uniqueImages.length > 0) {
          await this.deleteMultipleImagesFromCloudinary(uniqueImages);
        }
      }

      // Xóa document từ Firestore
      await deleteDoc(doc(db, COLLECTIONS.POSTS, id));
    } catch (error) {
      console.error('Error deleting post:', error);
      throw new Error('Không thể xóa bài viết');
    }
  }

  /**
   * Xuất bản bài viết
   */
  static async publishPost(id: string): Promise<void> {
    try {
      const updateData = {
        status: 'published' as const,
        publishedAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      await updateDoc(doc(db, COLLECTIONS.POSTS, id), updateData);
    } catch (error) {
      console.error('Error publishing post:', error);
      throw new Error('Không thể xuất bản bài viết');
    }
  }

  /**
   * Lưu trữ bài viết
   */
  static async archivePost(id: string): Promise<void> {
    try {
      const updateData = {
        status: 'archived' as const,
        updatedAt: new Date().toISOString(),
      };

      await updateDoc(doc(db, COLLECTIONS.POSTS, id), updateData);
    } catch (error) {
      console.error('Error archiving post:', error);
      throw new Error('Không thể lưu trữ bài viết');
    }
  }

  /**
   * Lấy danh sách bài viết có phân trang với traditional pagination
   */
  static async getPostsWithPagination(
    page: number = 1,
    pageSize: number = 10,
    searchText?: string,
    status?: Post['status'],
    category?: string
  ): Promise<{
    posts: Post[];
    total: number;
    hasMore: boolean;
  }> {
    try {
      // Xây dựng query constraints
      const constraints: QueryConstraint[] = [];

      if (searchText && searchText.trim()) {
        constraints.push(
          where('title', '>=', searchText.trim()),
          where('title', '<=', searchText.trim() + '\uf8ff')
        );
      }

      if (status) {
        constraints.push(where('status', '==', status));
      }

      if (category) {
        constraints.push(where('category', '==', category));
      }

      // Thêm orderBy và limit
      constraints.push(orderBy('createdAt', 'desc'));
      constraints.push(limit(pageSize));

      const q = query(collection(db, COLLECTIONS.POSTS), ...constraints);
      const snapshot = await getDocs(q);

      const posts = snapshot.docs.map(
        doc => ({ id: doc.id, ...doc.data() }) as Post
      );

      // Tính toán total và hasMore
      const total = await this.getTotalPosts(searchText, status, category);
      const hasMore = page * pageSize < total;

      return {
        posts,
        total,
        hasMore,
      };
    } catch (error) {
      console.error('Error fetching posts with pagination:', error);
      throw new Error('Không thể lấy danh sách bài viết');
    }
  }

  /**
   * Lấy tổng số bài viết
   */
  static async getTotalPosts(
    searchText?: string,
    status?: Post['status'],
    category?: string
  ): Promise<number> {
    try {
      const constraints: QueryConstraint[] = [];

      if (searchText && searchText.trim()) {
        constraints.push(
          where('title', '>=', searchText.trim()),
          where('title', '<=', searchText.trim() + '\uf8ff')
        );
      }

      if (status) {
        constraints.push(where('status', '==', status));
      }

      if (category) {
        constraints.push(where('category', '==', category));
      }

      const q = query(collection(db, COLLECTIONS.POSTS), ...constraints);
      const snapshot = await getDocs(q);
      return snapshot.size;
    } catch (error) {
      console.error('Error getting total posts:', error);
      return 0;
    }
  }

  /**
   * Lấy danh sách danh mục
   */
  static async getCategories(): Promise<string[]> {
    try {
      const q = query(collection(db, COLLECTIONS.POSTS));
      const snapshot = await getDocs(q);

      const categories = new Set<string>();
      snapshot.docs.forEach(doc => {
        const data = doc.data() as Post;
        if (data.category) {
          categories.add(data.category);
        }
      });

      return Array.from(categories).sort();
    } catch (error) {
      console.error('Error getting categories:', error);
      return [];
    }
  }

  /**
   * Lấy danh sách tags
   */
  static async getTags(): Promise<string[]> {
    try {
      const q = query(collection(db, COLLECTIONS.POSTS));
      const snapshot = await getDocs(q);

      const tags = new Set<string>();
      snapshot.docs.forEach(doc => {
        const data = doc.data() as Post;
        if (data.tags && Array.isArray(data.tags)) {
          data.tags.forEach(tag => tags.add(tag));
        }
      });

      return Array.from(tags).sort();
    } catch (error) {
      console.error('Error getting tags:', error);
      return [];
    }
  }

  /**
   * Kiểm tra slug đã tồn tại
   */
  static async checkSlugExists(
    slug: string,
    excludeId?: string
  ): Promise<boolean> {
    try {
      const q = query(
        collection(db, COLLECTIONS.POSTS),
        where('slug', '==', slug)
      );
      const snapshot = await getDocs(q);

      if (excludeId) {
        return snapshot.docs.some(doc => doc.id !== excludeId);
      }

      return !snapshot.empty;
    } catch (error) {
      console.error('Error checking slug exists:', error);
      return false;
    }
  }

  /**
   * Lấy thống kê bài viết
   */
  static async getPostStats(): Promise<{
    total: number;
    published: number;
    draft: number;
    archived: number;
    recentAdded: number;
  }> {
    try {
      const allPosts = await this.getAllPosts();
      const now = new Date();
      const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

      const stats = {
        total: allPosts.length,
        published: allPosts.filter(post => post.status === 'published').length,
        draft: allPosts.filter(post => post.status === 'draft').length,
        archived: allPosts.filter(post => post.status === 'archived').length,
        recentAdded: allPosts.filter(
          post => new Date(post.createdAt) >= sevenDaysAgo
        ).length,
      };

      return stats;
    } catch (error) {
      console.error('Error getting post stats:', error);
      return {
        total: 0,
        published: 0,
        draft: 0,
        archived: 0,
        recentAdded: 0,
      };
    }
  }
}

export const postService = PostService;
