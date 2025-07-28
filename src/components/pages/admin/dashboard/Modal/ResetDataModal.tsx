'use client';
import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Alert,
  CircularProgress,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Chip,
} from '@mui/material';
import {
  Warning,
  DeleteForever,
  CheckCircle,
  Error,
  Storage,
} from '@mui/icons-material';
import { ResetService } from '@/services/reset.service';
import { useGlobalLoadingStore } from '@/store/useGlobalLoadingStore';

interface ResetDataModalProps {
  open: boolean;
  onClose: () => void;
}

interface CollectionStats {
  [key: string]: number;
}

export default function ResetDataModal({ open, onClose }: ResetDataModalProps) {
  const [collectionStats, setCollectionStats] = useState<CollectionStats>({});
  const [resetResult, setResetResult] = useState<{
    success: boolean;
    message: string;
    deletedCounts: Record<string, number>;
  } | null>(null);
  const [isResetting, setIsResetting] = useState(false);
  const [isLoadingStats, setIsLoadingStats] = useState(false);

  const { setLoading } = useGlobalLoadingStore();

  useEffect(() => {
    if (open) {
      loadCollectionStats();
    }
  }, [open]);

  async function loadCollectionStats() {
    try {
      setIsLoadingStats(true);
      const stats = await ResetService.getCollectionStats();
      setCollectionStats(stats);
    } catch (error) {
      console.error('Error loading collection stats:', error);
    } finally {
      setIsLoadingStats(false);
    }
  }

  async function handleResetData() {
    try {
      setIsResetting(true);
      setLoading(true);

      const result = await ResetService.resetAllData();
      setResetResult(result);

      if (result.success) {
        // Reload stats sau khi reset
        await loadCollectionStats();
      }
    } catch (error) {
      console.error('Error resetting data:', error);
      setResetResult({
        success: false,
        message: 'Có lỗi xảy ra khi reset data!',
        deletedCounts: {},
      });
    } finally {
      setIsResetting(false);
      setLoading(false);
    }
  }

  function handleClose() {
    setResetResult(null);
    onClose();
  }

  const totalDocuments = Object.values(collectionStats).reduce(
    (sum, count) => sum + count,
    0
  );

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Warning color="error" />
        Reset Toàn Bộ Data
      </DialogTitle>

      <DialogContent>
        {!resetResult ? (
          <>
            <Alert severity="warning" sx={{ mb: 2 }}>
              <Typography fontWeight={600}>
                ⚠️ CẢNH BÁO: Hành động này sẽ xóa toàn bộ data trong hệ thống!
              </Typography>
              <Typography variant="body2" sx={{ mt: 1 }}>
                Tất cả dữ liệu về học sinh, lớp học, học phí, điểm danh, bài
                đăng sẽ bị xóa vĩnh viễn và không thể khôi phục.
                <strong>Dữ liệu người dùng (users) sẽ được giữ nguyên.</strong>
              </Typography>
            </Alert>

            <Typography variant="h6" fontWeight={600} mb={2}>
              Thống kê hiện tại:
            </Typography>

            {isLoadingStats ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', py: 2 }}>
                <CircularProgress />
              </Box>
            ) : (
              <List>
                {Object.entries(collectionStats).map(([collection, count]) => (
                  <ListItem key={collection}>
                    <ListItemIcon>
                      <Storage color="primary" />
                    </ListItemIcon>
                    <ListItemText
                      primary={collection}
                      secondary={`${count} documents`}
                    />
                    <Chip
                      label={count}
                      color={count > 0 ? 'error' : 'default'}
                      size="small"
                    />
                  </ListItem>
                ))}
                <ListItem>
                  <ListItemIcon>
                    <Storage color="error" />
                  </ListItemIcon>
                  <ListItemText
                    primary="Tổng cộng"
                    secondary={`${totalDocuments} documents sẽ bị xóa`}
                  />
                  <Chip label={totalDocuments} color="error" size="small" />
                </ListItem>
              </List>
            )}

            <Alert severity="error" sx={{ mt: 2 }}>
              <Typography fontWeight={600}>
                Bạn có chắc chắn muốn xóa toàn bộ {totalDocuments} documents này
                không?
              </Typography>
            </Alert>
          </>
        ) : (
          <Box>
            <Alert
              severity={resetResult.success ? 'success' : 'error'}
              sx={{ mb: 2 }}
              icon={resetResult.success ? <CheckCircle /> : <Error />}
            >
              <Typography fontWeight={600}>{resetResult.message}</Typography>
            </Alert>

            {resetResult.success && (
              <>
                <Typography variant="h6" fontWeight={600} mb={2}>
                  Kết quả reset:
                </Typography>
                <List>
                  {Object.entries(resetResult.deletedCounts).map(
                    ([collection, count]) => (
                      <ListItem key={collection}>
                        <ListItemIcon>
                          <CheckCircle color="success" />
                        </ListItemIcon>
                        <ListItemText
                          primary={collection}
                          secondary={`Đã xóa ${count} documents`}
                        />
                        <Chip label={count} color="success" size="small" />
                      </ListItem>
                    )
                  )}
                </List>
              </>
            )}
          </Box>
        )}
      </DialogContent>

      <DialogActions>
        <Button onClick={handleClose} disabled={isResetting}>
          {resetResult ? 'Đóng' : 'Hủy'}
        </Button>
        {!resetResult && (
          <Button
            onClick={handleResetData}
            variant="contained"
            color="error"
            disabled={isResetting || totalDocuments === 0}
            startIcon={
              isResetting ? <CircularProgress size={16} /> : <DeleteForever />
            }
          >
            {isResetting ? 'Đang xóa...' : 'Xóa toàn bộ data'}
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
}
