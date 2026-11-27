import {
  Navigate,
  Outlet,
  useLocation,
} from "react-router-dom";

import {
  useAuth,
} from "@/context/AuthContext";

import { Button } from "@/components/ui/button";
import AuthLoading from "./AuthLoading";

export default function ProtectedRoute() {
  const {
    isAuthenticated,
    loading,
    error,
    refreshSession,
  } = useAuth();

  const location = useLocation();

  if (loading) {
    return <AuthLoading />;
  }

  if (error) {
    return (
      <main className="flex min-h-dvh flex-col items-center justify-center gap-4 p-6 text-center">

        <h1 className="text-xl font-semibold">
          Koneksi bermasalah
        </h1>

        <p className="text-sm text-muted-foreground">
          {error}
        </p>

        <Button
          onClick={() => void refreshSession()}
        >
          Coba Lagi
        </Button>

      </main>
    );
  }

  if (!isAuthenticated) {
    return (
      <Navigate
        to="/login"
        replace
        state={{
          from:
            location.pathname +
            location.search,
        }}
      />
    );
  }

  return <Outlet />;
}