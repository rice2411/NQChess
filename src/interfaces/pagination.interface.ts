export interface IPaginationProps {
  // Data props
  currentPage: number;
  totalItems: number;
  itemsPerPage: number;
  currentItems: number;
  hasMore: boolean;
  loading: boolean;

  // Callback props
  onPageChange: (page: number) => void;
  onLoadMore?: () => void;

  // Display props
  showLoadMore?: boolean;
  showPagination?: boolean;
  showInfo?: boolean;
  loadMoreText?: string;
  loadingText?: string;
  infoText?: string;

  // Style props
  variant?: 'outlined' | 'contained' | 'text';
  color?: 'primary' | 'secondary';
  size?: 'small' | 'medium' | 'large';
}

export interface PaginationResponse<T> {
  data: T[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}
