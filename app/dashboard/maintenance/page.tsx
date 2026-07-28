"use client";

import { useEffect, useState } from "react";

import Button from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";

import MaintenanceTable from "@/components/maintenance/MaintenanceTable";
import MaintenanceDialog from "@/components/maintenance/MaintenanceDialog";

import {
  getMaintenanceRequests,
  createMaintenanceRequest,
  assignMaintenance,
  completeMaintenance,
} from "@/services/maintenance";

import { getEmployees } from "@/services/employees";
import { getProperties } from "@/services/properties";
import { getUnits } from "@/services/units";

import {
  MaintenanceRequest,
  PropertyOption,
  UnitOption,
  EmployeeOption,
} from "@/types/maintenance";

export default function MaintenancePage() {
  const [requests, setRequests] = useState<MaintenanceRequest[]>([]);
  const [properties, setProperties] = useState<PropertyOption[]>([]);
  const [units, setUnits] = useState<UnitOption[]>([]);
  const [employees, setEmployees] = useState<EmployeeOption[]>([]);

  const [loading, setLoading] = useState(true);

  const [dialogOpen, setDialogOpen] = useState(false);

  const [assignOpen, setAssignOpen] = useState(false);

  const [selectedRequest, setSelectedRequest] =
    useState<MaintenanceRequest | null>(null);

  const [selectedEmployee, setSelectedEmployee] =
    useState("");

  async function loadData() {
    setLoading(true);

    try {
      const [
        maintenance,
        props,
        unitData,
        employeeData,
      ] = await Promise.all([
        getMaintenanceRequests(),
        getProperties(),
        getUnits(),
        getEmployees(),
      ]);

      setRequests(maintenance);

      setProperties(
        props.map((p: any) => ({
          id: p.id,
          name: p.name,
        }))
      );

      setUnits(
        unitData.map((u: any) => ({
          id: u.id,
          unit_number: u.unit_number,
        }))
      );

      setEmployees(
        employeeData.map((e: any) => ({
          id: e.id,
          full_name: e.full_name,
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
            Maintenance
          </h1>

          <p className="mt-1 text-gray-500">
            Track and manage maintenance requests.
          </p>

        </div>

        <Button onClick={() => setDialogOpen(true)}>
          New Request
        </Button>

      </div>

      <MaintenanceTable
        requests={requests}
        loading={loading}
        onAssign={(request) => {
          setSelectedRequest(request);
          setAssignOpen(true);
        }}
        onComplete={async (request) => {
          await completeMaintenance(
            request.id,
            request.actual_cost ?? 0
          );

          await loadData();
        }}
      />

      <MaintenanceDialog
        open={dialogOpen}
        request={null}
        properties={properties}
        units={units}
        onClose={() => setDialogOpen(false)}
        onSave={async (values) => {
          await createMaintenanceRequest(values);

          setDialogOpen(false);

          await loadData();
        }}
      />

      <Modal
        open={assignOpen}
        title="Assign Employee"
        onClose={() => setAssignOpen(false)}
        footer={
          <>
            <Button
              variant="secondary"
              onClick={() => setAssignOpen(false)}
            >
              Cancel
            </Button>

            <Button
              disabled={!selectedEmployee}
              onClick={async () => {
                if (!selectedRequest) return;

                await assignMaintenance(
                  selectedRequest.id,
                  selectedEmployee
                );

                setAssignOpen(false);

                await loadData();
              }}
            >
              Assign
            </Button>
          </>
        }
      >
        <select
          className="w-full rounded-xl border p-3"
          value={selectedEmployee}
          onChange={(e) =>
            setSelectedEmployee(e.target.value)
          }
        >
          <option value="">
            Select Employee
          </option>

          {employees.map((employee) => (
            <option
              key={employee.id}
              value={employee.id}
            >
              {employee.full_name}
            </option>
          ))}
        </select>
      </Modal>

    </div>
  );
}
