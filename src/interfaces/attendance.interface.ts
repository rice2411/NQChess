import { IBaseEntity } from './base.interface';

export enum EAttendanceStatus {
  PRESENT = 'PRESENT',
  ABSENT = 'ABSENT',
  LATE = 'LATE',
  EXCUSED = 'EXCUSED',
}

export enum EAttendanceType {
  CHECK_IN = 'CHECK_IN',
  CHECK_OUT = 'CHECK_OUT',
}

export interface IAttendanceRecord {
  studentId: string;
  studentName?: string;
  status: EAttendanceStatus;
  note?: string;
  sessionNumber: number; // Số buổi học (1, 2, 3...)
  studentSession?: string; // Buổi học của học sinh (session-0, session-1, hoặc schedule label)
}

export interface IAttendanceSession {
  classId: string;
  className?: string;
  sessionNumber: number;
  sessionDate: string; // Format: YYYY-MM-DD
  sessionTime: string; // Format: "HH:mm - HH:mm"
  attendanceRecords: IAttendanceRecord[];
  totalStudents: number;
  presentCount: number;
  absentCount: number;
  lateCount: number;
  excusedCount: number;
}

export interface IAttendance extends IBaseEntity {
  classId: string;
  className?: string;
  sessionNumber: number;
  sessionDate: string;
  sessionTime: string;
  attendanceRecords: IAttendanceRecord[];
  totalStudents: number;
  presentCount: number;
  absentCount: number;
  lateCount: number;
  excusedCount: number;
  notes?: string;
  createdBy?: string;
}

export interface IAttendanceSummary {
  classId: string;
  className?: string;
  studentId: string;
  studentName?: string;
  totalSessions: number;
  presentSessions: number;
  absentSessions: number;
  lateSessions: number;
  excusedSessions: number;
  attendanceRate: number; // Tỷ lệ điểm danh (0-100)
}

export interface IAttendanceFilter {
  classId?: string;
  studentId?: string;
  startDate?: string;
  endDate?: string;
  status?: EAttendanceStatus;
}
