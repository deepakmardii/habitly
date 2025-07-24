import Sidebar from "../components/Sidebar";

export default function HabitsLayout({ children }) {
  return (
    <>
      <Sidebar />
      <main className="ml-64 flex-1">{children}</main>
    </>
  );
} 