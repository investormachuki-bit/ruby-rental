export type DateFormat =
  | "short"
  | "medium"
  | "long";

type FormatDateOptions = {
  locale?: string;

  format?: DateFormat;
};

export function formatDate(
  value: string | Date,
  options: FormatDateOptions = {}
): string {

  const {
    locale = "en-KE",
    format = "medium",
  } = options;

  const date =
    value instanceof Date
      ? value
      : new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "-";
  }

  const formatOptions: Record<
    DateFormat,
    Intl.DateTimeFormatOptions
  > = {

    short: {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    },

    medium: {
      day: "numeric",
      month: "short",
      year: "numeric",
    },

    long: {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    },

  };

  return new Intl.DateTimeFormat(
    locale,
    formatOptions[format]
  ).format(date);

}
