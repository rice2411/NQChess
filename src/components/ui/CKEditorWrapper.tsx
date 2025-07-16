'use client';

import dynamic from 'next/dynamic';

// Create a wrapper component for CKEditor
const CKEditorWrapper = dynamic(() => import('./CKEditorInner'), {
  ssr: false,
  loading: () => (
    <div
      style={{
        minHeight: '400px',
        border: '1px solid #e0e0e0',
        borderRadius: '4px',
        padding: '16px',
        backgroundColor: '#f5f5f5',
      }}
    >
      <div style={{ color: '#666', textAlign: 'center', paddingTop: '180px' }}>
        Đang tải editor...
      </div>
    </div>
  ),
});

interface CKEditorWrapperProps {
  data: string;
  onChange: (data: string) => void;
  config?: any;
}

export default function CKEditorWrapperComponent({
  data,
  onChange,
  config,
}: CKEditorWrapperProps) {
  return <CKEditorWrapper data={data} onChange={onChange} config={config} />;
}
