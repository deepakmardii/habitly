import Sidebar from "../components/Sidebar";

export default function AnalyticsLayout({ children }) {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 md:ml-64">{children}</main>
    </div>
  );
}
