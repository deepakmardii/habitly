import Sidebar from "../components/Sidebar";

export default function RemindersLayout({ children }) {
  return (
    <>
      <Sidebar />
      <main className="flex-1 ml-64">
        {children}
      </main>
    </>
  );
} 