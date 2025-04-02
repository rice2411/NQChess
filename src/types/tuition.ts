export interface Tuition {
  id?: string;
  classId: string;
  studentId: string;
  month: string; // Format: YYYY-MM
  amount: number;
  status: "pending" | "paid" | "overdue";
  dueDate: string; // Format: YYYY-MM-DD
  paidDate?: string; // Format: YYYY-MM-DD
  createdAt: string;
  updatedAt: string;
}
