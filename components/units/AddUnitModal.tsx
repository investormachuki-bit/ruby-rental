"use client";

import UnitForm from "./UnitForm";

type Props = {
  open: boolean;

  onClose: () => void;

  onSuccess: () => void;
};

export default function AddUnitModal({
  open,
  onClose,
  onSuccess,
}: Props) {

  if (!open) {

    return null;

  }

  return (

    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">

      <div className="max-h-[90vh] w-full max-w-5xl overflow-y-auto rounded-3xl bg-white shadow-2xl">

        <div className="border-b p-6">

          <h2 className="text-3xl font-bold">

            Add Rental Unit

          </h2>

          <p className="mt-2 text-gray-500">

            Create a new rental unit for your portfolio.

          </p>

        </div>

        <div className="p-6">

          <UnitForm
            onSuccess={onSuccess}
            onCancel={onClose}
          />

        </div>

      </div>

    </div>

  );

}
