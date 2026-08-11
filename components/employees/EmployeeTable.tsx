"use client";

import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import DataTable from "@/components/ui/DataTable";

import {
  Edit2,
  UserX,
  Users,
} from "lucide-react";

import { Employee } from "@/types/employees";

interface Props {
  employees: Employee[];
  loading: boolean;
  onEdit: (employee: Employee) => void;
  onDeactivate: (employee: Employee) => void;
}

function getInitials(
  name: string
) {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) =>
      part.charAt(0).toUpperCase()
    )
    .join("");
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
        <div className="flex items-center gap-3">

          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#D4AF37]/10 text-sm font-bold text-[#B8941F]">
            {getInitials(
              employee.full_name
            )}
          </div>

          <div>
            <div className="font-semibold text-gray-900">
              {employee.full_name}
            </div>

            <div className="text-sm text-gray-500">
              {employee.phone}
            </div>
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
            employee.employment_status ===
            "Active"
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
        <div className="flex justify-end gap-1">

          <Button
            variant="ghost"
            className="min-w-0 p-2"
            onClick={() =>
              onEdit(employee)
            }
            title="Edit employee"
          >
            <Edit2 size={16} />
          </Button>

          <Button
            variant="ghost"
            className="min-w-0 p-2"
            onClick={() =>
              onDeactivate(employee)
            }
            title="Deactivate employee"
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
        <div className="flex min-h-40 items-center justify-center">
          <p className="text-sm text-gray-500">
            Loading employees...
          </p>
        </div>
      </Card>
    );
  }

  if (employees.length === 0) {
    return (
      <Card>
        <div className="flex min-h-52 flex-col items-center justify-center px-6 text-center">

          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-gray-100 text-gray-400">
            <Users size={22} />
          </div>

          <h3 className="font-semibold text-gray-900">
            No employees yet
          </h3>

          <p className="mt-1 max-w-sm text-sm text-gray-500">
            Add your first employee to start managing your team.
          </p>

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

            {/* Employee identity */}

            <div className="flex items-center justify-between gap-4">

              <div className="flex min-w-0 items-center gap-3">

                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#D4AF37]/10 text-base font-bold text-[#B8941F]">
                  {getInitials(
                    employee.full_name
                  )}
                </div>

                <div className="min-w-0">

                  <h3 className="truncate text-base font-semibold text-gray-900">
                    {employee.full_name}
                  </h3>

                  <p className="mt-0.5 text-sm text-gray-500">
                    {employee.phone}
                  </p>

                </div>

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

            {/* Details */}

            <div className="mt-5 grid grid-cols-2 gap-5 rounded-2xl bg-gray-50 p-4">

              <div>

                <p className="text-[11px] font-semibold uppercase tracking-wider text-gray-400">
                  Role
                </p>

                <p className="mt-1 text-sm font-semibold text-gray-800">
                  {employee.role_name || "-"}
                </p>

              </div>

              <div>

                <p className="text-[11px] font-semibold uppercase tracking-wider text-gray-400">
                  Designation
                </p>

                <p className="mt-1 text-sm font-semibold text-gray-800">
                  {employee.designation || "-"}
                </p>

              </div>

            </div>

            {/* Actions */}

            <div className="mt-4 flex items-center justify-end gap-2">

              <Button
                variant="ghost"
                className="min-w-0 px-4"
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
                className="min-w-0 px-4"
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