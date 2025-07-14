'use client';
import React, { createContext, useContext, useState, ReactNode } from 'react';
import ModalConfirm from '@/components/ui/Modal/ModalConfirm';
import ModalAlert from '@/components/ui/Modal/ModalAlert';

// Confirm Modal types
interface ConfirmModalState {
  open: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  loading?: boolean;
  onConfirm: () => void | Promise<void>;
}

// Alert Modal types
interface AlertModalState {
  open: boolean;
  title: string;
  message: string;
  okText?: string;
  onClose?: () => void;
}

interface ModalContextType {
  showConfirm: (config: Omit<ConfirmModalState, 'open' | 'loading'>) => void;
  showAlert: (config: Omit<AlertModalState, 'open'>) => void;
  hideConfirm: () => void;
  hideAlert: () => void;
}

const ModalContext = createContext<ModalContextType | undefined>(undefined);

export function ModalProvider({ children }: { children: ReactNode }) {
  // Confirm modal state
  const [confirmModal, setConfirmModal] = useState<ConfirmModalState>({
    open: false,
    title: '',
    message: '',
    confirmText: 'Xác nhận',
    cancelText: 'Hủy',
    loading: false,
    onConfirm: () => {},
  });
  // Alert modal state
  const [alertModal, setAlertModal] = useState<AlertModalState>({
    open: false,
    title: '',
    message: '',
    okText: 'OK',
    onClose: undefined,
  });

  // Confirm
  const showConfirm = (config: Omit<ConfirmModalState, 'open' | 'loading'>) => {
    setConfirmModal({
      ...config,
      open: true,
      loading: false,
    });
  };
  const hideConfirm = () => {
    setConfirmModal(prev => ({ ...prev, open: false, loading: false }));
  };
  const handleConfirm = async () => {
    setConfirmModal(prev => ({ ...prev, loading: true }));
    try {
      await confirmModal.onConfirm();
      hideConfirm();
    } catch (error) {
      console.error(error);
      // Có thể xử lý lỗi ở đây nếu muốn
    } finally {
      setConfirmModal(prev => ({ ...prev, loading: false }));
    }
  };

  // Alert
  const showAlert = (config: Omit<AlertModalState, 'open'>) => {
    setAlertModal({
      ...config,
      open: true,
    });
  };
  const hideAlert = () => {
    setAlertModal(prev => {
      if (prev.onClose) prev.onClose();
      return { ...prev, open: false };
    });
  };

  return (
    <ModalContext.Provider
      value={{ showConfirm, showAlert, hideConfirm, hideAlert }}
    >
      {children}
      <ModalConfirm
        open={confirmModal.open}
        title={confirmModal.title}
        message={confirmModal.message}
        confirmText={confirmModal.confirmText}
        cancelText={confirmModal.cancelText}
        loading={confirmModal.loading}
        onConfirm={handleConfirm}
        onClose={hideConfirm}
      />
      <ModalAlert
        open={alertModal.open}
        title={alertModal.title}
        message={alertModal.message}
        okText={alertModal.okText}
        onClose={hideAlert}
      />
    </ModalContext.Provider>
  );
}

export function useModalContext() {
  const context = useContext(ModalContext);
  if (!context)
    throw new Error('useModalContext must be used within ModalProvider');
  return context;
}
