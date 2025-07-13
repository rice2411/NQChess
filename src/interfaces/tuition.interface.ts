import { IBaseEntity } from './base.interface';

export enum ETuitionStatus {
  PENDING = 'PENDING', // Chưa đóng
  PAID = 'PAID', // Đã đóng
  OVERDUE = 'OVERDUE', // Quá hạn
}

export interface ITuitionFee extends IBaseEntity {
  classId: string;
  className: string;
  studentId: string;
  studentName: string;
  month: string; // Format: YYYY-MM
  year: number;
  monthNumber: number; // 1-12
  amount: number; // Số tiền cần đóng
  paidAmount: number; // Số tiền đã đóng
  status: ETuitionStatus;
  dueDate: string; // Ngày hạn đóng
  paidDate?: string; // Ngày đóng (nếu đã đóng)
  note?: string;
  createdBy?: string;
  updatedBy?: string;
}

export interface ITuitionSummary {
  classId: string;
  className: string;
  month: string;
  totalStudents: number;
  totalAmount: number;
  paidAmount: number;
  pendingAmount: number;
  overdueAmount: number;
  paidCount: number;
  pendingCount: number;
  overdueCount: number;
}
