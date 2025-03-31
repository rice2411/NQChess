"use client";

import { useState } from "react";
import { Student } from "@/types/student";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { StudentService } from "@/services/students";
import Link from "next/link"; // Import Link
export default function StudentsPage() {
  const [students, setStudents] = useState<Student[]>([]);
  const [selectedStudents, setSelectedStudents] = useState<Student[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchCriteria, setSearchCriteria] = useState({
    fullName: "",
    dateOfBirth: "",
    phoneNumber: "",
  });

  // Get List
  const handleGetList = async () => {
    try {
      setIsLoading(true);
      const results = await StudentService.readStudents();
      setStudents(results);
    } catch (error) {
      console.error("Error getting students:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Search
  const handleSearch = async () => {
    try {
      setIsLoading(true);
      const foundStudent = await StudentService.searchStudent(searchCriteria);
      setStudents(foundStudent ? [foundStudent] : []);
    } catch (error) {
      console.error("Error searching student:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Create
  const handleCreate = async () => {
    try {
      setIsLoading(true);
      const newStudent = {
        fullName: "Nguyễn Văn A",
        dateOfBirth: "2000-01-01",
        phoneNumber: "0123456789",
        avatar: "https://via.placeholder.com/150",
        gender: "Nam",
        classes: ["Lớp 1", "Lớp 2"],
      };
      await StudentService.createOrUpdateStudent(newStudent);
      handleGetList(); // Refresh list after create
    } catch (error) {
      console.error("Error creating student:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Update
  const handleUpdate = async () => {
    if (selectedStudents.length !== 1) {
      alert("Vui lòng chọn đúng 1 học sinh để cập nhật");
      return;
    }

    try {
      setIsLoading(true);
      const studentToUpdate = selectedStudents[0];
      await StudentService.updateStudent(studentToUpdate.id!, {
        fullName: "Nguyễn Văn B",
        dateOfBirth: "2001-01-01",
        phoneNumber: "0987654321",
      });
      handleGetList(); // Refresh list after update
    } catch (error) {
      console.error("Error updating student:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Delete
  const handleDelete = async () => {
    if (selectedStudents.length === 0) {
      alert("Vui lòng chọn ít nhất 1 học sinh để xóa");
      return;
    }

    try {
      setIsLoading(true);
      for (const student of selectedStudents) {
        await StudentService.deleteStudent(student.id!);
      }
      handleGetList(); // Refresh list after delete
    } catch (error) {
      console.error("Error deleting students:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSearchCriteria((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCheckboxChange = (student: Student) => {
    setSelectedStudents((prev) => {
      const isSelected = prev.some((s) => s.id === student.id);
      if (isSelected) {
        return prev.filter((s) => s.id !== student.id);
      } else {
        return [...prev, student];
      }
    });
  };

  return (
    <div className="container mx-auto p-4 space-y-4">
      <Card className="p-4">
        <h1 className="text-2xl font-bold mb-4">Quản lý học sinh</h1>
        <Link href="/" className="text-blue-500 mb-4 inline-block">
          Về trang chính
        </Link>

        {/* Search Form */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div className="space-y-2">
            <Label htmlFor="fullName">Họ và tên</Label>
            <Input
              id="fullName"
              name="fullName"
              value={searchCriteria.fullName}
              onChange={handleInputChange}
              placeholder="Nhập họ và tên"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="dateOfBirth">Ngày sinh</Label>
            <Input
              id="dateOfBirth"
              name="dateOfBirth"
              type="date"
              value={searchCriteria.dateOfBirth}
              onChange={handleInputChange}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phoneNumber">Số điện thoại</Label>
            <Input
              id="phoneNumber"
              name="phoneNumber"
              value={searchCriteria.phoneNumber}
              onChange={handleInputChange}
              placeholder="Nhập số điện thoại"
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-2 mb-4">
          <Button onClick={handleGetList} disabled={isLoading}>
            {isLoading ? "Đang tải..." : "Lấy danh sách"}
          </Button>
          <Button onClick={handleSearch} disabled={isLoading}>
            {isLoading ? "Đang tìm..." : "Tìm kiếm"}
          </Button>
          <Button onClick={handleCreate} disabled={isLoading}>
            {isLoading ? "Đang tạo..." : "Tạo mới"}
          </Button>
          <Button
            onClick={handleUpdate}
            disabled={isLoading || selectedStudents.length !== 1}
          >
            {isLoading ? "Đang cập nhật..." : "Cập nhật"}
          </Button>
          <Button
            onClick={handleDelete}
            disabled={isLoading || selectedStudents.length === 0}
          >
            {isLoading ? "Đang xóa..." : "Xóa"}
          </Button>
        </div>

        {/* Student List */}
        <div className="space-y-2">
          <h2 className="text-xl font-semibold mb-2">Danh sách học sinh</h2>
          {students.map((student) => (
            <div
              key={student.id}
              className="flex items-center gap-4 p-2 border rounded"
            >
              <Checkbox
                checked={selectedStudents.some((s) => s.id === student.id)}
                onCheckedChange={() => handleCheckboxChange(student)}
              />
              <div>
                <p>
                  <strong>ID:</strong> {student.id}
                </p>
                <p>
                  <strong>Họ tên:</strong> {student.fullName}
                </p>
                <p>
                  <strong>Ngày sinh:</strong> {student.dateOfBirth}
                </p>
                <p>
                  <strong>Số điện thoại:</strong> {student.phoneNumber}
                </p>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
