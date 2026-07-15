"use client";

type ToggleSwitchProps = {
  checked: boolean;

  onChange: (checked: boolean) => void;

  disabled?: boolean;

  label?: string;

  description?: string;

  size?: "sm" | "md" | "lg";

  className?: string;
};

export default function ToggleSwitch({
  checked,
  onChange,
  disabled = false,
  label,
  description,
  size = "md",
  className = "",
}: ToggleSwitchProps) {

  const sizes = {
    sm: {
      track: "h-5 w-9",
      thumb: "h-4 w-4",
      translate: "translate-x-4",
    },
    md: {
      track: "h-6 w-11",
      thumb: "h-5 w-5",
      translate: "translate-x-5",
    },
    lg: {
      track: "h-7 w-14",
      thumb: "h-6 w-6",
      translate: "translate-x-7",
    },
  };

  const current = sizes[size];

  return (

    <div
      className={`flex items-center justify-between gap-4 ${className}`}
    >

      {(label || description) && (

        <div className="flex-1">

          {label && (

            <p className="font-medium text-gray-900">

              {label}

            </p>

          )}

          {description && (

            <p className="mt-1 text-sm text-gray-500">

              {description}

            </p>

          )}

        </div>

      )}

      <button
        type="button"
        role="switch"
        aria-checked={checked}
        disabled={disabled}
        onClick={() => {

          if (!disabled) {

            onChange(!checked);

          }

        }}
        className={`
          relative inline-flex
          ${current.track}
          items-center rounded-full
          transition-all duration-300
          focus:outline-none
          focus:ring-2
          focus:ring-[#D4AF37]
          focus:ring-offset-2
          ${
            checked
              ? "bg-[#D4AF37]"
              : "bg-gray-300"
          }
          ${
            disabled
              ? "cursor-not-allowed opacity-50"
              : "cursor-pointer"
          }
        `}
      >

        <span
          className={`
            inline-block
            ${current.thumb}
            transform rounded-full
            bg-white
            shadow
            transition-transform duration-300
            ${
              checked
                ? current.translate
                : "translate-x-1"
            }
          `}
        />

      </button>

    </div>

  );

}
