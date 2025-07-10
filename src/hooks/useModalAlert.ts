import { useModalContext } from '@/providers/ModalProvider';

interface AlertConfig {
  title?: string;
  message: string;
  okText?: string;
  onClose?: () => void;
}

export function useModalAlert() {
  const { showAlert } = useModalContext();

  const alert = (config: AlertConfig) => {
    showAlert({
      title: config.title || 'Thông báo',
      message: config.message,
      okText: config.okText || 'OK',
      onClose: config.onClose,
    });
  };

  return { alert };
}
