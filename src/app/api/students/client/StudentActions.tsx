"use client";

import { Button } from "@/components/ui/button";
import { StudentService } from "@/services/students";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface StudentActionsProps {
  selectedStudents: string[];
}

export function StudentActions({ selectedStudents }: StudentActionsProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleCreate = async () => {
    setIsLoading(true);
    try {
      const newStudent = {
        fullName: "New Student",
        dateOfBirth: "2000-01-01",
        phoneNumber: "123456789",
      };
      await StudentService.createOrUpdateStudent(newStudent);
      router.refresh();
    } catch (error) {
      console.error("Error creating student:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdate = async () => {
    console.log(selectedStudents);
    if (selectedStudents.length === 0) {
      console.log("Please select a student to update.");
      return;
    }
    setIsLoading(true);
    try {
      const updatedStudent = {
        fullName: "Updated Student",
        dateOfBirth: "1999-01-01",
        phoneNumber: "987654321",
      };
      await StudentService.updateStudent(selectedStudents[0], updatedStudent);
      router.refresh();
    } catch (error) {
      console.error("Error updating student:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (selectedStudents.length === 0) {
      console.log("Please select a student to delete.");
      return;
    }
    setIsLoading(true);
    try {
      await StudentService.deleteStudent(selectedStudents[0]);
      router.refresh();
    } catch (error) {
      console.error("Error deleting student:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex space-x-2 mb-4">
      <Button onClick={() => router.refresh()} disabled={isLoading}>
        GET
      </Button>
      <Button onClick={handleCreate} disabled={isLoading}>
        CREATE
      </Button>
      <Button
        onClick={handleUpdate}
        disabled={isLoading || selectedStudents.length === 0}
      >
        UPDATE
      </Button>
      <Button
        onClick={handleDelete}
        disabled={isLoading || selectedStudents.length === 0}
      >
        DELETE
      </Button>
    </div>
  );
}
