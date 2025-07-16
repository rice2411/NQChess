'use client';

import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';

// Dynamic import for CKEditor to avoid SSR issues
const CKEditor = dynamic(
  () => import('@ckeditor/ckeditor5-react').then(mod => mod.CKEditor),
  { ssr: false }
);

// Dynamic import for ClassicEditor to avoid SSR issues
const ClassicEditor = dynamic(
  () => import('@ckeditor/ckeditor5-build-classic'),
  { ssr: false }
);

interface CKEditorWrapperProps {
  data: string;
  onChange: (data: string) => void;
  config?: any;
}

export default function CKEditorWrapper({
  data,
  onChange,
  config,
}: CKEditorWrapperProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div
        style={{
          minHeight: '400px',
          border: '1px solid #e0e0e0',
          borderRadius: '4px',
          padding: '16px',
          backgroundColor: '#f5f5f5',
        }}
      >
        <div
          style={{ color: '#666', textAlign: 'center', paddingTop: '180px' }}
        >
          Đang tải editor...
        </div>
      </div>
    );
  }

  return (
    <CKEditor
      editor={ClassicEditor as any}
      data={data}
      onChange={(event: any, editor: any) => {
        const data = editor.getData();
        onChange(data);
      }}
      config={{
        toolbar: [
          'heading',
          '|',
          'bold',
          'italic',
          'link',
          'bulletedList',
          'numberedList',
          '|',
          'outdent',
          'indent',
          '|',
          'imageUpload',
          'blockQuote',
          'insertTable',
          'mediaEmbed',
          'undo',
          'redo',
        ],
        language: 'vi',
        ...config,
      }}
    />
  );
}
