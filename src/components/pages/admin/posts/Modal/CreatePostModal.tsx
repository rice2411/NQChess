'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  Typography,
  Grid,
  FormHelperText,
  Avatar,
  IconButton,
  Card,
  CardContent,
  ImageList,
  ImageListItem,
  ImageListItemBar,
  Tabs,
  Tab,
} from '@mui/material';

import CKEditorWrapper from '@/components/ui/CKEditorWrapper';
import { CreatePostRequest } from '@/interfaces/post.interface';
import { postService } from '@/services/post.service';
import { useModalAlert } from '@/hooks/useModalAlert';
import { useGlobalLoadingStore } from '@/store/useGlobalLoadingStore';
import { useAuthStore } from '@/store/useAuthStore';
import { CloudinaryService } from '@/services/cloudinary.service';
import { Close, Add, Edit, Visibility } from '@mui/icons-material';

interface CreatePostModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  setSnackBar: (snackbar: {
    open: boolean;
    message: string;
    severity: 'success' | 'error' | 'info';
  }) => void;
}

interface ImageFile {
  file: File;
  preview: string;
  id: string;
}

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`create-post-tabpanel-${index}`}
      aria-labelledby={`create-post-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `create-post-tab-${index}`,
    'aria-controls': `create-post-tabpanel-${index}`,
  };
}

export default function CreatePostModal({
  open,
  onClose,
  onSuccess,
  setSnackBar,
}: CreatePostModalProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [tabValue, setTabValue] = useState(0);
  const [formData, setFormData] = useState<CreatePostRequest>({
    title: '',
    content: '',
    excerpt: '',
    featuredImage: '',
    status: 'draft',
    tags: [],
    category: '',
    slug: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [imageFiles, setImageFiles] = useState<ImageFile[]>([]);

  const { alert } = useModalAlert();
  const { setLoading: setGlobalLoading } = useGlobalLoadingStore();
  const { getUserInfo } = useAuthStore();

  useEffect(() => {
    if (open) {
      resetForm();
      setTabValue(0); // Reset về tab Edit
    }
  }, [open]);

  const resetForm = () => {
    setFormData({
      title: '',
      content: '',
      excerpt: '',
      featuredImage: '',
      status: 'draft',
      tags: [],
      category: '',
      slug: '',
    });
    setErrors({});
    setImageFiles([]);
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Tiêu đề là bắt buộc';
    }

    if (!formData.content.trim()) {
      newErrors.content = 'Nội dung là bắt buộc';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: keyof CreatePostRequest, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    // Kiểm tra user đã đăng nhập
    const userInfo = getUserInfo();
    if (!userInfo) {
      alert({
        title: 'Lỗi',
        message: 'Bạn cần đăng nhập để tạo bài viết',
      });
      return;
    }

    try {
      setGlobalLoading(true);

      // Upload tất cả ảnh mới
      const uploadedUrls: string[] = [];

      for (const imageFile of imageFiles) {
        const uploadResult = await CloudinaryService.uploadImage(
          imageFile.file,
          'posts'
        );
        if (uploadResult.success && uploadResult.url) {
          uploadedUrls.push(uploadResult.url);
        } else {
          throw new Error(uploadResult.error || 'Không thể upload hình ảnh');
        }
      }

      // Ảnh đầu tiên làm featuredImage, tất cả ảnh lưu vào images
      const featuredImageUrl = uploadedUrls[0] || '';
      const allImages = uploadedUrls;

      const postData = {
        ...formData,
        featuredImage: featuredImageUrl,
        images: allImages, // Lưu tất cả ảnh
        authorId: userInfo.id,
        authorName: userInfo.name,
      };

      await postService.createPost(postData);
      setSnackBar({
        open: true,
        message: 'Đã tạo bài viết thành công',
        severity: 'success',
      });
      onSuccess();
      onClose();
    } catch (error) {
      console.error('Error creating post:', error);
      setSnackBar({
        open: true,
        message: 'Không thể tạo bài viết',
        severity: 'error',
      });
      alert({
        title: 'Lỗi',
        message: 'Không thể tạo bài viết',
      });
    } finally {
      setGlobalLoading(false);
    }
  };

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const newImageFiles: ImageFile[] = Array.from(files).map(file => ({
      file,
      preview: URL.createObjectURL(file),
      id: Math.random().toString(36).substr(2, 9),
    }));

    setImageFiles(prev => [...prev, ...newImageFiles]);
  };

  const removeImage = (id: string) => {
    setImageFiles(prev => {
      const updated = prev.filter(img => img.id !== id);
      // Cleanup URL object
      const removed = prev.find(img => img.id === id);
      if (removed) {
        URL.revokeObjectURL(removed.preview);
      }
      return updated;
    });
  };

  const getAllImages = () => {
    return imageFiles.map(img => img.preview);
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  return (
    <>
      <Dialog
        open={open}
        onClose={onClose}
        maxWidth="lg"
        fullWidth
        PaperProps={{
          sx: { height: '90vh' },
        }}
      >
        <DialogTitle>Tạo bài viết mới</DialogTitle>

        <DialogContent dividers sx={{ p: 0 }}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs
              value={tabValue}
              onChange={handleTabChange}
              aria-label="create post tabs"
              sx={{ px: 2 }}
            >
              <Tab icon={<Edit />} label="Chỉnh sửa" {...a11yProps(0)} />
              <Tab icon={<Visibility />} label="Xem trước" {...a11yProps(1)} />
            </Tabs>
          </Box>

          {/* Edit Tab */}
          <TabPanel value={tabValue} index={0}>
            <Grid container spacing={3}>
              <Grid component="div" sx={{ xs: 12 }}>
                <TextField
                  fullWidth
                  label="Tiêu đề bài viết"
                  value={formData.title}
                  onChange={e => handleInputChange('title', e.target.value)}
                  error={!!errors.title}
                  helperText={errors.title}
                  required
                  sx={{ mb: 3 }}
                />

                {/* Multi Image Upload */}
                <Box sx={{ mb: 3 }}>
                  <Typography variant="h6" gutterBottom>
                    Thêm ảnh ({imageFiles.length} ảnh đã chọn)
                  </Typography>

                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 2,
                      mb: 2,
                    }}
                  >
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      multiple
                      style={{ display: 'none' }}
                      onChange={handleFileChange}
                    />

                    <Button
                      variant="outlined"
                      startIcon={<Add />}
                      onClick={handleImageClick}
                    >
                      Chọn ảnh
                    </Button>

                    <Typography variant="body2" color="text.secondary">
                      Có thể chọn nhiều ảnh cùng lúc
                    </Typography>
                  </Box>

                  {/* Preview Images */}
                  {imageFiles.length > 0 && (
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="subtitle2" gutterBottom>
                        Ảnh đã chọn:
                      </Typography>

                      <ImageList
                        sx={{ width: '100%', height: 200 }}
                        cols={4}
                        rowHeight={100}
                      >
                        {imageFiles.map(imageFile => (
                          <ImageListItem key={imageFile.id}>
                            <img
                              src={imageFile.preview}
                              alt="Preview"
                              loading="lazy"
                              style={{
                                objectFit: 'cover',
                                width: '100%',
                                height: '100%',
                              }}
                            />
                            <ImageListItemBar
                              actionIcon={
                                <IconButton
                                  sx={{ color: 'white' }}
                                  onClick={() => removeImage(imageFile.id)}
                                >
                                  <Close />
                                </IconButton>
                              }
                            />
                          </ImageListItem>
                        ))}
                      </ImageList>
                    </Box>
                  )}
                </Box>

                {/* CKEditor */}
                <Typography variant="h6" gutterBottom>
                  Nội dung bài viết
                </Typography>

                <Box
                  sx={{
                    border: errors.content
                      ? '1px solid #d32f2f'
                      : '1px solid #e0e0e0',
                    borderRadius: 1,
                    '& .ck-editor__editable': {
                      minHeight: '400px',
                      maxHeight: '500px',
                      overflowY: 'auto',
                    },
                  }}
                >
                  {typeof window !== 'undefined' && (
                    <CKEditorWrapper
                      data={formData.content}
                      onChange={data => handleInputChange('content', data)}
                    />
                  )}
                </Box>
                {errors.content && (
                  <FormHelperText error>{errors.content}</FormHelperText>
                )}
              </Grid>
            </Grid>
          </TabPanel>

          {/* Preview Tab */}
          <TabPanel value={tabValue} index={1}>
            <Box sx={{ maxWidth: '600px', mx: 'auto' }}>
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Avatar sx={{ mr: 2 }}>U</Avatar>
                    <Box>
                      <Typography variant="subtitle1" fontWeight="bold">
                        Current User
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {typeof window !== 'undefined'
                          ? new Date().toLocaleDateString('vi-VN')
                          : new Date().toISOString().split('T')[0]}
                      </Typography>
                    </Box>
                  </Box>

                  {formData.title && (
                    <Typography variant="h5" gutterBottom>
                      {formData.title}
                    </Typography>
                  )}

                  {formData.content && (
                    <Box
                      dangerouslySetInnerHTML={{ __html: formData.content }}
                      sx={{
                        '& img': { maxWidth: '100%', height: 'auto' },
                        '& p': { margin: '8px 0' },
                        '& h1, & h2, & h3, & h4, & h5, & h6': {
                          margin: '16px 0 8px 0',
                        },
                        '& ul, & ol': { paddingLeft: '20px' },
                        '& blockquote': {
                          borderLeft: '4px solid #ccc',
                          paddingLeft: '16px',
                          margin: '16px 0',
                          fontStyle: 'italic',
                        },
                      }}
                    />
                  )}

                  {getAllImages().length > 0 && (
                    <Box sx={{ mt: 2 }}>
                      {getAllImages().length === 1 ? (
                        <img
                          src={getAllImages()[0]}
                          alt="Post image"
                          style={{
                            width: '100%',
                            height: 'auto',
                            borderRadius: '8px',
                          }}
                        />
                      ) : (
                        <ImageList
                          sx={{ width: '100%' }}
                          cols={2}
                          rowHeight={200}
                        >
                          {getAllImages().map((image, index) => (
                            <ImageListItem key={index}>
                              <img
                                src={image}
                                alt={`Post image ${index + 1}`}
                                loading="lazy"
                                style={{
                                  objectFit: 'cover',
                                  width: '100%',
                                  height: '100%',
                                  borderRadius: '8px',
                                }}
                              />
                            </ImageListItem>
                          ))}
                        </ImageList>
                      )}
                    </Box>
                  )}
                </CardContent>
              </Card>
            </Box>
          </TabPanel>
        </DialogContent>

        <DialogActions>
          <Button onClick={onClose}>Hủy</Button>
          <Button
            variant="contained"
            onClick={handleSubmit}
            disabled={Object.keys(errors).length > 0}
          >
            Đăng bài
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
