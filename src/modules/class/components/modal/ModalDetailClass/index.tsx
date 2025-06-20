import React, { useEffect, useMemo, useState } from "react"
import { format, parse } from "date-fns"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/core/components/ui/dialog"
import { Button } from "@/core/components/ui/button"
import { Badge } from "@/core/components/ui/badge"
import {
  IClass,
  IStudentClass,
} from "@/modules/class/interfaces/class.interface"
import {
  EClassStatus,
  EStudentClassStatus,
  EStudentClassType,
} from "@/modules/class/enums/class.enum"
import { formatCurrencyVND, formatCurrencyString } from "@/core/utils/currency.util"
import { useStudentQueries } from "@/modules/student/hooks/useStudentQueries"
import { useClassQueries } from "@/modules/class/hooks/useClassQueries"
import { IStudent } from "@/modules/student/interfaces/student.interface"
import BaseTable from "@/core/components/layout/admin/management/table/BaseTable"
import { Input } from "@/core/components/ui/input"
import { Label } from "@/core/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/core/components/ui/select"
import { Pencil, Plus } from "lucide-react"
import toast from "react-hot-toast"
import { Alert, AlertDescription } from "@/core/components/ui/alert"
import { Avatar, AvatarImage, AvatarFallback } from "@/core/components/ui/avatar"
import { Checkbox } from "@/core/components/ui/checkbox"
import { useQueryClient } from "@tanstack/react-query"
import { CLASS_QUERY_KEYS } from "@/modules/class/constants/classQueryKey"


const daysOfWeek = [
  "Thứ 2",
  "Thứ 3",
  "Thứ 4",
  "Thứ 5",
  "Thứ 6",
  "Thứ 7",
  "Chủ nhật",
]

interface ModalDetailClassProps {
  open: boolean
  onClose: () => void
  classData: IClass
  onSaveSuccess?: (updatedClass: IClass) => void
}

const statusMap: Record<EClassStatus, { label: string; color: string }> = {
  [EClassStatus.NOT_STARTED]: {
    label: "Chưa mở",
    color: "bg-gray-200 text-gray-700",
  },
  [EClassStatus.ACTIVE]: {
    label: "Đang hoạt động",
    color: "bg-green-200 text-green-700",
  },
  [EClassStatus.ENDED]: {
    label: "Đã kết thúc",
    color: "bg-red-200 text-red-700",
  },
}

const parseDate = (dateStr: string | Date): string => {
  if (!dateStr) return ""
  if (typeof dateStr === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(dateStr)) return dateStr
  try {
    const date = typeof dateStr === 'string' ? parse(dateStr, "dd/MM/yyyy", new Date()) : dateStr
    return format(date, "yyyy-MM-dd")
  } catch {
    return ""
  }
}

const ModalDetailClass: React.FC<ModalDetailClassProps> = ({
  open,
  onClose,
  classData,
  onSaveSuccess,
}) => {
  const [tab, setTab] = useState<"info" | "schedule" | "students">("info")
  const [isEditing, setIsEditing] = useState(false)
  const [formState, setFormState] = useState<IClass>(classData)
  const [editableSchedules, setEditableSchedules] = useState<{ start: string; end: string; day: string }[]>([])
  const [studentSearch, setStudentSearch] = useState("")
  const [addStudentType, setAddStudentType] = useState<EStudentClassType>(EStudentClassType.FULL)
  const [addStudentSession, setAddStudentSession] = useState<string>("")

  const { getByIdsQuery, getAllQuery } = useStudentQueries()
  const { createOrUpdateMutation } = useClassQueries()
  const queryClient = useQueryClient()

  const { data: studentsData, isLoading: studentsLoading, isError: studentsError } = getByIdsQuery(
    useMemo(() => classData?.students?.map((s) => s.studentId) || [], [classData])
  )

  useEffect(() => {
    if (open) {
      const formattedData = {
        ...classData,
        startDate: parseDate(classData.startDate),
        tuition: Number(classData.tuition) || 0,
        students: classData.students || [],
      }
      setFormState(formattedData)

      const parsedSchedules = (classData.schedules || []).map(s => {
        const match = s.match(/(\d{2}:\d{2}) - (\d{2}:\d{2}) (.+)/)
        return match ? { start: match[1], end: match[2], day: match[3] } : { start: "", end: "", day: daysOfWeek[0] }
      })
      setEditableSchedules(parsedSchedules.length > 0 ? parsedSchedules : [{ start: "", end: "", day: daysOfWeek[0] }])
    } else {
      setIsEditing(false)
      setTab("info")
    }
  }, [classData, open])

  useEffect(() => {
    if (open && isEditing) {
      getAllQuery.refetch()
    }
  }, [open, isEditing, getAllQuery])

  const allStudents = useMemo(() => {
    return getAllQuery.data?.success ? (getAllQuery.data.data as IStudent[]) || [] : []
  }, [getAllQuery.data])
  
  const enrolledStudentIds = useMemo(() => formState.students.map(s => s.studentId), [formState.students])
  
  const availableStudents = useMemo(() => {
    return allStudents.filter(s => 
      !enrolledStudentIds.includes(s.id) &&
      s.fullName.toLowerCase().includes(studentSearch.toLowerCase())
    )
  }, [allStudents, enrolledStudentIds, studentSearch])
  
  const enrolledStudentsDetails = useMemo(() => {
     return formState.students.map(s => {
       const details = allStudents.find(st => st.id === s.studentId)
       return { ...s, fullName: details?.fullName || "Không tìm thấy" }
     })
  }, [formState.students, allStudents])

  const displayStudents = useMemo(() => {
    if (!studentsData?.success) return []
    const studentMap = (studentsData.data as IStudent[]).reduce((acc: Record<string, IStudent>, student) => {
      acc[student.id] = student; return acc;
    }, {});
    return classData.students?.map(s => ({ ...s, id: s.studentId, fullName: studentMap[s.studentId]?.fullName || "Không xác định" })) || [];
  }, [classData.students, studentsData]);

  // Handlers
  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    const newFormState = { ...formState, [name]: name === 'tuition' ? formatCurrencyString(value) : value }
    setFormState(newFormState as any) // Use type assertion to manage string/number for tuition
  }
  
  const handleSelectChange = (name: string, value: any) => {
    setFormState(prev => ({ ...prev, [name]: value }))
  }
  
  // Schedule handlers
  const handleScheduleChange = (index: number, field: string, value: string) => {
    const newSchedules = [...editableSchedules]
    newSchedules[index] = { ...newSchedules[index], [field]: value }
    setEditableSchedules(newSchedules)
  }
  const addSchedule = () => {
    setEditableSchedules([...editableSchedules, { start: "", end: "", day: daysOfWeek[0] }])
  }
  const removeSchedule = (index: number) => {
    setEditableSchedules(editableSchedules.filter((_, i) => i !== index))
  }

  // Student handlers
  const handleAddStudent = (student: IStudent, type: EStudentClassType, session?: string) => {
      const baseTuition = Number(formState.tuition.toString().replace(/,/g, ""))
      const studentTuition = type === EStudentClassType.HALF ? baseTuition / 2 : baseTuition
      
      const newStudent: IStudentClass = {
          studentId: student.id,
          joinDate: new Date(),
          status: EStudentClassStatus.ONLINE,
          type,
          session: type === EStudentClassType.HALF ? session : undefined,
          tuition: studentTuition,
      }
      setFormState(prev => ({ ...prev, students: [...prev.students, newStudent] }))
  }
  const handleRemoveStudent = (studentId: string) => {
      setFormState(prev => ({...prev, students: prev.students.filter(s => s.studentId !== studentId)}))
  }

  const handleSave = () => {
    const scheduleStrings = editableSchedules.map(s => `${s.start} - ${s.end} ${s.day}`)
    const dataToSave = {
      ...formState,
      schedules: scheduleStrings,
      tuition: Number(formState.tuition.toString().replace(/,/g, "")),
      students: formState.students.map(({ fullName, ...rest }: any) => rest)
    }

    createOrUpdateMutation.mutate({ data: dataToSave as IClass }, {
      onSuccess: (res) => {
        if (res.success) {
          toast.success("Cập nhật lớp học thành công!")
          setIsEditing(false)
          
          queryClient.invalidateQueries({ queryKey: [CLASS_QUERY_KEYS.getAll] })
          queryClient.invalidateQueries({ queryKey: [CLASS_QUERY_KEYS.getById] })
          
          if (onSaveSuccess && res.data) {
            onSaveSuccess(res.data)
          }
          
          onClose()
        } else {
          toast.error(res.message || "Có lỗi xảy ra!")
        }
      },
      onError: (err) => toast.error("Lỗi: " + err.message),
    })
  }
  
  const renderInfoTab = () => (
    isEditing ? (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700">Tên lớp</Label>
              <Input 
                name="name" 
                value={formState.name} 
                onChange={handleFormChange}
                className="w-full"
                placeholder="Nhập tên lớp học"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700">Ngày bắt đầu</Label>
              <Input 
                name="startDate" 
                type="date" 
                value={formState.startDate} 
                onChange={handleFormChange}
                className="w-full"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700">Học phí (VNĐ)</Label>
              <Input 
                name="tuition" 
                value={formatCurrencyString(formState.tuition.toString())} 
                onChange={handleFormChange}
                className="w-full"
                placeholder="0"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700">Trạng thái</Label>
              <Select value={formState.status} onValueChange={(v) => handleSelectChange("status", v)}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Chọn trạng thái"/>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={EClassStatus.NOT_STARTED}>Chưa mở</SelectItem>
                  <SelectItem value={EClassStatus.ACTIVE}>Đang hoạt động</SelectItem>
                  <SelectItem value={EClassStatus.ENDED}>Đã kết thúc</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      ) : (
         <div className="space-y-6">
           <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-xl border border-blue-100">
             <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
               <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
               Thông tin cơ bản
             </h3>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               <div className="space-y-3">
                 <div className="flex items-center gap-3 p-3 bg-white rounded-lg border border-gray-100">
                   <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                     <span className="text-blue-600 font-semibold text-sm">📚</span>
                   </div>
                   <div>
                     <p className="text-sm font-medium text-gray-500">Tên lớp</p>
                     <p className="text-lg font-semibold text-gray-900">{classData.name}</p>
                   </div>
                 </div>
                 
                 <div className="flex items-center gap-3 p-3 bg-white rounded-lg border border-gray-100">
                   <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                     <span className="text-green-600 font-semibold text-sm">📅</span>
                   </div>
                   <div>
                     <p className="text-sm font-medium text-gray-500">Ngày bắt đầu</p>
                     <p className="text-lg font-semibold text-gray-900">{classData.startDate}</p>
                   </div>
                 </div>
               </div>
               
               <div className="space-y-3">
                 <div className="flex items-center gap-3 p-3 bg-white rounded-lg border border-gray-100">
                   <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                     <span className="text-purple-600 font-semibold text-sm">💰</span>
                   </div>
                   <div>
                     <p className="text-sm font-medium text-gray-500">Học phí</p>
                     <p className="text-lg font-semibold text-gray-900">{formatCurrencyVND(classData.tuition)}</p>
                   </div>
                 </div>
                 
                 <div className="flex items-center gap-3 p-3 bg-white rounded-lg border border-gray-100">
                   <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                     <span className="text-orange-600 font-semibold text-sm">📊</span>
                   </div>
                   <div>
                     <p className="text-sm font-medium text-gray-500">Trạng thái</p>
                     <Badge className={`${statusMap[classData.status].color} text-sm font-medium px-3 py-1`}>
                       {statusMap[classData.status].label}
                     </Badge>
                   </div>
                 </div>
               </div>
             </div>
           </div>
         </div>
      )
  )

  const renderScheduleTab = () => (
    isEditing ? (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">Lịch học</h3>
            <Button 
              variant="info"
              onClick={addSchedule} 
              className="flex items-center gap-2"
              disabled={editableSchedules.length >= 2}
            >
              <Plus className="w-4 h-4" />
              Thêm buổi học
            </Button>
          </div>
          
          <div className="space-y-4 max-h-[50vh] overflow-y-auto">
            {editableSchedules.map((sch, idx) => (
                <div key={idx} className="flex items-center gap-4 p-4 border border-gray-200 rounded-lg bg-gray-50">
                    <div className="flex items-center gap-2">
                      <Input 
                        type="time" 
                        value={sch.start} 
                        onChange={(e) => handleScheduleChange(idx, "start", e.target.value)}
                        className="w-32"
                      />
                      <span className="text-gray-500 font-medium">-</span>
                      <Input 
                        type="time" 
                        value={sch.end} 
                        onChange={(e) => handleScheduleChange(idx, "end", e.target.value)}
                        className="w-32"
                      />
                    </div>
                    <Select value={sch.day} onValueChange={(v) => handleScheduleChange(idx, "day", v)}>
                        <SelectTrigger className="w-40">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {daysOfWeek.map(d => (
                            <SelectItem key={d} value={d}>{d}</SelectItem>
                          ))}
                        </SelectContent>
                    </Select>
                    <Button 
                      variant="dark"
                      onClick={() => removeSchedule(idx)} 
                      disabled={editableSchedules.length <= 1}
                    >
                      Xóa
                    </Button>
                </div>
            ))}
          </div>
        </div>
    ) : (
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-xl border border-green-100">
            <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              Lịch học
            </h3>
            
            {classData.schedules?.length > 0 ? (
              <div className="space-y-4">
                {classData.schedules.map((sch, idx) => (
                  <div key={idx} className="flex items-center gap-4 p-4 bg-white rounded-lg border border-green-100 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 text-white rounded-xl font-bold text-lg">
                      {idx + 1}
                    </div>
                    <div className="flex-1">
                      <p className="text-lg font-semibold text-gray-900">{sch}</p>
                      <p className="text-sm text-gray-500">Buổi học thứ {idx + 1}</p>
                    </div>
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                      <span className="text-green-600 text-sm">✓</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-gray-400 text-2xl">📅</span>
                </div>
                <p className="text-gray-600 font-medium">Chưa có lịch học được thiết lập</p>
                <p className="text-gray-500 text-sm mt-1">Vui lòng chuyển sang chế độ chỉnh sửa để thêm lịch học</p>
              </div>
            )}
          </div>
        </div>
    )
  )

  const renderStudentsTab = () => {
    if (isEditing) {
        return (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900">Quản lý học sinh</h3>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Left Side: Enrolled Students */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="text-md font-semibold text-gray-800">Học sinh trong lớp</h4>
                    <Badge variant="secondary" className="text-sm">
                      {enrolledStudentsDetails.length} học sinh
                    </Badge>
                  </div>
                  
                  <div className="space-y-3 max-h-[45vh] overflow-y-auto pr-2">
                    {enrolledStudentsDetails.map(s => {
                      const studentDetails = allStudents.find(st => st.id === s.studentId);
                      return (
                        <div key={s.studentId} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg bg-white hover:bg-gray-50 transition-colors">
                          <div className="flex items-center gap-3">
                            <Avatar className="h-10 w-10">
                              <AvatarImage src={studentDetails?.avatar} alt={s.fullName} className="object-cover" />
                              <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white font-semibold text-sm">
                                  {s.fullName?.charAt(0)}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="font-medium text-gray-900">{s.fullName}</div>
                              <div className="text-sm text-gray-500">
                                {s.type === EStudentClassType.FULL ? (
                                  <Badge variant="secondary" className="text-xs">Học đầy đủ</Badge>
                                ) : (
                                  <Badge variant="secondary" className="text-xs">Nửa buổi: {s.session}</Badge>
                                )}
                              </div>
                            </div>
                          </div>
                          <Button 
                            variant="dark" 
                            onClick={() => handleRemoveStudent(s.studentId)}
                          >
                        Xóa
                          </Button>
                        </div>
                      )
                    })}
                    {enrolledStudentsDetails.length === 0 && (
                      <Alert className="bg-gray-50 border-gray-200">
                        <AlertDescription className="text-gray-600">Chưa có học sinh nào trong lớp.</AlertDescription>
                      </Alert>
                    )}
                  </div>
                </div>

                {/* Right Side: Add Students */}
                <div className="space-y-4">
                  <h4 className="text-md font-semibold text-gray-800">Thêm học sinh</h4>
                  
                  <div className="space-y-4">
                    <Input 
                      placeholder="Tìm kiếm theo tên..." 
                      value={studentSearch} 
                      onChange={e => setStudentSearch(e.target.value)}
                      className="w-full"
                    />
                    
                    <div className="space-y-3">
                      <div className="flex items-center gap-4 p-3 border border-gray-200 rounded-lg bg-gray-50">
                        <label className="flex items-center gap-2 text-sm cursor-pointer">
                          <Checkbox 
                            checked={addStudentType === EStudentClassType.FULL} 
                            onCheckedChange={() => setAddStudentType(EStudentClassType.FULL)} 
                          />
                          <span className="font-medium">Học đầy đủ</span>
                        </label>
                        <label className="flex items-center gap-2 text-sm cursor-pointer">
                          <Checkbox 
                            checked={addStudentType === EStudentClassType.HALF} 
                            onCheckedChange={() => setAddStudentType(EStudentClassType.HALF)} 
                          />
                          <span className="font-medium">Học nửa buổi</span>
                        </label>
                      </div>
                      
                      {addStudentType === EStudentClassType.HALF && (
                        <div className="space-y-2">
                          <Label className="text-sm font-medium text-gray-700">Chọn buổi học</Label>
                          <Select value={addStudentSession} onValueChange={setAddStudentSession}>
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Chọn buổi học"/>
                            </SelectTrigger>
                            <SelectContent>
                              {editableSchedules.map((sch, i) => (
                                <SelectItem key={i} value={`${sch.start} - ${sch.end} ${sch.day}`}>
                                  {`${sch.start} - ${sch.end} ${sch.day}`}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      )}
                    </div>
                    
                    <div className="space-y-2 max-h-[35vh] overflow-y-auto pr-2">
                      {getAllQuery.isLoading ? (
                        <div className="flex items-center justify-center py-8">
                          <div className="text-gray-500">Đang tải danh sách học sinh...</div>
                        </div>
                      ) : availableStudents.length > 0 ? (
                        availableStudents.map(s => (
                          <div key={s.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg bg-white hover:bg-gray-50 transition-colors">
                            <div className="flex items-center gap-3">
                               <Avatar className="h-8 w-8">
                                <AvatarImage src={s.avatar} alt={s.fullName} className="object-cover" />
                                <AvatarFallback className="bg-gradient-to-br from-green-500 to-blue-600 text-white font-semibold text-xs">
                                    {s.fullName?.charAt(0)}
                                </AvatarFallback>
                              </Avatar>
                              <span className="font-medium text-gray-900">{s.fullName}</span>
                            </div>
                              <Button 
                                size="sm" 
                                variant="info" 
                                onClick={() => handleAddStudent(s, addStudentType, addStudentSession)}
                              >
                                Thêm
                              </Button>
                          </div>
                        ))
                      ) : (
                        <Alert className="bg-gray-50 border-gray-200">
                          <AlertDescription className="text-gray-600">
                            {studentSearch ? "Không tìm thấy học sinh phù hợp." : "Tất cả học sinh đã có trong lớp."}
                          </AlertDescription>
                        </Alert>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
        )
    }

    const studentColumns = [
        { key: "STT", title: "STT", renderCell: (_: any, index: number) => index + 1 },
        { key: "fullName", title: "Họ và tên" },
        { key: "type", title: "Loại hình", renderCell: (row: any) => (
          <Badge variant={row.type === EStudentClassType.FULL ? "default" : "secondary"}>
            {row.type === EStudentClassType.FULL ? "Học đầy đủ" : `Học nửa buổi (${row.session || "-"})`}
          </Badge>
        )},
        { key: "tuition", title: "Học phí", renderCell: (row: any) => formatCurrencyVND(row.tuition) },
    ]

    return (
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-xl border border-purple-100">
            <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
              Danh sách học sinh
            </h3>
            
            {displayStudents.length > 0 ? (
              <div className="bg-white rounded-lg border border-purple-100 overflow-hidden">
                <BaseTable
                  columns={studentColumns}
                  data={displayStudents}
                  searchKeys={["fullName"]}
                  searchPlaceholder="Tìm kiếm học sinh..."
                  isLoading={studentsLoading}
                  isError={Boolean(studentsError)}
                  addButton={null}
                />
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-gray-400 text-2xl">👥</span>
                </div>
                <p className="text-gray-600 font-medium">Chưa có học sinh nào</p>
                <p className="text-gray-500 text-sm mt-1">Vui lòng chuyển sang chế độ chỉnh sửa để thêm học sinh</p>
              </div>
            )}
          </div>
        </div>
    )
  }

  const renderContent = () => {
    switch (tab) {
      case "info":
        return renderInfoTab()
      case "schedule":
        return renderScheduleTab()
      case "students":
        return renderStudentsTab()
      default:
        return null
    }
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="min-w-4xl w-full h-min-content">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Chi tiết lớp học: {classData.name}</DialogTitle>
          <DialogDescription>
            Xem và chỉnh sửa thông tin lớp học, lịch học và danh sách học sinh.
          </DialogDescription>
        </DialogHeader>

        <div className="flex items-center space-x-2 border-b pb-4">
          <Button variant={tab === 'info' ? 'secondary' : 'light'} onClick={() => setTab('info')}>Thông tin</Button>
          <Button variant={tab === 'schedule' ? 'secondary' : 'light'} onClick={() => setTab('schedule')}>Lịch học</Button>
          <Button variant={tab === 'students' ? 'secondary' : 'light'} onClick={() => setTab('students')}>Học sinh</Button>
        </div>

        <div className="mt-4 min-h-[50vh]">
          {renderContent()}
        </div>
        
        <DialogFooter className="mt-6">
          <div className="flex justify-between w-full">
            <Button
              variant={isEditing ? "light" : "secondary"}
              onClick={() => setIsEditing(!isEditing)}
              className="flex items-center gap-2"
            >
              <Pencil className="w-4 h-4" />
              {isEditing ? "Hủy" : "Chỉnh sửa"}
            </Button>
            {isEditing && (
              <Button
                variant="primary"
                onClick={handleSave}
                disabled={createOrUpdateMutation.isPending}
              >
                {createOrUpdateMutation.isPending ? "Đang lưu..." : "Lưu thay đổi"}
              </Button>
            )}
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default ModalDetailClass
