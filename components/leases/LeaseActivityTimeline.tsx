"use client";

import { useEffect, useState } from "react";

import {
  getLeaseActivity,
  type LeaseActivity,
} from "@/services/leases/getLeaseActivity";

type Props = {
  leaseId: string;
};

export default function LeaseActivityTimeline({
  leaseId,
}: Props) {

  const [activities, setActivities] =
    useState<LeaseActivity[]>([]);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    loadActivity();
  }, []);

  async function loadActivity() {

    try {

      setLoading(true);

      const data =
        await getLeaseActivity(
          leaseId
        );

      setActivities(data);

    } catch (error) {

      console.error(error);

    } finally {

      setLoading(false);

    }

  }

  if (loading) {

    return (

      <div className="rounded-2xl border bg-white p-12 text-center">

        Loading activity...

      </div>

    );

  }

  if (activities.length === 0) {

    return (

      <div className="rounded-2xl border bg-white p-12 text-center text-gray-500">

        No activity has been recorded for this lease.

      </div>

    );

  }

  return (

    <div className="rounded-2xl border bg-white shadow-sm">

      <div className="border-b p-6">

        <h2 className="text-2xl font-bold">
          Activity Timeline
        </h2>

        <p className="mt-2 text-gray-500">
          Complete history of events related to this lease.
        </p>

      </div>

      <div className="p-6">

        <div className="space-y-8">
                    {activities.map((activity) => (

            <div
              key={activity.id}
              className="relative flex gap-4"
            >

              {/* Timeline Line */}

              <div className="flex flex-col items-center">

                <div
                  className={`h-4 w-4 rounded-full ${
                    activity.type === "lease"
                      ? "bg-blue-600"
                      : activity.type === "invoice"
                      ? "bg-red-600"
                      : "bg-green-600"
                  }`}
                />

                <div className="mt-1 h-full w-px bg-gray-300" />

              </div>

              {/* Content */}

              <div className="flex-1 rounded-xl border bg-gray-50 p-5">

                <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">

                  <div>

                    <h3 className="font-semibold text-lg">
                      {activity.title}
                    </h3>

                    <p className="mt-1 text-gray-600">
                      {activity.description}
                    </p>

                  </div>

                  <div className="flex items-center gap-3">

                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${
                        activity.type === "lease"
                          ? "bg-blue-100 text-blue-700"
                          : activity.type === "invoice"
                          ? "bg-red-100 text-red-700"
                          : "bg-green-100 text-green-700"
                      }`}
                    >
                      {activity.type.charAt(0).toUpperCase() +
                        activity.type.slice(1)}
                    </span>

                    <span className="text-sm text-gray-500 whitespace-nowrap">
                      {new Date(activity.date).toLocaleString()}
                    </span>

                  </div>

                </div>

              </div>

            </div>

          ))}

        </div>

      </div>

    </div>

  );

}
