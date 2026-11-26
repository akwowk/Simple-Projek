
import { useState } from "react";
import type { FormEvent } from "react";

import {
  CalendarCheck,
  Eye,
  EyeOff,
  ArrowLeft,
  ShieldCheck,
} from "lucide-react";

import { Link } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";

export default function Login() {
  const [email, setEmail] = useState("");

  const [password, setPassword] =
    useState("");

  const [showPassword, setShowPassword] =
    useState(false);

  const [message, setMessage] =
    useState("");

  function handleSubmit(
    e: FormEvent<HTMLFormElement>
  ) {
    e.preventDefault();

    setMessage(
      "Autentikasi belum tersedia. Fitur login akan diaktifkan pada Phase 4."
    );
  }

  return (
    <main className="flex min-h-dvh items-center justify-center bg-background p-4">

      <div className="w-full max-w-sm space-y-6">

        <div className="flex flex-col items-center gap-3 text-center">

          <div className="rounded-2xl bg-primary p-4 text-primary-foreground">
            <CalendarCheck size={32} />
          </div>

          <div>
            <h1 className="text-2xl font-bold">
              MyPlanner
            </h1>

            <p className="mt-1 text-sm text-muted-foreground">
              Personal Productivity Workspace
            </p>
          </div>

        </div>

        <Card>
          <CardHeader>

            <CardTitle className="text-xl">
              Selamat Datang
            </CardTitle>

            <CardDescription>
              Masuk untuk mengelola aktivitasmu.
            </CardDescription>

          </CardHeader>

          <CardContent>

            <form
              onSubmit={handleSubmit}
              className="space-y-4"
            >

              <div className="space-y-2">
                <Label htmlFor="email">
                  Email
                </Label>

                <Input
                  id="email"
                  type="email"
                  placeholder="email@example.com"
                  autoComplete="username"
                  value={email}
                  onChange={(e) =>
                    setEmail(e.target.value)
                  }
                  required
                />
              </div>

              <div className="space-y-2">

                <Label htmlFor="password">
                  Password
                </Label>

                <div className="relative">

                  <Input
                    id="password"
                    type={
                      showPassword
                        ? "text"
                        : "password"
                    }
                    className="pr-12"
                    autoComplete="current-password"
                    placeholder="Masukkan password"
                    value={password}
                    onChange={(e) =>
                      setPassword(e.target.value)
                    }
                    required
                  />

                  <button
                    type="button"
                    aria-label={
                      showPassword
                        ? "Sembunyikan password"
                        : "Tampilkan password"
                    }
                    onClick={() =>
                      setShowPassword(!showPassword)
                    }
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                  >
                    {showPassword
                      ? <EyeOff size={18} />
                      : <Eye size={18} />}
                  </button>

                </div>
              </div>

              {message && (
                <p
                  role="status"
                  className="rounded-lg bg-muted p-3 text-sm text-muted-foreground"
                >
                  {message}
                </p>
              )}

              <Button
                type="submit"
                className="w-full"
              >
                Masuk
              </Button>

            </form>

          </CardContent>
        </Card>

        <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
          <ShieldCheck size={15} />
          Private Personal Workspace
        </div>

        <Link
          to="/"
          className="flex items-center justify-center gap-2 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft size={16} />
          Kembali ke Dashboard
        </Link>

        <p className="text-center text-xs text-muted-foreground">
          Development preview — belum menggunakan autentikasi.
        </p>

      </div>

    </main>
  );
}
