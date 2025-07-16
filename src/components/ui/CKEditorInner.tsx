'use client';

import { useEffect, useState } from 'react';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

interface CKEditorInnerProps {
  data: string;
  onChange: (data: string) => void;
  config?: any;
}

export default function CKEditorInner({
  data,
  onChange,
  config,
}: CKEditorInnerProps) {
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
