import {
  Palette,
  Globe,
  Bell,
  Info,
} from "lucide-react";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

import ThemeSelector from "@/features/settings/ThemeSelector";
import AccountSettings from "@/features/auth/AccountSettings";

export default function Settings() {
  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <section>
        <h1 className="text-2xl font-bold tracking-tight">
          Pengaturan
        </h1>

        <p className="mt-1 text-sm text-muted-foreground">
          Sesuaikan pengalaman menggunakan MyPlanner.
        </p>
      </section>

      {/* Appearance */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Palette size={20} />
            Tampilan
          </CardTitle>

          <CardDescription>
            Pilih tema yang sesuai dengan preferensimu.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <ThemeSelector />
        </CardContent>
      </Card>

      {/* Preferences */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe size={20} />
            Preferensi
          </CardTitle>

          <CardDescription>
            Konfigurasi bahasa dan waktu aplikasi.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="flex items-center justify-between gap-3 border-b pb-4">
            <div>
              <p className="text-sm font-medium">
                Bahasa
              </p>

              <p className="text-xs text-muted-foreground">
                Bahasa antarmuka aplikasi
              </p>
            </div>

            <Badge variant="secondary">
              Indonesia
            </Badge>
          </div>

          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-sm font-medium">
                Zona Waktu
              </p>

              <p className="text-xs text-muted-foreground">
                Asia/Jakarta
              </p>
            </div>

            <Badge variant="secondary">
              WIB (UTC+7)
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Notifications */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell size={20} />
            Notifikasi
          </CardTitle>

          <CardDescription>
            Pengingat otomatis melalui Telegram.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-sm font-medium">
                Telegram Bot
              </p>

              <p className="text-xs text-muted-foreground">
                Belum terhubung
              </p>
            </div>

            <Badge variant="outline">
              Belum aktif
            </Badge>
          </div>

          <div className="rounded-lg border border-dashed p-4 text-sm text-muted-foreground">
            Pengaturan reminder akan tersedia setelah
            sistem notifikasi diimplementasikan.
          </div>

          <Button
            variant="outline"
            disabled
          >
            Hubungkan Telegram
          </Button>
        </CardContent>
      </Card>

      {/* Account */}
      <AccountSettings />

      {/* About */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Info size={20} />
            Tentang Aplikasi
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-2">
          <p className="font-semibold">
            MyPlanner
          </p>

          <p className="text-sm text-muted-foreground">
            Personal productivity workspace.
          </p>

          <p className="text-xs text-muted-foreground">
            Version 0.1.0 — Development
          </p>
        </CardContent>
      </Card>
    </div>
  );
}