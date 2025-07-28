'use client';
import StudentDetail from '@/components/pages/admin/student/StudentDetail';

interface StudentDetailPageProps {
  params: {
    id: string;
  };
}

export default function StudentDetailPage({ params }: StudentDetailPageProps) {
  return <StudentDetail studentId={params.id} />;
}
