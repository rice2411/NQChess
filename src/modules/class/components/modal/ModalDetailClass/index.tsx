import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/core/components/ui/dialog"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/core/components/ui/tabs"
import { Calendar, Users, BookOpen } from "lucide-react"
import { IClass } from "@/modules/class/interfaces/class.interface"
import { StatusBadge } from "./StatusBadge"
import GeneralInfoTab from "./GeneralInfoTab"
import TuitionTab from "./TuitionTab"
import LessonsTab from "./LessonsTab"

interface ModalDetailClassProps {
  open: boolean
  onClose: () => void
  classData: IClass
}

export default function ModalDetailClass({
  open,
  onClose,
  classData,
}: ModalDetailClassProps) {
  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="w-full bg-white !max-w-2xl transition-all duration-500 ease-in-out">
        <DialogHeader className="pb-4">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-lg font-medium">
              Chi tiết lớp học: {classData.name}{" "}
              <StatusBadge status={classData.status} />
            </DialogTitle>
          </div>
        </DialogHeader>

        <Tabs defaultValue="general" className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-gray-100 p-1 rounded-lg">
            <TabsTrigger
              value="general"
              className="data-[state=active]:bg-white data-[state=active]:text-primary-600 data-[state=active]:shadow-sm rounded-md transition-all duration-200"
            >
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Thông tin chung
              </div>
            </TabsTrigger>
            <TabsTrigger
              value="tuition"
              className="data-[state=active]:bg-white data-[state=active]:text-primary-600 data-[state=active]:shadow-sm rounded-md transition-all duration-200"
            >
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4" />
                Học phí
              </div>
            </TabsTrigger>
            <TabsTrigger
              value="lessons"
              className="data-[state=active]:bg-white data-[state=active]:text-primary-600 data-[state=active]:shadow-sm rounded-md transition-all duration-200"
            >
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4" />
                Buổi học
              </div>
            </TabsTrigger>
          </TabsList>

          <TabsContent
            value="general"
            className="transition-transform duration-300 ease-in-out data-[state=inactive]:opacity-0 data-[state=active]:opacity-100"
          >
            <GeneralInfoTab classData={classData} />
          </TabsContent>

          <TabsContent
            value="tuition"
            className="transition-transform duration-300 ease-in-out data-[state=inactive]:opacity-0 data-[state=active]:opacity-100"
          >
            <TuitionTab classData={classData} />
          </TabsContent>

          <TabsContent
            value="lessons"
            className="transition-transform duration-300 ease-in-out data-[state=inactive]:opacity-0 data-[state=active]:opacity-100"
          >
            <LessonsTab classData={classData} />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
