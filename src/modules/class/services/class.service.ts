import {
  createOrUpdateDocument,
  readDocument,
  updateDocument,
  deleteDocument,
  readDocuments,
} from "@/core/service/firestore.service"
import { IClass } from "@/modules/class/interfaces/class.interface"
import {
  IErrorResponse,
  ISuccessResponse,
} from "@/core/types/api/response.interface"
import { serverTimestamp } from "firebase/firestore"
import {
  EClassStatus,
  EStudentClassStatus,
} from "@/modules/class/enums/class.enum"
import { ETuitionStatus } from "@/modules/tuition/enum/tuition.enum"
import { TuitionService } from "@/modules/tuition/services/tuition.service"
import { IGetRequest } from "@/core/types/api/request.interface"
import {
  calculateTuitionMonths,
  calculateLessonsInMonth,
  calculateActualLessons,
} from "../../tuition/helpers/tuition.helper"
import { ClassValidator } from "../validators/class.validator"
import { CLASS_MESSAGE } from "../constants/classMessages"
import { generateLessons } from "../../lesson/helper/lesson.helper"
import { LessonService } from "@/modules/lesson/services/lesson.service"

interface FirestoreTimestamp {
  seconds: number
  nanoseconds: number
}

const COLLECTION_NAME = "classes"

export const ClassService = {
  // Create
  createOrUpdate: async (
    data: Omit<IClass, "id">,
    isBeautifyDate: boolean = true
  ): Promise<ISuccessResponse<IClass> | IErrorResponse> => {
    // Validate data

    const isUpdate = !!(data as any).id
    let oldStudents: { studentId: string }[] = []
    let classId: string | undefined = (data as any).id
    if (isUpdate && classId) {
      // Lấy danh sách học sinh cũ
      const oldClass = await readDocument<IClass>(COLLECTION_NAME, classId)
      if (oldClass.success && oldClass.data) {
        oldStudents = oldClass.data.students || []
      }
    }

    const newClass: Omit<IClass, "id"> = {
      ...data,
      students: data.students || [],
      status: data.status || EClassStatus.INACTIVE,
      tuition: data.tuition || 0,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    }

    const result = (await createOrUpdateDocument<Omit<IClass, "id">>(
      COLLECTION_NAME,
      newClass
    )) as ISuccessResponse<IClass>

    // So sánh học sinh mới và cũ, chỉ tạo học phí cho học sinh mới
    const newStudentIds = (data.students || []).map((s) => s.studentId)
    const oldStudentIds = oldStudents.map((s) => s.studentId)
    const addedStudentIds = newStudentIds.filter(
      (id) => !oldStudentIds.includes(id)
    )
    if (addedStudentIds.length > 0 && result.data?.id) {
      await ClassService.addStudentsToClass(result.data.id, addedStudentIds)
    }

    if (!result.success || !result.data) {
      return {
        success: false,
        errorCode: "CREATE_FAILED",
        message: CLASS_MESSAGE.ERRORS.MESSAGES.CREATE_FAILED,
      }
    }

    // Generate and create lessons
    const lessons = generateLessons(
      data.startDate,
      data.endDate,
      data.schedules
    )

    for (const lesson of lessons) {
      await LessonService.createOrUpdate(
        {
          ...lesson,
          classId: (result.data as IClass).id,
        },
        isBeautifyDate
      )
    }
    return {
      success: true,
      message: CLASS_MESSAGE.SUCCESS.MESSAGES.CREATE_SUCCESS,
      data: result.data as IClass,
    }
  },

  // Read
  getAll: async (
    params: IGetRequest
  ): Promise<ISuccessResponse<IClass[]> | IErrorResponse> => {
    const result = await readDocuments<IClass>(COLLECTION_NAME, [], params)
    if (!result.success) return result as IErrorResponse
    return result as ISuccessResponse<IClass[]>
  },

  getById: async (
    id: string,
    isBeautifyDate: boolean = true
  ): Promise<ISuccessResponse<IClass> | IErrorResponse> => {
    const result = await readDocument<IClass>(
      COLLECTION_NAME,
      id,
      isBeautifyDate
    )
    if (!result.success) {
      return {
        success: false,
        errorCode: "CLASS_NOT_FOUND",
        message: CLASS_MESSAGE.ERRORS.MESSAGES.CLASS_NOT_FOUND,
      }
    }
    return result as ISuccessResponse<IClass>
  },

  // Delete
  delete: async (
    id: string
  ): Promise<ISuccessResponse<null> | IErrorResponse> => {
    const result = await deleteDocument(COLLECTION_NAME, id)
    if (!result.success) {
      return {
        success: false,
        errorCode: "DELETE_FAILED",
        message: CLASS_MESSAGE.ERRORS.MESSAGES.DELETE_FAILED,
      }
    }
    return {
      success: true,
      message: CLASS_MESSAGE.SUCCESS.MESSAGES.DELETE_SUCCESS,
      data: null,
    }
  },

  // Add students to class
  addStudentsToClass: async (
    classId: string,
    studentIds: string[]
  ): Promise<ISuccessResponse<IClass> | IErrorResponse> => {
    // Validate student IDs
    const classResult = await readDocument<IClass>(COLLECTION_NAME, classId)
    if (!classResult.success) return classResult as IErrorResponse
    const classData = classResult.data
    if (!classData) {
      return {
        success: false,
        errorCode: "CLASS_NOT_FOUND",
        message: CLASS_MESSAGE.ERRORS.MESSAGES.CLASS_NOT_FOUND,
      }
    }

    const newStudents = studentIds.map((id) => ({
      studentId: id,
      joinDate: new Date(),
      status: EStudentClassStatus.ONLINE,
    }))
    // Create tuition for new students
    for (const student of newStudents) {
      // Convert joinDate to ISO string
      let joinDate: string
      if (student.joinDate instanceof Date) {
        joinDate = student.joinDate.toISOString()
      } else if (
        student.joinDate &&
        typeof student.joinDate === "object" &&
        "seconds" in student.joinDate
      ) {
        const timestamp = student.joinDate as FirestoreTimestamp
        joinDate = new Date(timestamp.seconds * 1000).toISOString()
      } else {
        joinDate = new Date().toISOString()
      }

      const months = calculateTuitionMonths(
        classData.startDate,
        classData.endDate,
        joinDate.slice(0, 10)
      )

      for (let i = 0; i < months.length; i++) {
        const month = months[i]
        let amount = classData.tuition || 0

        // Calculate adjusted tuition for first month
        if (i === 0) {
          const totalLessons = calculateLessonsInMonth(
            classData.startDate,
            classData.endDate,
            classData.schedules
          )
          const actualLessons = calculateActualLessons(
            student.joinDate,
            classData.endDate,
            classData.schedules
          )

          // Calculate adjusted amount based on actual lessons
          if (totalLessons > 0) {
            amount = Math.round((actualLessons / totalLessons) * amount)
          } else {
            amount = 0
          }
        }
        const test = {
          classId,
          studentId: student.studentId,
          amount,
          month,
          status: ETuitionStatus.PENDING,
        }

        await TuitionService.createForStudent(test)
      }
    }

    return {
      success: true,
      message: CLASS_MESSAGE.SUCCESS.MESSAGES.ADD_STUDENTS_SUCCESS,
      data: classData as IClass,
    }
  },
}
