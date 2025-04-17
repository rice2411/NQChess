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
    id: "attendance",
    label: "Attendance",
    component: <AttendancesApiDocumentation />,
  },
  {
    id: "lesson",
    label: "Lesson",
    component: <LessonsApiDocumentation />,
  },
]

export default function ApiDocumentPage() {
  return (
    <div className="max-w-9xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12">
      <div className="text-center mb-6 sm:mb-8 lg:mb-12">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-2 sm:mb-3 lg:mb-4">
          API Documentation
        </h1>
        <p className="text-base sm:text-lg lg:text-xl text-white/90">
          Explore and test our API endpoints
        </p>
      </div>

      <div className="bg-white/5 backdrop-blur-sm border-white/10 rounded-lg p-4 sm:p-5 lg:p-6">
        <Tabs defaultValue={API_MODULES[0].id} className="w-full">
          <TabsList className="flex flex-wrap w-full gap-2 mb-4 sm:mb-5 lg:mb-6">
            {API_MODULES.map((module) => (
              <TabsTrigger
                key={module.id}
                value={module.id}
                className="flex-1 min-w-[120px] sm:min-w-[140px] text-sm sm:text-base text-white/90 hover:text-white hover:bg-white/10 data-[state=active]:bg-white/20 data-[state=active]:text-white py-1.5 sm:py-2"
              >
                {module.label}
              </TabsTrigger>
            ))}
          </TabsList>
          <div className="mt-[200px] sm:mt-[100px] md:mt-[80px] lg:mt-0">
            {API_MODULES.map((module) => (
              <TabsContent
                key={module.id}
                value={module.id}
                className="mt-2 sm:mt-3 lg:mt-4"
              >
                {module.component}
              </TabsContent>
            ))}
          </div>
        </Tabs>
      </div>
    </div>
  )
}
