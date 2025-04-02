"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tuition } from "@/types/tuition";
import { Class } from "@/types/class";
import { Student } from "@/types/student";
import { ClassService } from "@/services/class";
import { StudentService } from "@/services/student";
import { TuitionService } from "@/services/tuition";
import { format } from "date-fns";
import { vi } from "date-fns/locale";

export default function TuitionsPage() {
  const [classes, setClasses] = useState<Class[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [tuitions, setTuitions] = useState<Tuition[]>([]);
  const [selectedClass, setSelectedClass] = useState<string>("");
  const [selectedStudent, setSelectedStudent] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);

  // Lấy danh sách lớp học
  const handleGetClasses = async () => {
    try {
      setIsLoading(true);
      const data = await ClassService.getClasses();
      setClasses(data);
    } catch (error) {
      console.error("Error getting classes:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Lấy danh sách học sinh
  const handleGetStudents = async () => {
    try {
      setIsLoading(true);
      const data = await StudentService.getStudents();
      setStudents(data);
    } catch (error) {
      console.error("Error getting students:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Lấy danh sách học phí
  const handleGetTuitions = async () => {
    if (!selectedClass || !selectedStudent) return;

    try {
      setIsLoading(true);
      const data = await TuitionService.getTuitionsByClassAndStudent(
        selectedClass,
        selectedStudent
      );
      setTuitions(data);
    } catch (error) {
      console.error("Error getting tuitions:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Cập nhật trạng thái học phí
  const handleUpdateStatus = async (
    tuitionId: string,
    status: Tuition["status"]
  ) => {
    console.log(tuitionId);
    try {
      setIsLoading(true);
      await TuitionService.updateTuitionStatus(tuitionId, status);
      handleGetTuitions(); // Refresh danh sách học phí
    } catch (error) {
      console.error("Error updating tuition status:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    handleGetClasses();
    handleGetStudents();
  }, []);

  useEffect(() => {
    if (selectedClass && selectedStudent) {
      handleGetTuitions();
    }
  }, [selectedClass, selectedStudent]);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Quản lý học phí</h1>

      {/* Lọc theo lớp và học sinh */}
      <Card className="p-4 mb-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Chọn lớp</label>
            <select
              className="w-full p-2 border rounded"
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
            >
              <option value="">Chọn lớp</option>
              {classes.map((cls) => (
                <option key={cls.id} value={cls.id}>
                  {cls.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Chọn học sinh
            </label>
            <select
              className="w-full p-2 border rounded"
              value={selectedStudent}
              onChange={(e) => setSelectedStudent(e.target.value)}
            >
              <option value="">Chọn học sinh</option>
              {students.map((student) => (
                <option key={student.id} value={student.id}>
                  {student.fullName}
                </option>
              ))}
            </select>
          </div>
        </div>
      </Card>

      {/* Danh sách học phí */}
      <Card className="p-4">
        <h2 className="text-xl font-semibold mb-4">Danh sách học phí</h2>
        {isLoading ? (
          <p>Đang tải...</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="bg-gray-100">
                  <th className="p-2 text-left">Tháng</th>
                  <th className="p-2 text-left">Số tiền</th>
                  <th className="p-2 text-left">Hạn nộp</th>
                  <th className="p-2 text-left">Trạng thái</th>
                  <th className="p-2 text-left">Ngày nộp</th>
                  <th className="p-2 text-left">Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {tuitions.map((tuition) => (
                  <tr key={tuition.id} className="border-b">
                    <td className="p-2">
                      {format(new Date(tuition.month + "-01"), "MMMM yyyy", {
                        locale: vi,
                      })}
                    </td>
                    <td className="p-2">
                      {tuition.amount.toLocaleString("vi-VN")}đ
                    </td>
                    <td className="p-2">
                      {format(new Date(tuition.dueDate), "dd/MM/yyyy", {
                        locale: vi,
                      })}
                    </td>
                    <td className="p-2">
                      <span
                        className={`px-2 py-1 rounded text-sm ${
                          tuition.status === "paid"
                            ? "bg-green-100 text-green-800"
                            : tuition.status === "overdue"
                            ? "bg-red-100 text-red-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {tuition.status === "paid"
                          ? "Đã nộp"
                          : tuition.status === "overdue"
                          ? "Quá hạn"
                          : "Chờ nộp"}
                      </span>
                    </td>
                    <td className="p-2">
                      {tuition.paidDate
                        ? format(new Date(tuition.paidDate), "dd/MM/yyyy", {
                            locale: vi,
                          })
                        : "-"}
                    </td>
                    <td className="p-2">
                      {tuition.status === "paid" ? (
                        <Button
                          onClick={() =>
                            handleUpdateStatus(tuition.id!, "pending")
                          }
                          className="bg-red-500 hover:bg-red-600"
                        >
                          Hủy đánh dấu
                        </Button>
                      ) : (
                        <Button
                          onClick={() =>
                            handleUpdateStatus(tuition.id!, "paid")
                          }
                          className="bg-green-500 hover:bg-green-600"
                        >
                          Đánh dấu đã nộp
                        </Button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
}
