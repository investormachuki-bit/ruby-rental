"use client";

import { ChangeEvent, useRef } from "react";
import { Upload, Image as ImageIcon, Trash2 } from "lucide-react";
import Button from "@/components/ui/Button";

type FileUploadProps = {
  label: string;
  value?: string | null;
  onSelect: (file: File) => void;
  onRemove?: () => void;
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

  const inputRef = useRef<HTMLInputElement>(null);

  function handleChange(
    event: ChangeEvent<HTMLInputElement>
  ) {
    const file = event.target.files?.[0];

    if (!file) return;

    onSelect(file);
  }

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
              className="h-40 w-full rounded-xl object-contain bg-white"
            />

            <div className="flex gap-3">

              <Button
                type="button"
                variant="secondary"
                onClick={() => inputRef.current?.click()}
                disabled={disabled}
              >
                <Upload
                  size={16}
                  className="mr-2"
                />
                Replace
              </Button>

              {onRemove && (

                <Button
                  type="button"
                  variant="danger"
                  onClick={onRemove}
                  disabled={disabled}
                >
                  <Trash2
                    size={16}
                    className="mr-2"
                  />
                  Remove
                </Button>

              )}

            </div>

          </div>

        ) : (

          <button
            type="button"
            disabled={disabled}
            onClick={() => inputRef.current?.click()}
            className="flex w-full flex-col items-center justify-center gap-3 py-10 transition hover:opacity-80"
          >

            <ImageIcon
              size={48}
              className="text-gray-400"
            />

            <p className="font-medium text-gray-700">
              Click to upload
            </p>

            <p className="text-sm text-gray-500">
              PNG, JPG, SVG or WEBP
            </p>

          </button>

        )}

        <input
          ref={inputRef}
          type="file"
          hidden
          accept={accept}
          onChange={handleChange}
        />

      </div>

    </div>

  );

}
