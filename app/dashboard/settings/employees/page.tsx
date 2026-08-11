"use client";

import { useEffect, useState } from "react";

import Button from "@/components/ui/Button";

import EmployeeTable from "@/components/employees/EmployeeTable";
import EmployeeDialog from "@/components/employees/EmployeeDialog";

import {
  getEmployees,
  createEmployee,
  updateEmployee,
  deactivateEmployee,
} from "@/services/employees";

import { getRoles } from "@/services/roles";

import {
  Employee,
  RoleOption,
} from "@/types/employees";

export default function EmployeesPage() {
  const [employees, setEmployees] =
    useState<Employee[]>([]);

  const [roles, setRoles] =
    useState<RoleOption[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [dialogOpen, setDialogOpen] =
    useState(false);

  const [selectedEmployee, setSelectedEmployee] =
    useState<Employee | null>(null);

  const [error, setError] =
    useState<string | null>(null);

  async function loadEmployees() {
    try {
      const employeeData =
        await getEmployees();

      setEmployees(employeeData);
    } catch (error) {
      console.error(
        "Failed to load employees:",
        error
      );

      setEmployees([]);
    }
  }

  async function loadRoles() {
    try {
      const roleData =
        await getRoles();

      setRoles(
        roleData
          .filter((role) => role.is_active)
          .map((role) => ({
            id: role.id,
            name: role.name,
          }))
      );
    } catch (error) {
      console.error(
        "Failed to load roles:",
        error
      );

      setRoles([]);

      setError(
        "Unable to load roles. Please refresh the page and try again."
      );
    }
  }

  async function loadData() {
    setLoading(true);
    setError(null);

    await Promise.all([
      loadEmployees(),
      loadRoles(),
    ]);

    setLoading(false);
  }

  useEffect(() => {
    loadData();
  }, []);

  return (
    <div className="mx-auto w-full max-w-7xl space-y-6">

      {/* Header */}

      <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6">

        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">

          <div className="flex items-start gap-4">

            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#D4AF37]/10 text-[#B8941F]">
              <span className="text-lg font-bold">
                E
              </span>
            </div>

            <div>

              <div className="flex flex-wrap items-center gap-3">

                <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
                  Employees
                </h1>

                {!loading && (
                  <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-600">
                    {employees.length}{" "}
                    {employees.length === 1
                      ? "employee"
                      : "employees"}
                  </span>
                )}

              </div>

              <p className="mt-1 text-sm text-gray-500 sm:text-base">
                Manage your staff and assign roles.
              </p>

            </div>

          </div>

          <Button
            onClick={() => {
              setSelectedEmployee(null);
              setDialogOpen(true);
            }}
            className="w-full sm:w-auto"
          >
            + New Employee
          </Button>

        </div>

      </div>

      {/* Error */}

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Employees */}

      <EmployeeTable
        employees={employees}
        loading={loading}
        onEdit={(employee) => {
          setSelectedEmployee(employee);
          setDialogOpen(true);
        }}
        onDeactivate={async (employee) => {
          if (
            !window.confirm(
              `Deactivate ${employee.full_name}?`
            )
          ) {
            return;
          }

          await deactivateEmployee(
            employee.id
          );

          await loadEmployees();
        }}
      />

      {/* Dialog */}

      <EmployeeDialog
        open={dialogOpen}
        employee={selectedEmployee}
        roles={roles}
        onClose={() =>
          setDialogOpen(false)
        }
        onSave={async (values) => {

          if (selectedEmployee) {
            await updateEmployee(
              selectedEmployee.id,
              values
            );
          } else {
            await createEmployee(values);
          }

          await loadEmployees();

          setDialogOpen(false);
        }}
      />

    </div>
  );
}