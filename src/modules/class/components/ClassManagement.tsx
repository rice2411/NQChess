"use client";

import { useEffect, useState } from "react";
import { Pencil, Trash, Users, PlusCircle } from "lucide-react";
import { useClassQueries } from "@/modules/class/hooks/useClassQueries";
import { IClass } from "@/modules/class/interfaces/class.interface";
import ManagementBase from "@/core/components/layout/admin/management/ManagementBase";
import useModal from "@/core/hooks/useModal";
import BaseModal from "@/core/components/ui/BaseModal";
import ConfirmModal from "@/core/components/ui/ConfirmModal";
import { Input } from "@/core/components/ui/input";
import { Button } from "@/core/components/ui/button";
import { Label } from "@/core/components/ui/label";
import { EClassStatus } from "@/modules/class/enums/class.enum";
import ClassModal from "./ClassModal";

const columns = [
  { key: "STT", title: "STT", renderCell: (_: IClass, index: number) => index + 1 },
  { key: "name", title: "Tên lớp" },
  { key: "startDate", title: "Ngày bắt đầu" },
  { key: "endDate", title: "Ngày kết thúc" },
  { key: "status", title: "Trạng thái" },
  { key: "tuition", title: "Học phí" },
];

export default function ClassManagement() {
  const { getAllQuery, deleteMutation } = useClassQueries();
  const modal = useModal();
  const confirmModal = useModal();
  const [editClass, setEditClass] = useState<IClass | null>(null);
  const [classToDelete, setClassToDelete] = useState<IClass | null>(null);

  useEffect(() => {
    getAllQuery.refetch();
  }, []);

  const classes = getAllQuery.data?.success ? getAllQuery.data.data || [] : [];
  const isLoading = getAllQuery.isLoading || getAllQuery.isFetching;
  const isError = getAllQuery.isError;

  const statistics = [
    {
      icon: <Users />,
      title: "Tổng số lớp",
      value: classes.length,
    },
    // Có thể bổ sung thêm thống kê khác nếu muốn
  ];

  const handleEdit = (classItem: IClass) => {
    setEditClass(classItem);
    modal.open();
  };

  const handleDelete = (classItem: IClass) => {
    setClassToDelete(classItem);
    confirmModal.open();
  };

  const handleConfirmDelete = () => {
    if (classToDelete) {
      deleteMutation.mutate(classToDelete.id, {
        onSuccess: () => {
          getAllQuery.refetch();
          confirmModal.close();
          setClassToDelete(null);
        },
      });
    }
  };

  const addButton = (
    <button
      className="ml-0 md:ml-auto bg-green-500 text-white px-4 sm:px-5 py-2 rounded-full hover:bg-green-600 shadow-lg transition flex items-center gap-2 mt-2 md:mt-0 font-semibold text-sm sm:text-base"
      onClick={() => {
        setEditClass(null);
        modal.open();
      }}
    >
      <PlusCircle className="h-5 w-5" />
      Thêm lớp học
    </button>
  );

  return (
    <>
      <ManagementBase
        statistics={statistics}
        isLoading={isLoading}
        isError={isError}
        data={classes}
        columns={columns}
        addButton={addButton}
        renderAction={(row: IClass) => (
          <div className="flex gap-2">
            <button
              className="p-2 rounded hover:bg-primary-100 text-primary-600 transition"
              title="Sửa"
              onClick={() => handleEdit(row)}
            >
              <Pencil className="w-4 h-4" />
            </button>
            <button
              className="p-2 rounded hover:bg-red-100 text-red-600 transition"
              title="Xóa"
              onClick={() => handleDelete(row)}
            >
              <Trash className="w-4 h-4" />
            </button>
          </div>
        )}
      />
      <ClassModal open={modal.isOpen} onClose={modal.close} initialData={editClass} refetch={getAllQuery.refetch} />
      <ConfirmModal
        open={confirmModal.isOpen}
        onClose={confirmModal.close}
        onConfirm={handleConfirmDelete}
        title="Xác nhận xóa"
        description={`Bạn có chắc muốn xóa lớp học "${classToDelete?.name}"?`}
        loading={deleteMutation.isPending}
      />
    </>
  );
}
