import React from 'react';
import {
  Box,
  Button,
  Stack,
  Typography,
  Chip,
  Pagination as MuiPagination,
} from '@mui/material';
import { IPaginationProps } from '@/interfaces/pagination.interface';

export default function Pagination({
  // Data props
  currentPage,
  totalItems,
  itemsPerPage,
  currentItems,
  hasMore,
  loading,

  // Callback props
  onPageChange,
  onLoadMore,

  // Display props
  showLoadMore = true,
  showPagination = true,
  showInfo = true,
  loadMoreText = 'Tải thêm',
  loadingText = 'Đang tải...',
  infoText,

  // Style props
  variant = 'outlined',
  color = 'primary',
  size = 'medium',
}: IPaginationProps) {
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const defaultInfoText = `Hiển thị ${currentItems} / ${totalItems} mục`;

  const handlePageChange = (
    event: React.ChangeEvent<unknown>,
    page: number
  ) => {
    onPageChange(page);
  };

  const handleLoadMore = () => {
    if (onLoadMore && hasMore && !loading) {
      onLoadMore();
    }
  };

  return (
    <Box
      sx={{
        mt: 3,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: 2,
      }}
    >
      {/* Info Section */}
      {showInfo && (
        <Stack direction="row" spacing={1} alignItems="center">
          <Typography variant="body2" color="text.secondary">
            {infoText || defaultInfoText}
          </Typography>
          {loading && (
            <Chip
              label={loadingText}
              size="small"
              color={color}
              variant="outlined"
            />
          )}
        </Stack>
      )}

      {/* Actions Section */}
      <Stack direction="row" spacing={2} alignItems="center">
        {/* Load More Button */}
        {showLoadMore && hasMore && onLoadMore && (
          <Button
            variant={variant}
            onClick={handleLoadMore}
            disabled={loading}
            size={size}
            color={color}
          >
            {loading ? loadingText : loadMoreText}
          </Button>
        )}

        {/* Pagination Component */}
        {showPagination && totalPages > 1 && (
          <MuiPagination
            count={totalPages}
            page={currentPage}
            onChange={handlePageChange}
            color={color}
            size={size}
            showFirstButton
            showLastButton
          />
        )}
      </Stack>
    </Box>
  );
}
