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
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [roles, setRoles] = useState<RoleOption[]>([]);

  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);

  const [selectedEmployee, setSelectedEmployee] =
    useState<Employee | null>(null);

  async function loadData() {
    setLoading(true);

    try {
      const [employeeData, roleData] =
        await Promise.all([
          getEmployees(),
          getRoles(),
        ]);

      setEmployees(employeeData);

      setRoles(
        roleData.map((r) => ({
          id: r.id,
          name: r.name,
        }))
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  return (
    <div className="space-y-6">

      <div className="flex items-center justify-between">

        <div>

          <h1 className="text-3xl font-bold">
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
          )
            return;

          await deactivateEmployee(employee.id);

          await loadData();
        }}
      />

      <EmployeeDialog
        open={dialogOpen}
        employee={selectedEmployee}
        roles={roles}
        onClose={() => setDialogOpen(false)}
        onSave={async (values) => {

          if (selectedEmployee) {

            await updateEmployee(
              selectedEmployee.id,
              values
            );

          } else {

            await createEmployee(values);

          }

          await loadData();

        }}
      />

    </div>
  );
}
