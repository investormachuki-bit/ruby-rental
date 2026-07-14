type LoadingProps = {
  title?: string;
  description?: string;
  fullScreen?: boolean;
};

export default function Loading({
  title = "Loading...",
  description = "Please wait while we fetch your data.",
  fullScreen = false,
}: LoadingProps) {
  const content = (
    <div className="flex flex-col items-center justify-center py-16">

      {/* Spinner */}

      <div className="h-12 w-12 animate-spin rounded-full border-4 border-gray-200 border-t-black" />

      <h2 className="mt-6 text-xl font-semibold text-gray-900">
        {title}
      </h2>

      <p className="mt-2 text-center text-gray-500">
        {description}
      </p>

    </div>
  );

  if (fullScreen) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-100">
        {content}
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-gray-200 bg-white shadow-sm">
      {content}
    </div>
  );
}
