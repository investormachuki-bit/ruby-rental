"use client";

import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import DataTable from "@/components/ui/DataTable";

import { Edit2, UserX } from "lucide-react";

import { Employee } from "@/types/employees";

interface Props {
  employees: Employee[];
  loading: boolean;
  onEdit: (employee: Employee) => void;
  onDeactivate: (employee: Employee) => void;
}

export default function EmployeeTable({
  employees,
  loading,
  onEdit,
  onDeactivate,
}: Props) {
  const columns = [
    {
      key: "full_name",
      header: "Employee",
      render: (employee: Employee) => (
        <div>
          <div className="font-medium">
            {employee.full_name}
          </div>

          <div className="text-sm text-gray-500">
            {employee.phone}
          </div>
        </div>
      ),
    },
    {
      key: "role",
      header: "Role",
      render: (employee: Employee) => (
        employee.role_name
      ),
    },
    {
      key: "designation",
      header: "Designation",
      render: (employee: Employee) => (
        employee.designation || "-"
      ),
    },
    {
      key: "status",
      header: "Status",
      render: (employee: Employee) => (
        <Badge
          variant={
            employee.employment_status === "Active"
              ? "success"
              : "secondary"
          }
        >
          {employee.employment_status}
        </Badge>
      ),
    },
    {
      key: "actions",
      header: "",
      render: (employee: Employee) => (
        <div className="flex justify-end gap-2">

          <Button
            variant="ghost"
            className="p-2 min-w-0"
            onClick={() => onEdit(employee)}
          >
            <Edit2 size={16} />
          </Button>

          <Button
            variant="ghost"
            className="p-2 min-w-0"
            onClick={() => onDeactivate(employee)}
          >
            <UserX size={16} />
          </Button>

        </div>
      ),
    },
  ];

  return (
    <Card>

      {employees.length === 0 && !loading ? (

        <div className="p-8 text-center text-gray-500">
          No employees found.
        </div>

      ) : (

        <DataTable
          columns={columns}
          data={employees}
          loading={loading}
        />

      )}

    </Card>
  );
}
