import { NavLink } from "react-router-dom";
import { navigation } from "@/lib/navigation";
import { cn } from "@/lib/utils";

const shortLabels = [
  "Home",
  "Jadwal",
  "Tugas",
  "Acara",
  "Kalender",
];

export default function MobileNav() {
  return (
    <nav className="fixed inset-x-0 bottom-0 z-50 grid grid-cols-5 border-t bg-card pb-[env(safe-area-inset-bottom)] md:hidden">

      {navigation.slice(0, 5).map((item, index) => (
        <NavLink
          key={item.path}
          to={item.path}
          end={item.path === "/"}
          className={({ isActive }) =>
            cn(
              "flex min-w-0 flex-col items-center gap-1 px-1 py-3 text-[10px] font-medium",
              isActive
                ? "text-emerald-700 dark:text-primary"
                : "text-muted-foreground"
            )
          }
        >
          <item.icon size={21} />
          {shortLabels[index]}
        </NavLink>
      ))}

    </nav>
  );
}