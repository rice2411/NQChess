"use client"

import AttendancesApiDocumentation from "@/modules/attendance/components/AttendancesApiDocumentation"
import AuthApiDocumentation from "@/modules/auth/components/AuthApiDocumentation"
import ClassesApiDocumentation from "@/modules/class/components/ClassesApiDocumentation"
import LessonsApiDocumentation from "@/modules/lesson/components/LessonsApiDocumentation"
import StudentsApiDocumentation from "@/modules/student/components/StudentsApiDocumentation"
import TuitionsApiDocumentation from "@/modules/tuition/components/TuitionsApiDocumentation"
import UsersApiDocumentation from "@/modules/user/components/UsersApiDocumentation"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/shared/components/ui/tabs"
import Link from "next/link"
import { ReactNode } from "react"

// Define type for API module
type ApiModule = {
  id: string
  label: string
  component: ReactNode
}

// Configuration for API modules
const API_MODULES: ApiModule[] = [
  {
    id: "student",
    label: "Student",
    component: <StudentsApiDocumentation />,
  },
  {
    id: "class",
    label: "Class",
    component: <ClassesApiDocumentation />,
  },
  {
    id: "tuition",
    label: "Tuition",
    component: <TuitionsApiDocumentation />,
  },
  {
    id: "auth",
    label: "Auth",
    component: <AuthApiDocumentation />,
  },
  {
    id: "user",
    label: "User",
    component: <UsersApiDocumentation />,
  },
  {
    id: "lesson",
    label: "Lesson",
    component: <LessonsApiDocumentation />,
  },
  {
    id: "attendance",
    label: "Attendance",
    component: <AttendancesApiDocumentation />,
  },
]

export default function ApiDocumentation() {
  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="space-y-2">
        <h1 className="text-2xl font-bold">API Documentation</h1>
        <Link
          href="/"
          className="text-blue-500 hover:text-blue-700 underline inline-block"
        >
          Về trang chủ
        </Link>
      </div>

      <div className="bg-yellow-50 p-4 rounded-md border border-yellow-200">
        <p className="text-yellow-800">
          <span className="font-semibold">Lưu ý:</span> Trong class Service{" "}
          <code className="bg-yellow-100 px-1 rounded">isBeautifyDate</code>:
          Nếu <code className="bg-yellow-100 px-1 rounded">true</code>, sẽ
          format lại các trường timestamp như CreatedAt, UpdatedAt thành chuỗi
          ngày tháng đẹp
        </p>
      </div>

      <Tabs defaultValue={API_MODULES[0].id} className="space-y-4">
        <TabsList className="flex-wrap">
          {API_MODULES.map((module) => (
            <TabsTrigger
              key={module.id}
              value={module.id}
              className="cursor-pointer hover:bg-amber-100"
            >
              {module.label}
            </TabsTrigger>
          ))}
        </TabsList>

        {API_MODULES.map((module) => (
          <TabsContent key={module.id} value={module.id}>
            {module.component}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  )
}
