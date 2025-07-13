import { useEffect, useState } from 'react';
import { AttendanceService } from '@/services/attendance.service';
import { ClassService } from '@/services/class.service';
import { useAuthStore } from '@/store/useAuthStore';
import { format } from 'date-fns';

export const useAttendanceAutoCreate = () => {
  const [isCreating, setIsCreating] = useState(false);
  const [lastCreatedMonth, setLastCreatedMonth] = useState<string | null>(null);
  const { user } = useAuthStore();

  useEffect(() => {
    const createAttendanceIfNeeded = async () => {
      if (!user) return;

      try {
        setIsCreating(true);

        // Kiểm tra xem đã tạo buổi điểm danh cho tháng hiện tại chưa
        const currentMonth = format(
          typeof window !== 'undefined' ? new Date() : new Date(0),
          'yyyy-MM'
        );

        // Lưu tháng đã tạo vào localStorage để tránh tạo lại
        const storedMonth = localStorage.getItem('lastAttendanceCreatedMonth');

        if (storedMonth !== currentMonth) {
          console.log('Tự động tạo buổi điểm danh cho tháng hiện tại...');
          await createAttendanceForCurrentMonth(user.uid);

          // Lưu tháng đã tạo
          localStorage.setItem('lastAttendanceCreatedMonth', currentMonth);
          setLastCreatedMonth(currentMonth);

          console.log(
            'Đã tạo buổi điểm danh thành công cho tháng:',
            currentMonth
          );
        } else {
          console.log('Đã tạo buổi điểm danh cho tháng này rồi:', currentMonth);
        }
      } catch (error) {
        console.error('Lỗi khi tự động tạo buổi điểm danh:', error);
      } finally {
        setIsCreating(false);
      }
    };

    // Chạy khi user đăng nhập
    if (user) {
      createAttendanceIfNeeded();
    }
  }, [user]);

  // Hàm tạo buổi điểm danh cho tháng hiện tại
  const createAttendanceForCurrentMonth = async (createdBy?: string) => {
    const currentDate =
      typeof window !== 'undefined' ? new Date() : new Date(0);
    const currentMonth = format(currentDate, 'yyyy-MM');

    try {
      // Lấy tất cả lớp học
      const classesResult = await ClassService.getClasses(1, 1000);

      for (const classData of classesResult.classes) {
        try {
          await createAttendanceForClassInMonth(
            classData.id,
            currentMonth,
            createdBy
          );
        } catch (error) {
          console.error(
            `Lỗi khi tạo buổi điểm danh cho lớp ${classData.name}:`,
            error
          );
        }
      }

      console.log(`Đã tạo buổi điểm danh cho tháng ${currentMonth}`);
    } catch (error) {
      console.error('Lỗi khi tạo buổi điểm danh cho tháng hiện tại:', error);
      throw error;
    }
  };

  // Hàm tạo buổi điểm danh cho lớp cụ thể trong tháng
  const createAttendanceForClassInMonth = async (
    classId: string,
    month: string,
    createdBy?: string
  ) => {
    try {
      await AttendanceService.createAttendanceForMonth(
        classId,
        month,
        createdBy
      );
    } catch (error) {
      console.error(
        `Lỗi khi tạo buổi điểm danh cho lớp ${classId} tháng ${month}:`,
        error
      );
      throw error;
    }
  };

  return {
    isCreating,
    lastCreatedMonth,
    createAttendanceForCurrentMonth,
    createAttendanceForClassInMonth,
  };
};
