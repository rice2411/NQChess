'use client';
import { useModalContext } from '@/providers/ModalProvider';

interface ConfirmConfig {
  title?: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
}

export function useModalConfirm() {
  const { showConfirm } = useModalContext();

  const confirm = (
    onConfirm: () => void | Promise<void>,
    config: ConfirmConfig
  ) => {
    showConfirm({
      title: config.title || 'Xác nhận',
      message: config.message,
      confirmText: config.confirmText || 'Xóa',
      cancelText: config.cancelText || 'Hủy',
      onConfirm,
    });
  };

  return { confirm };
}
