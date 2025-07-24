import Sidebar from "../components/Sidebar";

export default function DashboardLayout({ children }) {
  return (
    <>
      <Sidebar />
      <main className="ml-64 flex-1">{children}</main>
    </>
  );
} 