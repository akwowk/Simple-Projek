
import {
  useState,
} from "react";

import type { FormEvent } from "react";

import {
  CalendarCheck,
  Eye,
  EyeOff,
  ShieldCheck,
  LoaderCircle,
  AlertCircle,
} from "lucide-react";

import {
  Button,
} from "@/components/ui/button";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";

import {
  useAuth,
} from "@/context/AuthContext";

export default function Login() {
  const { login } = useAuth();

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [showPassword, setShowPassword] =
    useState(false);

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  async function handleSubmit(
    e: FormEvent<HTMLFormElement>
  ) {
    e.preventDefault();

    if (loading) return;

    setError("");
    setLoading(true);

    try {
      await login(
        email,
        password
      );

      setPassword("");

    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Login gagal"
      );

    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-dvh items-center justify-center bg-background p-4">

      <div className="w-full max-w-sm space-y-6">

        <div className="flex flex-col items-center gap-3 text-center">

          <div className="rounded-2xl bg-primary p-4 text-primary-foreground">
            <CalendarCheck size={32} />
          </div>

          <h1 className="text-2xl font-bold">
            MyPlanner
          </h1>

          <p className="text-sm text-muted-foreground">
            Personal Productivity Workspace
          </p>

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
              className="space-y-4"
              onSubmit={handleSubmit}
            >

              <div className="space-y-2">

                <Label htmlFor="email">
                  Email
                </Label>

                <Input
                  id="email"
                  type="email"
                  autoComplete="username"
                  placeholder="email@example.com"
                  value={email}
                  disabled={loading}
                  onChange={(e) =>
                    setEmail(e.target.value)
                  }
                  required
                />

              </div>

              <div className="space-y-2">

                <Label htmlFor="password">
                  Access Key
                </Label>

                <div className="relative">

                  <Input
                    id="password"
                    type={
                      showPassword
                        ? "text"
                        : "password"
                    }
                    autoComplete="current-password"
                    autoCapitalize="none"
                    spellCheck={false}
                    placeholder="Masukkan access key"
                    className="pr-11"
                    value={password}
                    disabled={loading}
                    onChange={(e) =>
                      setPassword(e.target.value)
                    }
                    required
                  />

                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                    aria-label={
                      showPassword
                        ? "Sembunyikan access key"
                        : "Tampilkan access key"
                    }
                    onClick={() =>
                      setShowPassword(
                        !showPassword
                      )
                    }
                  >
                    {showPassword
                      ? <EyeOff size={18} />
                      : <Eye size={18} />}
                  </button>

                </div>

              </div>

              {error && (
                <div
                  role="alert"
                  className="flex items-start gap-2 rounded-lg bg-destructive/10 p-3 text-sm text-destructive"
                >
                  <AlertCircle
                    size={18}
                    className="shrink-0"
                  />

                  {error}

                </div>
              )}

              <Button
                type="submit"
                className="w-full"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <LoaderCircle
                      size={16}
                      className="animate-spin"
                    />

                    Sedang masuk...
                  </>
                ) : (
                  "Masuk"
                )}
              </Button>

            </form>

          </CardContent>

        </Card>

        <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">

          <ShieldCheck size={16} />

          Private Personal Workspace

        </div>

      </div>

    </main>
  );
}
