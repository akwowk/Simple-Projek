
/* eslint-disable react-refresh/only-export-components */

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";

import type { ReactNode } from "react";

import {
  api,
  ApiError,
} from "@/lib/api";

export interface AuthUser {
  id: string;
  email: string;
}

interface AuthResponse {
  user: AuthUser;
  expiresAt?: string;
}

interface AuthContextType {
  user: AuthUser | null;
  loading: boolean;
  error: string | null;
  isAuthenticated: boolean;

  login: (
    email: string,
    password: string
  ) => Promise<void>;

  logout: (
    allDevices?: boolean
  ) => Promise<void>;

  refreshSession: () => Promise<void>;
}

const AuthContext =
  createContext<AuthContextType | undefined>(
    undefined
  );

export function AuthProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [user, setUser] =
    useState<AuthUser | null>(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState<string | null>(null);

  const refreshSession = useCallback(
    async () => {

      setLoading(true);
      setError(null);

      try {
        const result =
          await api.get<AuthResponse>(
            "/auth/me"
          );

        setUser(result.user);

      } catch (err) {

        setUser(null);

        if (
          !(err instanceof ApiError) ||
          err.status !== 401
        ) {
          setError(
            "Tidak dapat terhubung ke server."
          );
        }

      } finally {
        setLoading(false);
      }
    },
    []
  );

  useEffect(() => {
    void refreshSession();
  }, [refreshSession]);

  useEffect(() => {
    function handleUnauthorized() {
      setUser(null);
    }

    window.addEventListener(
      "auth:unauthorized",
      handleUnauthorized
    );

    return () => {
      window.removeEventListener(
        "auth:unauthorized",
        handleUnauthorized
      );
    };
  }, []);

  async function login(
    email: string,
    password: string
  ) {
    const result =
      await api.post<AuthResponse>(
        "/auth/login",
        {
          email:
            email.trim().toLowerCase(),

          password:
            password.trim(),
        }
      );

    setUser(result.user);
    setError(null);
  }

  async function logout(
    allDevices = false
  ) {
    await api.post<null>(
      allDevices
        ? "/auth/logout-all"
        : "/auth/logout"
    );

    setUser(null);
    setError(null);
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
        isAuthenticated: user !== null,
        login,
        logout,
        refreshSession,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error(
      "useAuth must be used inside AuthProvider"
    );
  }

  return context;
}
