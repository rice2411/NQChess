import React from "react";

interface BaseModalProps {
  open: boolean;
  onClose: () => void;
  title?: React.ReactNode;
  children?: React.ReactNode;
  footer?: React.ReactNode;
  width?: string;
}

export default function BaseModal({
  open,
  onClose,
  title,
  children,
  footer,
  width = "min-w-[320px] max-w-full sm:min-w-[400px]",
}: BaseModalProps) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/10 backdrop-blur-sm">
      <div className={`bg-white rounded-lg p-6 relative ${width}`}>
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-black text-2xl"
        >
          ×
        </button>
        {title && <h2 className="text-lg font-bold mb-4">{title}</h2>}
        <div>{children}</div>
        {footer && <div className="mt-4">{footer}</div>}
      </div>
    </div>
  );
} 