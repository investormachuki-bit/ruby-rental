"use client";

import { ReactNode, useEffect, useRef, useState } from "react";

type ActionItem = {
  label: string;

  icon?: ReactNode;

  danger?: boolean;

  disabled?: boolean;

  onClick: () => void;
};

type ActionMenuProps = {
  actions: ActionItem[];

  className?: string;
};

export default function ActionMenu({
  actions,
  className = "",
}: ActionMenuProps) {

  const [open, setOpen] =
    useState(false);

  const menuRef =
    useRef<HTMLDivElement>(null);

  useEffect(() => {

    function handleClickOutside(
      event: MouseEvent
    ) {

      if (
        menuRef.current &&
        !menuRef.current.contains(
          event.target as Node
        )
      ) {

        setOpen(false);

      }

    }

    document.addEventListener(
      "mousedown",
      handleClickOutside
    );

    return () =>
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );

  }, []);

  return (

    <div
      ref={menuRef}
      className={`relative inline-block ${className}`}
    >

      <button
        type="button"
        onClick={() =>
          setOpen(!open)
        }
        className="rounded-lg p-2 transition hover:bg-gray-100"
      >

        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >

          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 5h.01M12 12h.01M12 19h.01"
          />

        </svg>

      </button>

      {open && (

        <div className="absolute right-0 z-50 mt-2 w-56 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-xl">

          {actions.map(
            (action, index) => (

              <button
                key={index}
                type="button"
                disabled={action.disabled}
                onClick={() => {

                  setOpen(false);

                  action.onClick();

                }}
                className={`
                  flex w-full items-center gap-3 px-4 py-3 text-left text-sm transition

                  ${
                    action.danger
                      ? "text-red-600 hover:bg-red-50"
                      : "text-gray-700 hover:bg-gray-50"
                  }

                  ${
                    action.disabled
                      ? "cursor-not-allowed opacity-50"
                      : ""
                  }
                `}
              >

                {action.icon}

                <span>

                  {action.label}

                </span>

              </button>

            )
          )}

        </div>

      )}

    </div>

  );

}
