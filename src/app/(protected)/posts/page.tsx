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

  // Pagination hook
  const {
    state: pagination,
    actions: paginationActions,
    pageSize,
  } = usePagination({
    pageSize: 10,
    initialPage: 1,
  });

  const { alert } = useModalAlert();
  const { confirm } = useModalConfirm();
  const { setLoading: setGlobalLoading } = useGlobalLoadingStore();

  // Fetch posts
  useEffect(() => {
    fetchPosts();
  }, []);

  useEffect(() => {
    loadCategories();
  }, []);

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
    confirm(
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
            message: 'Không thể xóa bài viết',
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
    confirm(
      async () => {
        setGlobalLoading(true);
        await postService.publishPost(post.id);
        alert({
          title: 'Thành công',
          message: 'Đã xuất bản bài viết!',
        });
        fetchPosts(search, false);
      },
      {
        message: `Bạn có chắc chắn muốn xuất bản bài viết "${post.title}" không?`,
      }
    );
  }

  function handleArchiveClick(post: Post) {
    confirm(
      async () => {
        setGlobalLoading(true);
        await postService.archivePost(post.id);
        alert({
          title: 'Thành công',
          message: 'Đã lưu trữ bài viết!',
        });
        fetchPosts(search, false);
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
    setSnackbar(prev => ({ ...prev, open: false }));
  }

  return (
    <Container maxWidth={false} sx={{ mt: 4, mx: 0, width: '100%' }}>
      <Typography variant="h4" fontWeight={700} color="primary" mb={3}>
        Quản lý bài viết
      </Typography>

      {/* Filters */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Grid container spacing={2} alignItems="center">
            <Grid sx={{ xs: 12, md: 3 }}>
              <TextField
                fullWidth
                placeholder="Tìm kiếm bài viết..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                onKeyPress={e => e.key === 'Enter' && handleSearch(e)}
                InputProps={{
                  startAdornment: (
                    <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />
                  ),
                }}
              />
            </Grid>
            <Grid sx={{ xs: 12, md: 3 }}>
              <FormControl fullWidth>
                <InputLabel>Trạng thái</InputLabel>
                <Select
                  value={statusFilter}
                  onChange={e => handleStatusFilterChange(e.target.value)}
                  label="Trạng thái"
                >
                  <MenuItem value="">Tất cả</MenuItem>
                  <MenuItem value="draft">Bản nháp</MenuItem>
                  <MenuItem value="published">Đã xuất bản</MenuItem>
                  <MenuItem value="archived">Đã lưu trữ</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid sx={{ xs: 12, md: 3 }}>
              <FormControl fullWidth>
                <InputLabel>Danh mục</InputLabel>
                <Select
                  value={categoryFilter}
                  onChange={e => handleCategoryFilterChange(e.target.value)}
                  label="Danh mục"
                >
                  <MenuItem value="">Tất cả</MenuItem>
                  {categories.map(category => (
                    <MenuItem key={category} value={category}>
                      {category}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid sx={{ xs: 12, md: 3 }}>
              <Button
                fullWidth
                variant="outlined"
                startIcon={<FilterIcon />}
                onClick={e => handleSearch(e)}
              >
                Lọc
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Action Bar */}
      <Box sx={{ display: 'flex', gap: 2, mb: 2, height: '40px' }}>
        <Box flexGrow={1} />
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleOpenCreateDialog}
        >
          Thêm bài viết
        </Button>
      </Box>

      {/* Posts Table */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Tiêu đề</TableCell>
              <TableCell>Tác giả</TableCell>
              <TableCell>Danh mục</TableCell>
              <TableCell>Trạng thái</TableCell>
              <TableCell>Lượt xem</TableCell>
              <TableCell>Ngày tạo</TableCell>
              <TableCell align="center">Thao tác</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {posts.map(post => (
              <TableRow key={post.id} hover>
                <TableCell>
                  <Box>
                    <Typography variant="subtitle2" noWrap>
                      {post.title}
                    </Typography>
                    {post.excerpt && (
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        noWrap
                      >
                        {post.excerpt}
                      </Typography>
                    )}
                  </Box>
                </TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Avatar sx={{ width: 32, height: 32, mr: 1 }}>
                      {post.authorName.charAt(0)}
                    </Avatar>
                    <Typography variant="body2">{post.authorName}</Typography>
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
                  <Typography variant="body2">{post.viewCount}</Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body2">
                    {format(new Date(post.createdAt), 'dd/MM/yyyy', {
                      locale: vi,
                    })}
                  </Typography>
                </TableCell>
                <TableCell align="center">
                  <Stack direction="row" spacing={1} justifyContent="center">
                    <Tooltip title="Xem">
                      <IconButton size="small" color="primary">
                        <ViewIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Chỉnh sửa">
                      <IconButton
                        size="small"
                        color="primary"
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
          </TableBody>
        </Table>
      </TableContainer>

      {/* Pagination */}
      <Pagination
        currentPage={pagination.currentPage}
        totalItems={pagination.total}
        itemsPerPage={pageSize}
        currentItems={posts.length}
        hasMore={pagination.hasMore}
        loading={pagination.loading}
        onPageChange={handlePageChange}
        showPagination={true}
        showInfo={true}
      />

      {/* Create Post Modal */}
      <CreatePostModal
        open={isCreateModalOpen}
        onClose={handleCloseCreateDialog}
        onSuccess={handleSave}
        setSnackBar={setSnackbar}
      />

      {/* Edit Post Modal */}
      <PostModal
        open={isEditModalOpen}
        post={selectedPost}
        onClose={handleCloseEditDialog}
        onSuccess={handleSave}
        setSnackBar={setSnackbar}
      />

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <MuiAlert
          elevation={6}
          variant="filled"
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
