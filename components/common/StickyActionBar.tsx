"use client";

type Props = {
  loading?: boolean;
  onCancel: () => void;
  onSaveDraft: () => void;
  onPrimary: () => void;

  primaryText?: string;
};

export default function StickyActionBar({
  loading = false,
  onCancel,
  onSaveDraft,
  onPrimary,
  primaryText = "Save",
}: Props) {
  return (
    <div className="sticky bottom-0 z-20 border-t bg-white px-6 py-4">

      <div className="flex flex-col-reverse gap-3 md:flex-row md:justify-end">

        <button
          type="button"
          disabled={loading}
          onClick={onCancel}
          className="rounded-xl border px-6 py-3 font-medium hover:bg-gray-100"
        >
          Cancel
        </button>

        <button
          type="button"
          disabled={loading}
          onClick={onSaveDraft}
          className="rounded-xl bg-gray-700 px-6 py-3 font-semibold text-white hover:bg-gray-800"
        >
          Save Draft
        </button>

        <button
          type="button"
          disabled={loading}
          onClick={onPrimary}
          className="rounded-xl bg-black px-6 py-3 font-semibold text-white hover:bg-gray-900"
        >
          {loading ? "Please wait..." : primaryText}
        </button>

      </div>

    </div>
  );
}
