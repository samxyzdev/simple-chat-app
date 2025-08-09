import DashboardPage from "../../components/DashoardPage";
import Sidebar from "../../components/Sidebar";

export default function Dashboard() {
  return (
    <main className="flex">
      <Sidebar />
      <DashboardPage />
    </main>
  );
}
