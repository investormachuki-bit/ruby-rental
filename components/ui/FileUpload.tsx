"use client";

import {
  ChangeEvent,
  useRef,
  useState,
} from "react";

import {
  Upload,
  Image as ImageIcon,
  Trash2,
  Loader2,
} from "lucide-react";

import Button from "@/components/ui/Button";

type FileUploadProps = {
  label: string;
  value?: string | null;
  onSelect: (file: File) => void | Promise<void>;
  onRemove?: () => void | Promise<void>;
  accept?: string;
  disabled?: boolean;
};

export default function FileUpload({
  label,
  value,
  onSelect,
  onRemove,
  accept = "image/*",
  disabled = false,
}: FileUploadProps) {
  const inputRef =
    useRef<HTMLInputElement>(null);

  const [
    uploading,
    setUploading,
  ] = useState(false);

  const [
    error,
    setError,
  ] = useState<string | null>(null);

  async function handleChange(
    event: ChangeEvent<HTMLInputElement>
  ) {
    const file =
      event.target.files?.[0];

    // Reset the input so selecting the same
    // file again will trigger onChange.
    event.target.value = "";

    if (!file) {
      return;
    }

    setError(null);
    setUploading(true);

    try {
      await onSelect(file);
    } catch (error: unknown) {
      console.error(
        "File upload failed:",
        error
      );

      let message =
        "Upload failed. Please try again.";

      if (error instanceof Error) {
        message = error.message;
      } else if (
        typeof error === "object" &&
        error !== null &&
        "message" in error
      ) {
        message = String(
          (error as { message?: unknown })
            .message
        );
      }

      setError(message);
    } finally {
      setUploading(false);
    }
  }

  async function handleRemove() {
    if (!onRemove) {
      return;
    }

    setError(null);
    setUploading(true);

    try {
      await onRemove();
    } catch (error: unknown) {
      console.error(
        "File removal failed:",
        error
      );

      let message =
        "Unable to remove the file.";

      if (error instanceof Error) {
        message = error.message;
      } else if (
        typeof error === "object" &&
        error !== null &&
        "message" in error
      ) {
        message = String(
          (error as { message?: unknown })
            .message
        );
      }

      setError(message);
    } finally {
      setUploading(false);
    }
  }

  const isDisabled =
    disabled || uploading;

  return (
    <div className="space-y-3">

      <label className="block text-sm font-medium text-gray-700">
        {label}
      </label>

      <div className="rounded-2xl border-2 border-dashed border-gray-300 bg-gray-50 p-6">

        {value ? (

          <div className="space-y-4">

            <img
              src={value}
              alt={label}
              className="h-40 w-full rounded-xl bg-white object-contain"
            />

            <div className="flex flex-wrap gap-3">

              <Button
                type="button"
                variant="secondary"
                onClick={() =>
                  inputRef.current?.click()
                }
                disabled={isDisabled}
              >
                {uploading ? (
                  <Loader2
                    size={16}
                    className="mr-2 animate-spin"
                  />
                ) : (
                  <Upload
                    size={16}
                    className="mr-2"
                  />
                )}

                {uploading
                  ? "Uploading..."
                  : "Replace"}
              </Button>

              {onRemove && (
                <Button
                  type="button"
                  variant="danger"
                  onClick={handleRemove}
                  disabled={isDisabled}
                >
                  {uploading ? (
                    <Loader2
                      size={16}
                      className="mr-2 animate-spin"
                    />
                  ) : (
                    <Trash2
                      size={16}
                      className="mr-2"
                    />
                  )}

                  Remove
                </Button>
              )}

            </div>

          </div>

        ) : (

          <button
            type="button"
            disabled={isDisabled}
            onClick={() =>
              inputRef.current?.click()
            }
            className="flex w-full flex-col items-center justify-center gap-3 rounded-xl py-10 transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-60"
          >

            {uploading ? (
              <Loader2
                size={48}
                className="animate-spin text-gray-400"
              />
            ) : (
              <ImageIcon
                size={48}
                className="text-gray-400"
              />
            )}

            <p className="font-medium text-gray-700">
              {uploading
                ? "Uploading..."
                : "Click to upload"}
            </p>

            <p className="text-sm text-gray-500">
              {uploading
                ? "Please wait..."
                : "PNG, JPG, SVG or WEBP"}
            </p>

          </button>

        )}

        <input
          ref={inputRef}
          type="file"
          hidden
          accept={accept}
          disabled={isDisabled}
          onChange={handleChange}
        />

        {error && (
          <div className="mt-4 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
            <strong>Upload error:</strong>{" "}
            {error}
          </div>
        )}

      </div>

    </div>
  );
}