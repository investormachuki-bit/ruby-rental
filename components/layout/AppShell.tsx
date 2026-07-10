import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

type AppShellProps = {
  children: React.ReactNode;
};

export default function AppShell({ children }: AppShellProps) {
  return (
    <div className="min-h-screen bg-slate-100">
      {/* Desktop */}
      <div className="hidden md:flex">
        <Sidebar />

        <div className="flex flex-1 flex-col">
          <Topbar />

          <main className="flex-1 p-6">
            {children}
          </main>
        </div>
      </div>

      {/* Mobile */}
      <div className="md:hidden">
        <Topbar />

        <main className="p-4">
          {children}
        </main>
      </div>
    </div>
  );
}
