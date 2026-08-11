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
    <div className="space-y-6">

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Employees
          </h1>

          <p className="mt-1 text-gray-500">
            Manage your staff and assign roles.
          </p>
        </div>

        <Button
          onClick={() => {
            setSelectedEmployee(null);
            setDialogOpen(true);
          }}
        >
          New Employee
        </Button>

      </div>

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

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