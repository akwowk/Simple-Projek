import { Outlet } from "react-router-dom";

import Sidebar from "./Sidebar";
import Header from "./Header";
import MobileNav from "./MobileNav";

export default function AppLayout() {
  return (
    <div className="min-h-dvh bg-background text-foreground">

      <Sidebar />

      <div className="min-h-dvh min-w-0 md:ml-64">

        <Header />

        <main className="mx-auto min-w-0 max-w-screen-2xl p-4 pb-28 md:p-6">

          <Outlet />

        </main>

      </div>

      <MobileNav />

    </div>
  );
}