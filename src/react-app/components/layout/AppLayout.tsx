import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Header from "./Header";
import MobileNav from "./MobileNav";

export default function AppLayout() {
  return (
    <div className="min-h-screen bg-background text-foreground">

      <Sidebar />

      <div className="min-h-screen md:ml-64">

        <Header />

        <main className="mx-auto max-w-screen-2xl p-4 pb-24 md:p-6">
          <Outlet />
        </main>

      </div>

      <MobileNav />

    </div>
  );
}