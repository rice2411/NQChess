// src/app/classes/page.tsx

"use client";

import { useState, useEffect } from "react";
import { Class } from "@/types/class";
import { ClassService } from "@/services/class";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

export default function ClassPage() {
  const [classes, setClasses] = useState<Class[]>([]);
  const [name, setName] = useState("");
  const [teacher, setTeacher] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingClass, setEditingClass] = useState<Class | null>(null);

  // Lấy danh sách lớp học
  const fetchClasses = async () => {
    setIsLoading(true);
    try {
      const classList = await ClassService.getClasses();
      setClasses(classList);
    } catch (error) {
      console.error("Error fetching classes:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Tạo lớp học mới
  const handleCreateClass = async () => {
    if (!name || !teacher) return;
    setIsLoading(true);
    try {
      await ClassService.createOrUpdateClass({
        name,
        students: [],
        startDate: "",
        endDate: "",
        schedule: "",
        status: "open",
      });
      fetchClasses(); // Refresh danh sách sau khi tạo
      setName("");
      setTeacher("");
    } catch (error) {
      console.error("Error creating class:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Tìm kiếm lớp học
  const handleSearch = () => {
    return classes.filter((cls) =>
      cls.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  // Cập nhật lớp học
  const handleUpdateClass = async () => {
    if (!editingClass) return;
    setIsLoading(true);
    try {
      await ClassService.createOrUpdateClass(editingClass);
      fetchClasses(); // Refresh danh sách sau khi cập nhật
      setEditingClass(null);
    } catch (error) {
      console.error("Error updating class:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Xóa lớp học
  const handleDeleteClass = async (id: string) => {
    setIsLoading(true);
    try {
      await ClassService.deleteClass(id);
      fetchClasses(); // Refresh danh sách sau khi xóa
    } catch (error) {
      console.error("Error deleting class:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchClasses();
  }, []);

  return (
    <div className="container mx-auto p-4 space-y-4">
      <h1 className="text-2xl font-bold mb-4">Quản lý lớp học</h1>

      <Card className="p-4">
        <h2 className="text-xl font-semibold mb-2">Thêm lớp học mới</h2>
        <div className="space-y-2">
          <Label htmlFor="name">Tên lớp</Label>
          <Input
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Nhập tên lớp"
          />
          <Label htmlFor="teacher">Giáo viên</Label>
          <Input
            id="teacher"
            value={teacher}
            onChange={(e) => setTeacher(e.target.value)}
            placeholder="Nhập tên giáo viên"
          />
          <Button onClick={handleCreateClass} disabled={isLoading}>
            {isLoading ? "Đang tạo..." : "Tạo lớp"}
          </Button>
        </div>
      </Card>

      <Card className="p-4">
        <h2 className="text-xl font-semibold mb-2">Tìm kiếm lớp học</h2>
        <Input
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Nhập tên lớp để tìm kiếm"
        />
        <Button onClick={handleSearch}>Tìm kiếm</Button>
      </Card>

      <Card className="p-4">
        <h2 className="text-xl font-semibold mb-2">Danh sách lớp học</h2>
        {handleSearch().length === 0 ? (
          <p>Không có lớp học nào.</p>
        ) : (
          <ul className="space-y-2">
            {handleSearch().map((cls) => (
              <li key={cls.id} className="border p-2 rounded">
                <h3 className="font-bold">{cls.name}</h3>
                <p>Số học sinh: {cls.students.length}</p>
                <Button onClick={() => setEditingClass(cls)}>Cập nhật</Button>
                <Button onClick={() => handleDeleteClass(cls.id)}>Xóa</Button>
              </li>
            ))}
          </ul>
        )}
      </Card>

      {editingClass && (
        <Card className="p-4">
          <h2 className="text-xl font-semibold mb-2">Cập nhật lớp học</h2>
          <Label htmlFor="editName">Tên lớp</Label>
          <Input
            id="editName"
            value={editingClass.name}
            onChange={(e) =>
              setEditingClass({ ...editingClass, name: e.target.value })
            }
            placeholder="Nhập tên lớp"
          />
          <Button onClick={handleUpdateClass} disabled={isLoading}>
            {isLoading ? "Đang cập nhật..." : "Cập nhật lớp"}
          </Button>
        </Card>
      )}
    </div>
  );
}
