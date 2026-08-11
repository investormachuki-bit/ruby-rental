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
      render: (employee: Employee) =>
        employee.role_name || "-",
    },
    {
      key: "designation",
      header: "Designation",
      render: (employee: Employee) =>
        employee.designation || "-",
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
            className="min-w-0 p-2"
            onClick={() => onEdit(employee)}
          >
            <Edit2 size={16} />
          </Button>

          <Button
            variant="ghost"
            className="min-w-0 p-2"
            onClick={() =>
              onDeactivate(employee)
            }
          >
            <UserX size={16} />
          </Button>
        </div>
      ),
    },
  ];

  if (loading) {
    return (
      <Card>
        <div className="p-8 text-center text-sm text-gray-500">
          Loading employees...
        </div>
      </Card>
    );
  }

  if (employees.length === 0) {
    return (
      <Card>
        <div className="p-8 text-center text-gray-500">
          No employees found.
        </div>
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden p-0">

      {/* Desktop */}

      <div className="hidden md:block">
        <DataTable
          columns={columns}
          data={employees}
        />
      </div>

      {/* Mobile */}

      <div className="divide-y divide-gray-100 md:hidden">

        {employees.map((employee) => (
          <div
            key={employee.id}
            className="p-5"
          >

            <div className="flex items-start justify-between gap-4">

              <div className="min-w-0">

                <h3 className="truncate text-base font-semibold text-gray-900">
                  {employee.full_name}
                </h3>

                <p className="mt-1 text-sm text-gray-500">
                  {employee.phone}
                </p>

              </div>

              <Badge
                variant={
                  employee.employment_status ===
                  "Active"
                    ? "success"
                    : "secondary"
                }
              >
                {employee.employment_status}
              </Badge>

            </div>

            <div className="mt-4 grid grid-cols-2 gap-4">

              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                  Role
                </p>

                <p className="mt-1 text-sm font-medium text-gray-800">
                  {employee.role_name || "-"}
                </p>
              </div>

              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                  Designation
                </p>

                <p className="mt-1 text-sm font-medium text-gray-800">
                  {employee.designation || "-"}
                </p>
              </div>

            </div>

            <div className="mt-4 flex gap-2 border-t border-gray-100 pt-4">

              <Button
                variant="ghost"
                className="flex-1"
                onClick={() =>
                  onEdit(employee)
                }
              >
                <Edit2
                  size={16}
                  className="mr-2"
                />
                Edit
              </Button>

              <Button
                variant="ghost"
                className="flex-1"
                onClick={() =>
                  onDeactivate(employee)
                }
              >
                <UserX
                  size={16}
                  className="mr-2"
                />
                Deactivate
              </Button>

            </div>

          </div>
        ))}

      </div>

    </Card>
  );
}