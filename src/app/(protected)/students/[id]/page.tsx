'use client';
import { use } from 'react';
import StudentDetail from '@/components/pages/admin/student/StudentDetail';

interface StudentDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function StudentDetailPage({ params }: StudentDetailPageProps) {
  const { id } = use(params);
  return <StudentDetail studentId={id} />;
}
