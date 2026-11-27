import { NavLink } from "react-router-dom";
import { CalendarCheck } from "lucide-react";
import { navigation } from "@/lib/navigation";
import { cn } from "@/lib/utils";
import {
  useAuth,
} from "@/context/AuthContext";

export default function Sidebar() {
  const { user } = useAuth();
  return (

    <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 flex-col border-r bg-card md:flex">

      <div className="flex h-16 items-center gap-3 border-b px-6">
        <div className="rounded-lg bg-primary p-2 text-primary-foreground">
          <CalendarCheck size={22} />
        </div>

        <div>
          <h1 className="font-bold">MyPlanner</h1>
          <p className="text-xs text-muted-foreground">
            Personal Workspace
          </p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        <p className="mb-3 px-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Workspace
        </p>

        <nav className="space-y-1">
          {navigation.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === "/"}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-primary/20 text-foreground"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )
              }
            >
              <item.icon size={20} />
              <span>{item.title}</span>
            </NavLink>
          ))}
        </nav>
      </div>

      <div className="border-t p-4">

        <div className="flex items-center gap-3">

          <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary font-semibold text-primary-foreground">

            {user?.email.charAt(0).toUpperCase() ?? "M"}

          </div>

          <div className="min-w-0">

            <p
              className="truncate text-sm font-medium"
              title={user?.email}
            >
              {user?.email}
            </p>

            <p className="text-xs text-muted-foreground">
              Personal Account
            </p>

          </div>

        </div>

      </div>

    </aside>
  );
}