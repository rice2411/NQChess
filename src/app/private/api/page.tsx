"use client"

import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/common/ui/tabs"
import StudentsApiDocumentation from "./students/page"
import ClassesApiDocumentation from "./classes/page"
import AuthApiDocumentation from "./auth/page"
import TuitionsApiDocumentation from "./tuitions/page"
import Link from "next/link"

export default function ApiDocumentation() {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">API Documentation</h1>
      <Link href="/" className="text-blue-500 hover:text-blue-700 underline">
        Về trang chủ
      </Link>
      <p className="italic text-red-500 my-5">
        Trong class Service *isBeautifyDate*: Nếu true, sẽ format lại các trường
        timestamp như CreatedAt, UpdatedAt thành chuỗi ngày tháng đẹp
      </p>
      <Tabs defaultValue="students" className="space-y-4">
        <TabsList>
          <TabsTrigger value="students">Students</TabsTrigger>
          <TabsTrigger value="classes">Classes</TabsTrigger>
          <TabsTrigger value="tuitions">Tuitions</TabsTrigger>
          <TabsTrigger value="auth">Auth</TabsTrigger>
        </TabsList>

        <TabsContent value="students">
          <StudentsApiDocumentation />
        </TabsContent>

        <TabsContent value="classes">
          <ClassesApiDocumentation />
        </TabsContent>

        <TabsContent value="tuitions">
          <TuitionsApiDocumentation />
        </TabsContent>

        <TabsContent value="auth">
          <AuthApiDocumentation />
        </TabsContent>
      </Tabs>
    </div>
  )
}
