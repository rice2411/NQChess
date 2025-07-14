'use client';

import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Grid,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Stack,
  Tooltip,
  Avatar,
  Container,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as ViewIcon,
  Publish as PublishIcon,
  Archive as ArchiveIcon,
  Search as SearchIcon,
  FilterList as FilterIcon,
} from '@mui/icons-material';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';

import { Post } from '@/interfaces/post.interface';
import { postService } from '@/services/post.service';
import { useModalAlert } from '@/hooks/useModalAlert';
import { useModalConfirm } from '@/hooks/useModalConfirm';
import { useGlobalLoadingStore } from '@/store/useGlobalLoadingStore';
import { usePagination } from '@/hooks/usePagination';
import Pagination from '@/components/ui/Pagination';
import PostModal from './Modal/PostModal';
import CreatePostModal from './Modal/CreatePostModal';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';

const statusColors = {
  draft: 'warning',
  published: 'success',
  archived: 'default',
} as const;

const statusLabels = {
  draft: 'Bản nháp',
  published: 'Đã xuất bản',
  archived: 'Đã lưu trữ',
} as const;

export default function PostsPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<Post['status'] | ''>('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [categories, setCategories] = useState<string[]>([]);
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'error' | 'info';
  }>({ open: false, message: '', severity: 'success' });
  const [mounted, setMounted] = useState(false);

  // Pagination hook
  const {
    state: pagination,
    actions: paginationActions,
    pageSize,
  } = usePagination({
    pageSize: 10,
    initialPage: 1,
  });

  const modalAlert = useModalAlert();
  const modalConfirm = useModalConfirm();
  const { setLoading: setGlobalLoading } = useGlobalLoadingStore();

  // Kiểm tra mounted
  useEffect(() => {
    setMounted(true);
  }, []);

  // Fetch posts
  useEffect(() => {
    if (mounted) {
      fetchPosts();
    }
  }, [mounted]);

  useEffect(() => {
    if (mounted) {
      loadCategories();
    }
  }, [mounted]);

  async function fetchPosts(searchText = '', resetPagination = true) {
    try {
      setGlobalLoading(true);

      if (resetPagination) {
        paginationActions.resetPagination();
      }

      const result = await postService.getPostsWithPagination(
        pagination.currentPage,
        pageSize,
        searchText,
        statusFilter || undefined,
        categoryFilter || undefined
      );

      setPosts(result.posts);
      paginationActions.setHasMore(result.hasMore);
      paginationActions.setTotal(result.total);
    } catch (error) {
      console.error('Error fetching posts:', error);
      setSnackbar({
        open: true,
        message: 'Không thể tải danh sách bài viết',
        severity: 'error',
      });
    } finally {
      setGlobalLoading(false);
    }
  }

  const loadCategories = async () => {
    try {
      const categoriesData = await postService.getCategories();
      setCategories(categoriesData);
    } catch (error) {
      console.error('Failed to load categories:', error);
    }
  };

  function handleOpenCreateDialog() {
    setIsCreateModalOpen(true);
  }

  function handleOpenEditDialog(post: Post) {
    setSelectedPost(post);
    setIsEditModalOpen(true);
  }

  function handleCloseEditDialog() {
    setIsEditModalOpen(false);
    setSelectedPost(null);
  }

  function handleCloseCreateDialog() {
    setIsCreateModalOpen(false);
  }

  async function handleSave() {
    try {
      setGlobalLoading(true);
      fetchPosts(search, true); // Reset pagination khi thêm/sửa
      setSnackbar({
        open: true,
        message: selectedPost
          ? 'Cập nhật bài viết thành công!'
          : 'Thêm bài viết thành công!',
        severity: 'success',
      });
    } catch (error) {
      console.error('Error refreshing posts:', error);
      setSnackbar({
        open: true,
        message: 'Có lỗi xảy ra khi tải danh sách bài viết',
        severity: 'error',
      });
    } finally {
      setGlobalLoading(false);
    }
  }

  function handleDeleteClick(post: Post) {
    if (!mounted || !modalConfirm) return;

    modalConfirm.confirm(
      async () => {
        setGlobalLoading(true);
        try {
          await postService.deletePost(post.id);
          setSnackbar({
            open: true,
            message: 'Đã xóa bài viết!',
            severity: 'success',
          });
          fetchPosts(search, true); // Reset pagination khi xóa
        } catch (error) {
          console.error('Error deleting post:', error);
          setSnackbar({
            open: true,
            message: 'Có lỗi khi xóa bài viết',
            severity: 'error',
          });
        } finally {
          setGlobalLoading(false);
        }
      },
      {
        message: `Bạn có chắc chắn muốn xóa bài viết "${post.title}" không? Hành động này không thể hoàn tác.`,
      }
    );
  }

  function handlePublishClick(post: Post) {
    if (!mounted || !modalConfirm) return;

    modalConfirm.confirm(
      async () => {
        setGlobalLoading(true);
        try {
          await postService.updatePost(post.id, { status: 'published' });
          setSnackbar({
            open: true,
            message: 'Đã xuất bản bài viết!',
            severity: 'success',
          });
          fetchPosts(search, true);
        } catch (error) {
          console.error('Error publishing post:', error);
          setSnackbar({
            open: true,
            message: 'Có lỗi khi xuất bản bài viết',
            severity: 'error',
          });
        } finally {
          setGlobalLoading(false);
        }
      },
      {
        message: `Bạn có chắc chắn muốn xuất bản bài viết "${post.title}" không?`,
      }
    );
  }

  function handleArchiveClick(post: Post) {
    if (!mounted || !modalConfirm) return;

    modalConfirm.confirm(
      async () => {
        setGlobalLoading(true);
        try {
          await postService.updatePost(post.id, { status: 'archived' });
          setSnackbar({
            open: true,
            message: 'Đã lưu trữ bài viết!',
            severity: 'success',
          });
          fetchPosts(search, true);
        } catch (error) {
          console.error('Error archiving post:', error);
          setSnackbar({
            open: true,
            message: 'Có lỗi khi lưu trữ bài viết',
            severity: 'error',
          });
        } finally {
          setGlobalLoading(false);
        }
      },
      {
        message: `Bạn có chắc chắn muốn lưu trữ bài viết "${post.title}" không?`,
      }
    );
  }

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    fetchPosts(search, true);
  }

  function handlePageChange(page: number) {
    paginationActions.setCurrentPage(page);
    fetchPosts(search, false);
  }

  function handleStatusFilterChange(status: string) {
    setStatusFilter(status as Post['status'] | '');
    fetchPosts(search, true);
  }

  function handleCategoryFilterChange(category: string) {
    setCategoryFilter(category);
    fetchPosts(search, true);
  }

  function handleCloseSnackbar() {
    setSnackbar({ open: false, message: '', severity: 'success' });
  }

  // Không render cho đến khi mounted
  if (!mounted) {
    return (
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Typography variant="h4" fontWeight={700} color="primary" mb={3}>
          Quản lý bài viết
        </Typography>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '200px',
          }}
        >
          <Typography>Đang tải...</Typography>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Typography variant="h4" fontWeight={700} color="primary" mb={3}>
        Quản lý bài viết
      </Typography>

      {/* Search and Filter Bar */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box
            sx={{
              display: 'flex',
              gap: 2,
              alignItems: 'center',
              flexWrap: 'wrap',
            }}
          >
            <Box sx={{ flex: 1, minWidth: 300 }}>
              <form onSubmit={handleSearch}>
                <TextField
                  fullWidth
                  placeholder="Tìm kiếm bài viết..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  InputProps={{
                    endAdornment: (
                      <IconButton type="submit">
                        <SearchIcon />
                      </IconButton>
                    ),
                  }}
                />
              </form>
            </Box>
            <FormControl sx={{ minWidth: 200 }}>
              <InputLabel>Trạng thái</InputLabel>
              <Select
                value={statusFilter}
                label="Trạng thái"
                onChange={e => handleStatusFilterChange(e.target.value)}
              >
                <MenuItem value="">Tất cả</MenuItem>
                <MenuItem value="draft">Bản nháp</MenuItem>
                <MenuItem value="published">Đã xuất bản</MenuItem>
                <MenuItem value="archived">Đã lưu trữ</MenuItem>
              </Select>
            </FormControl>
            <FormControl sx={{ minWidth: 200 }}>
              <InputLabel>Danh mục</InputLabel>
              <Select
                value={categoryFilter}
                label="Danh mục"
                onChange={e => handleCategoryFilterChange(e.target.value)}
              >
                <MenuItem value="">Tất cả</MenuItem>
                {categories.map(category => (
                  <MenuItem key={category} value={category}>
                    {category}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={handleOpenCreateDialog}
            >
              Thêm bài viết
            </Button>
          </Box>
        </CardContent>
      </Card>

      {/* Posts Table */}
      <Card>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Bài viết</TableCell>
                <TableCell>Danh mục</TableCell>
                <TableCell>Trạng thái</TableCell>
                <TableCell>Ngày tạo</TableCell>
                <TableCell align="right">Hành động</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {posts.map(post => (
                <TableRow key={post.id}>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Avatar
                        src={post.featuredImage}
                        alt={post.title}
                        sx={{ width: 48, height: 48 }}
                      >
                        {post.title?.charAt(0) || '?'}
                      </Avatar>
                      <Box>
                        <Typography variant="subtitle1" fontWeight={600}>
                          {post.title}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {post.excerpt}
                        </Typography>
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Chip label={post.category} size="small" />
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={statusLabels[post.status]}
                      color={statusColors[post.status]}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    {format(new Date(post.createdAt), 'dd/MM/yyyy', {
                      locale: vi,
                    })}
                  </TableCell>
                  <TableCell align="right">
                    <Stack
                      direction="row"
                      spacing={1}
                      justifyContent="flex-end"
                    >
                      <Tooltip title="Xem">
                        <IconButton size="small">
                          <ViewIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Chỉnh sửa">
                        <IconButton
                          size="small"
                          onClick={() => handleOpenEditDialog(post)}
                        >
                          <EditIcon />
                        </IconButton>
                      </Tooltip>
                      {post.status === 'draft' && (
                        <Tooltip title="Xuất bản">
                          <IconButton
                            size="small"
                            color="success"
                            onClick={() => handlePublishClick(post)}
                          >
                            <PublishIcon />
                          </IconButton>
                        </Tooltip>
                      )}
                      {post.status === 'published' && (
                        <Tooltip title="Lưu trữ">
                          <IconButton
                            size="small"
                            color="warning"
                            onClick={() => handleArchiveClick(post)}
                          >
                            <ArchiveIcon />
                          </IconButton>
                        </Tooltip>
                      )}
                      <Tooltip title="Xóa">
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() => handleDeleteClick(post)}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Tooltip>
                    </Stack>
                  </TableCell>
                </TableRow>
              ))}
              {posts.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} align="center">
                    Không có bài viết nào.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>

      {/* Pagination */}
      <Box sx={{ mt: 3 }}>
        <Pagination
          currentPage={pagination.currentPage}
          totalItems={pagination.total}
          itemsPerPage={pageSize}
          currentItems={posts.length}
          hasMore={pagination.hasMore}
          loading={false}
          onPageChange={handlePageChange}
          showLoadMore={false}
          infoText={`Hiển thị ${posts.length} / ${pagination.total} bài viết`}
          loadingText="Đang tải..."
        />
      </Box>

      {/* Modals */}
      <PostModal
        open={isEditModalOpen}
        post={selectedPost}
        onClose={handleCloseEditDialog}
        onSuccess={handleSave}
        setSnackBar={setSnackbar}
      />

      <CreatePostModal
        open={isCreateModalOpen}
        onClose={handleCloseCreateDialog}
        onSuccess={handleSave}
        setSnackBar={setSnackbar}
      />

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
      >
        <MuiAlert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </MuiAlert>
      </Snackbar>
    </Container>
  );
}
