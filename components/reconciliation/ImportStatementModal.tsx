"use client";

import { useRef, useState } from "react";
import Button from "@/components/ui/Button";

type Props = {
  onClose: () => void;
  onImport: (file: File, sourceType: string) => Promise<void>;
};

export default function ImportStatementModal({ onClose, onImport }: Props) {
  const [file, setFile] = useState<File | null>(null);
  const [sourceType, setSourceType] = useState("Generic Bank CSV");
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);

  async function handleSubmit() {
    if (!file) return;
    try {
      setLoading(true);
      await onImport(file, sourceType);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 p-4">
      <div className="w-full max-w-2xl rounded-3xl bg-white p-6 shadow-2xl">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-2xl font-bold">Import Statement</h3>
            <p className="mt-2 text-sm text-gray-500">Upload a bank or mobile money statement for reconciliation.</p>
          </div>
          <button onClick={onClose} className="text-sm text-gray-500">Close</button>
        </div>

        <div className="mt-6 space-y-5">
          <div>
            <label className="mb-2 block text-sm font-semibold">Import Type</label>
            <select value={sourceType} onChange={(event) => setSourceType(event.target.value)} className="w-full rounded-2xl border border-gray-300 bg-white px-4 py-3">
              <option>CSV</option>
              <option>Excel (.xlsx)</option>
              <option>M-Pesa CSV</option>
              <option>Generic Bank CSV</option>
            </select>
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold">Statement File</label>
            <input
              ref={inputRef}
              type="file"
              accept=".csv,.xlsx"
              onChange={(event) => setFile(event.target.files?.[0] ?? null)}
              className="block w-full text-sm text-gray-500"
            />
          </div>

          <div className="rounded-2xl border border-dashed border-gray-300 bg-gray-50 p-4 text-sm text-gray-500">
            Supported formats: CSV, Excel (.xlsx), M-Pesa CSV and Generic Bank CSV. Imports are parsed into reconciliation transaction records and checked for duplicates.
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <Button variant="secondary" onClick={onClose}>Cancel</Button>
          <Button variant="primary" onClick={handleSubmit} loading={loading} disabled={!file}>Upload</Button>
        </div>
      </div>
    </div>
  );
}
