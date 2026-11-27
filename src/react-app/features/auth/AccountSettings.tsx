
import { useState } from "react";

import {
  ShieldCheck,
  LogOut,
  Monitor,
  LoaderCircle,
} from "lucide-react";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

import ConfirmDialog from
  "@/components/shared/ConfirmDialog";

import {
  useAuth,
} from "@/context/AuthContext";

export default function AccountSettings() {
  const {
    user,
    logout,
  } = useAuth();

  const [confirmation, setConfirmation] =
    useState<"current" | "all" | null>(
      null
    );

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  async function handleLogout() {
    if (!confirmation || loading) return;

    setLoading(true);
    setError("");

    try {
      await logout(
        confirmation === "all"
      );

    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Logout gagal"
      );

    } finally {
      setLoading(false);
      setConfirmation(null);
    }
  }

  return (
    <Card>

      <CardHeader>

        <CardTitle className="flex items-center gap-2">
          <ShieldCheck size={20} />
          Akun dan Keamanan
        </CardTitle>

        <CardDescription>
          Kelola akun dan session perangkatmu.
        </CardDescription>

      </CardHeader>

      <CardContent className="space-y-4">

        <div className="flex flex-wrap items-center justify-between gap-3 border-b pb-4">

          <div className="min-w-0">

            <p className="text-sm font-medium">
              Email Akun
            </p>

            <p className="break-all text-sm text-muted-foreground">
              {user?.email}
            </p>

          </div>

          <Badge variant="secondary">
            Terautentikasi
          </Badge>

        </div>

        <div className="space-y-3">

          <p className="text-sm font-medium">
            Session Management
          </p>

          <p className="text-xs text-muted-foreground">
            Session berlaku selama 30 hari sejak login.
          </p>

          <Button
            variant="outline"
            disabled={loading}
            onClick={() =>
              setConfirmation("all")
            }
          >
            <Monitor size={16} />
            Logout Semua Perangkat
          </Button>

        </div>

        {error && (
          <p
            role="alert"
            className="text-sm text-destructive"
          >
            {error}
          </p>
        )}

        <Button
          variant="destructive"
          disabled={loading}
          onClick={() =>
            setConfirmation("current")
          }
        >
          {loading
            ? <LoaderCircle
                size={16}
                className="animate-spin"
              />
            : <LogOut size={16} />}

          Logout

        </Button>

      </CardContent>

      <ConfirmDialog
        open={confirmation !== null}
        title="Konfirmasi Logout"
        description={
          confirmation === "all"
            ? "Kamu akan keluar dari seluruh perangkat yang menggunakan akun ini."
            : "Kamu akan keluar dari perangkat ini."
        }
        confirmLabel={
          loading
            ? "Memproses..."
            : "Logout"
        }
        onClose={() => {
          if (!loading) {
            setConfirmation(null);
          }
        }}
        onConfirm={handleLogout}
      />

    </Card>
  );
}
