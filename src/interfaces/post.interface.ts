export interface Post {
  id: string;
  title: string;
  content: string;
  excerpt?: string;
  featuredImage?: string;
  images?: string[]; // Thêm field để lưu nhiều ảnh
  status: 'draft' | 'published' | 'archived';
  authorId: string;
  authorName: string;
  tags: string[];
  category: string;
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
  viewCount: number;
  slug: string;
}

export interface CreatePostRequest {
  title: string;
  content: string;
  excerpt?: string;
  featuredImage?: string;
  images?: string[]; // Thêm field để lưu nhiều ảnh
  status: 'draft' | 'published';
  tags: string[];
  category: string;
  slug: string;
}

export interface UpdatePostRequest extends Partial<CreatePostRequest> {
  id: string;
}

export interface PostFilters {
  status?: 'draft' | 'published' | 'archived';
  category?: string;
  authorId?: string;
  search?: string;
  dateFrom?: Date;
  dateTo?: Date;
}
