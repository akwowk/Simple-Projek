import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const PAGE_TITLES: Record<string, string> = {
  "/": "Dashboard",
  "/schedule": "Jadwal Mata Kuliah",
  "/tasks": "Daftar Tugas",
  "/events": "Daftar Acara",
  "/calendar": "Kalender",
  "/settings": "Pengaturan",
  "/login": "Masuk",
};

export function usePageTitle() {
  const { pathname } = useLocation();

  useEffect(() => {
    const title =
      PAGE_TITLES[pathname] ??
      "Halaman Tidak Ditemukan";

    document.title = `${title} | MyPlanner`;
  }, [pathname]);
}