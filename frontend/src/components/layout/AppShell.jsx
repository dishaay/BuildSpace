import Navbar from "./Navbar";

export default function AppShell({ children, fullWidth = false }) {
  return (
    <div className="min-h-screen bg-bg">
      <Navbar />
      <main className={fullWidth ? "" : "max-w-[1400px] mx-auto px-4 sm:px-6 py-6"}>
        {children}
      </main>
    </div>
  );
}
