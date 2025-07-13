import { useEffect, useState } from 'react';
import { TuitionService } from '@/services/tuition.service';
import { useAuthStore } from '@/store/useAuthStore';

export const useTuitionAutoCreate = () => {
  const [isCreating, setIsCreating] = useState(false);
  const [lastCreatedMonth, setLastCreatedMonth] = useState<string | null>(null);
  const { user } = useAuthStore();

  useEffect(() => {
    const createTuitionIfNeeded = async () => {
      if (!user) return;

      try {
        setIsCreating(true);

        // Kiểm tra xem đã tạo học phí cho tháng hiện tại chưa
        const currentMonth =
          (typeof window !== 'undefined'
            ? new Date()
            : new Date(0)
          ).getFullYear() +
          '-' +
          String(
            (typeof window !== 'undefined'
              ? new Date()
              : new Date(0)
            ).getMonth() + 1
          ).padStart(2, '0');

        // Lưu tháng đã tạo vào localStorage để tránh tạo lại
        const storedMonth = localStorage.getItem('lastTuitionCreatedMonth');

        if (storedMonth !== currentMonth) {
          console.log('Tự động tạo học phí cho tháng hiện tại...');
          await TuitionService.createTuitionForCurrentMonth(user.uid);

          // Lưu tháng đã tạo
          localStorage.setItem('lastTuitionCreatedMonth', currentMonth);
          setLastCreatedMonth(currentMonth);

          console.log('Đã tạo học phí thành công cho tháng:', currentMonth);
        } else {
          console.log('Đã tạo học phí cho tháng này rồi:', currentMonth);
        }
      } catch (error) {
        console.error('Lỗi khi tự động tạo học phí:', error);
      } finally {
        setIsCreating(false);
      }
    };

    // Chạy khi user đăng nhập
    if (user) {
      createTuitionIfNeeded();
    }
  }, [user]);

  return {
    isCreating,
    lastCreatedMonth,
  };
};
