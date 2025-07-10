import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
} from '@mui/material';
import { Warning } from '@mui/icons-material';

interface ModalAlertProps {
  open: boolean;
  title: string;
  message: string;
  okText?: string;
  onClose: () => void;
}

export default function ModalAlert({
  open,
  title,
  message,
  okText = 'OK',
  onClose,
}: ModalAlertProps) {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Warning color="warning" />
        {title}
      </DialogTitle>
      <DialogContent>
        <Typography>{message}</Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} autoFocus variant="contained">
          {okText}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
