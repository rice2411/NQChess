// src/app/api/classes/page.tsx

"use client";

import { useState } from "react";
import { Class } from "@/types/class";
import { Student } from "@/types/student";
import { ClassService } from "@/services/class";
import { StudentService } from "@/services/student";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import Link from "next/link";
import { updateClassesStatus } from "@/helper/classHelpers";

export default function ClassPage() {
  const [classes, setClasses] = useState<Class[]>([]);
  const [selectedClasses, setSelectedClasses] = useState<Class[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [selectedStudents, setSelectedStudents] = useState<Student[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchCriteria, setSearchCriteria] = useState({
    name: "",
    startDate: "",
    endDate: "",
  });

  // Get List
  const handleGetList = async () => {
    try {
      setIsLoading(true);
      const results = await ClassService.getClasses();
      // Cập nhật trạng thái cho danh sách lớp học
      const updatedClasses = updateClassesStatus(results);
      setClasses(updatedClasses);
    } catch (error) {
      console.error("Error getting classes:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Get Students List
  const handleGetStudents = async () => {
    try {
      setIsLoading(true);
      const results = await StudentService.getStudents();
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
      const allClasses = await ClassService.getClasses();
      const filteredClasses = allClasses.filter((cls) => {
        const matchesName = searchCriteria.name
          ? cls.name.toLowerCase().includes(searchCriteria.name.toLowerCase())
          : true;
        const matchesStartDate = searchCriteria.startDate
          ? cls.startDate === searchCriteria.startDate
          : true;
        const matchesEndDate = searchCriteria.endDate
          ? cls.endDate === searchCriteria.endDate
          : true;

        return matchesName && matchesStartDate && matchesEndDate;
      });
      // Cập nhật trạng thái cho danh sách lớp học đã lọc
      const updatedClasses = updateClassesStatus(filteredClasses);
      setClasses(updatedClasses);
    } catch (error) {
      console.error("Error searching classes:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Create
  const handleCreate = async () => {
    try {
      setIsLoading(true);
      const newClass = {
        name: "Lớp mới",
        startDate: new Date().toISOString().split("T")[0],
        endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
          .toISOString()
          .split("T")[0],
        students: [],
        schedule: "Thứ 2-6",
        status: "not_started" as const,
      };
      await ClassService.createOrUpdateClass(newClass);
      handleGetList(); // Refresh list after create
    } catch (error) {
      console.error("Error creating class:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Update
  const handleUpdate = async () => {
    if (selectedClasses.length !== 1) {
      alert("Vui lòng chọn đúng 1 lớp để cập nhật");
      return;
    }

    try {
      setIsLoading(true);
      const classToUpdate = selectedClasses[0];
      await ClassService.updateClass(classToUpdate.id!, {
        name: "Lớp đã cập nhật",
        schedule: "Thứ 2-5",
      });
      handleGetList(); // Refresh list after update
    } catch (error) {
      console.error("Error updating class:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Delete
  const handleDelete = async () => {
    if (selectedClasses.length === 0) {
      alert("Vui lòng chọn ít nhất 1 lớp để xóa");
      return;
    }

    try {
      setIsLoading(true);
      for (const cls of selectedClasses) {
        await ClassService.deleteClass(cls.id!);
      }
      handleGetList(); // Refresh list after delete
    } catch (error) {
      console.error("Error deleting classes:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Add or Remove Students from Class
  const handleAddStudents = async () => {
    if (selectedClasses.length !== 1) {
      alert("Vui lòng chọn đúng 1 lớp để thêm/xóa học sinh");
      return;
    }

    if (selectedStudents.length === 0) {
      alert("Vui lòng chọn ít nhất 1 học sinh");
      return;
    }

    try {
      setIsLoading(true);
      const classToUpdate = selectedClasses[0];
      const studentIds = selectedStudents.map((student) => student.id!);
      await ClassService.toggleStudent(classToUpdate.id!, studentIds);
      handleGetList(); // Refresh list after updating students
      setSelectedStudents([]); // Clear selected students after operation
    } catch (error) {
      console.error("Error toggling students in class:", error);
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

  const handleCheckboxChange = (cls: Class) => {
    setSelectedClasses((prev) => {
      const isSelected = prev.some((c) => c.id === cls.id);
      if (isSelected) {
        return prev.filter((c) => c.id !== cls.id);
      } else {
        return [...prev, cls];
      }
    });
  };

  const handleStudentCheckboxChange = (student: Student) => {
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
        <h1 className="text-2xl font-bold mb-4">Quản lý lớp học</h1>
        <Link href="/" className="text-blue-500 mb-4 inline-block">
          Về trang chính
        </Link>

        {/* Search Form */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div className="space-y-2">
            <Label htmlFor="name">Tên lớp</Label>
            <Input
              id="name"
              name="name"
              value={searchCriteria.name}
              onChange={handleInputChange}
              placeholder="Nhập tên lớp"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="startDate">Ngày bắt đầu</Label>
            <Input
              id="startDate"
              name="startDate"
              type="date"
              value={searchCriteria.startDate}
              onChange={handleInputChange}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="endDate">Ngày kết thúc</Label>
            <Input
              id="endDate"
              name="endDate"
              type="date"
              value={searchCriteria.endDate}
              onChange={handleInputChange}
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 mb-4">
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
            disabled={isLoading || selectedClasses.length !== 1}
          >
            {isLoading ? "Đang cập nhật..." : "Cập nhật"}
          </Button>
          <Button
            onClick={handleDelete}
            disabled={isLoading || selectedClasses.length === 0}
          >
            {isLoading ? "Đang xóa..." : "Xóa"}
          </Button>
        </div>

        {/* Class List */}
        <div className="space-y-2">
          <h2 className="text-xl font-semibold mb-2">Danh sách lớp học</h2>
          {classes.map((cls) => (
            <div
              key={cls.id}
              className="flex items-center gap-4 p-2 border rounded"
            >
              <Checkbox
                checked={selectedClasses.some((c) => c.id === cls.id)}
                onCheckedChange={() => handleCheckboxChange(cls)}
              />
              <div>
                <p>
                  <strong>ID:</strong> {cls.id}
                </p>
                <p>
                  <strong>Tên lớp:</strong> {cls.name}
                </p>
                <p>
                  <strong>Ngày bắt đầu:</strong> {cls.startDate}
                </p>
                <p>
                  <strong>Ngày kết thúc:</strong> {cls.endDate}
                </p>
                <p>
                  <strong>Lịch học:</strong> {cls.schedule}
                </p>
                <p>
                  <strong>Trạng thái:</strong> {cls.status}
                </p>
                <p>
                  <strong>Số học sinh:</strong> {cls.students.length}
                </p>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Student Selection Card */}
      <Card className="p-4">
        <h2 className="text-xl font-semibold mb-2">
          Thêm/Xóa học sinh khỏi lớp
        </h2>
        <div className="flex gap-2 mb-4">
          <Button onClick={handleGetStudents} disabled={isLoading}>
            {isLoading ? "Đang tải..." : "Lấy danh sách học sinh"}
          </Button>
          <Button
            onClick={handleAddStudents}
            disabled={
              isLoading ||
              selectedClasses.length !== 1 ||
              selectedStudents.length === 0
            }
          >
            {isLoading ? "Đang xử lý..." : "Thêm/Xóa học sinh"}
          </Button>
        </div>

        <div className="space-y-2">
          <h3 className="text-lg font-medium mb-2">Danh sách học sinh</h3>
          {students.map((student) => (
            <div
              key={student.id}
              className="flex items-center gap-4 p-2 border rounded"
            >
              <Checkbox
                checked={selectedStudents.some((s) => s.id === student.id)}
                onCheckedChange={() => handleStudentCheckboxChange(student)}
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
