import { useQuery } from "@tanstack/react-query";
import { StudentService } from "@/services/student/student.service";

export function useStudents(isBeutifyDate: boolean = false) {
  return useQuery({
    queryKey: ["students", isBeutifyDate],
    queryFn: () => StudentService.getStudents(isBeutifyDate),
  });
}

export function useSearchStudents(
  fullName: string,
  dateOfBirth: string,
  phoneNumber: string,
  isBeutifyDate: boolean = false
) {
  return useQuery({
    queryKey: [
      "students",
      "search",
      fullName,
      dateOfBirth,
      phoneNumber,
      isBeutifyDate,
    ],
    queryFn: () =>
      StudentService.searchStudent(
        fullName,
        dateOfBirth,
        phoneNumber,
        isBeutifyDate
      ),
    enabled: !!fullName && !!dateOfBirth && !!phoneNumber, // Chỉ thực hiện query khi có đủ thông tin
  });
}
