"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import StudentsApiDocumentation from "./students/page";
import ClassesApiDocumentation from "./classes/page";
import AuthApiDocumentation from "./auth/page";

export default function ApiDocumentation() {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">API Documentation</h1>
      <p className="italic text-red-500 my-5">
        Trong class Service *isBeutifyDate*: Nếu true, sẽ format lại các trường
        timestamp như CreatedAt, UpdatedAt thành chuỗi ngày tháng đẹp
      </p>
      <Tabs defaultValue="students" className="space-y-4">
        <TabsList>
          <TabsTrigger value="students">Students</TabsTrigger>
          <TabsTrigger value="classes">Classes</TabsTrigger>
          <TabsTrigger value="auth">Auth</TabsTrigger>
        </TabsList>

        <TabsContent value="students">
          <StudentsApiDocumentation />
        </TabsContent>

        <TabsContent value="classes">
          <ClassesApiDocumentation />
        </TabsContent>

        <TabsContent value="auth">
          <AuthApiDocumentation />
        </TabsContent>
      </Tabs>
    </div>
  );
}
