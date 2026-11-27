import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import "./index.css";
import App from "./App.tsx";

import {
  PlannerProvider,
} from "@/context/PlannerContext";

import {
  ThemeProvider,
} from "@/context/ThemeContext";

import {
  AuthProvider,
} from "@/context/AuthContext";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider>
      <AuthProvider>
        <PlannerProvider>
          <App />
        </PlannerProvider>
      </AuthProvider>
    </ThemeProvider>
  </StrictMode>
);