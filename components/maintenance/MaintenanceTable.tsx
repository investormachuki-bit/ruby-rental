"use client";

import Card from "@/components/ui/Card";
import DataTable from "@/components/ui/DataTable";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";

import {
  ClipboardCheck,
  CheckCircle2,
  Wrench,
} from "lucide-react";

import { MaintenanceRequest } from "@/types/maintenance";

interface Props {
  requests: MaintenanceRequest[];
  loading: boolean;
  onAssign: (request: MaintenanceRequest) => void;
  onComplete: (request: MaintenanceRequest) => void;
}

export default function MaintenanceTable({
  requests,
  loading,
  onAssign,
  onComplete,
}: Props) {
  const columns = [
    {
      key: "property",
      header: "Property",
      render: (request: MaintenanceRequest) => (
        <div>
          <div className="font-medium">
            {request.property_name}
          </div>

          <div className="text-sm text-gray-500">
            Unit {request.unit_number}
          </div>
        </div>
      ),
    },
    {
      key: "issue",
      header: "Issue",
      render: (request: MaintenanceRequest) => (
        <div>
          <div className="font-medium">
            {request.title}
          </div>

          <div className="text-sm text-gray-500">
            {request.category}
          </div>
        </div>
      ),
    },
    {
      key: "priority",
      header: "Priority",
      render: (request: MaintenanceRequest) => (
        <Badge
          variant={
            request.priority === "Emergency"
              ? "danger"
              : request.priority === "High"
              ? "warning"
              : request.priority === "Medium"
              ? "secondary"
              : "success"
          }
        >
          {request.priority}
        </Badge>
      ),
    },
    {
      key: "status",
      header: "Status",
      render: (request: MaintenanceRequest) => (
        <Badge
          variant={
            request.status === "Completed"
              ? "success"
              : request.status === "In Progress"
              ? "warning"
              : "secondary"
          }
        >
          {request.status}
        </Badge>
      ),
    },
    {
      key: "assigned",
      header: "Assigned To",
      render: (request: MaintenanceRequest) =>
        request.assigned_employee || "Unassigned",
    },
    {
      key: "actions",
      header: "",
      render: (request: MaintenanceRequest) => (
        <div className="flex justify-end gap-2">

          <Button
            variant="ghost"
            className="p-2 min-w-0"
            onClick={() => onAssign(request)}
            title="Assign Employee"
          >
            <ClipboardCheck size={16} />
          </Button>

          <Button
            variant="ghost"
            className="p-2 min-w-0"
            onClick={() => onComplete(request)}
            title="Complete Request"
          >
            <CheckCircle2 size={16} />
          </Button>

          <Button
            variant="ghost"
            className="p-2 min-w-0"
            disabled
            title="Maintenance Details"
          >
            <Wrench size={16} />
          </Button>

        </div>
      ),
    },
  ];

  return (
    <Card>
      {requests.length === 0 && !loading ? (
        <div className="p-8 text-center text-gray-500">
          No maintenance requests found.
        </div>
      ) : (
        <DataTable
          columns={columns}
          data={requests}
          loading={loading}
        />
      )}
    </Card>
  );
}
