import Sidebar from "../components/Sidebar";

export default function SettingsLayout({ children }) {
  return (
    <>
      <Sidebar />
      <main className="md:ml-64 flex-1">{children}</main>
    </>
  );
}
