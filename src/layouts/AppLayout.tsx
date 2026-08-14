import { Outlet } from "react-router-dom";
import BottomNav from "../components/BottomNav";

export default function AppLayout() {
  return (
    <div className="min-h-screen bg-[#faf9ff]">
      {/* Contenu de la page */}
      <main className="min-h-screen pb-24">
        <Outlet />
      </main>

      {/* Navigation du bas */}
      <BottomNav />
    </div>
  );
}