import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

import AppLayout from "@/components/layout/AppLayout";

import Dashboard from "@/pages/Dashboard";
import Schedule from "@/pages/Schedule";
import Tasks from "@/pages/Tasks";
import Events from "@/pages/Events";
import Calendar from "@/pages/Calendar";
import Settings from "@/pages/Settings";
import Login from "@/pages/Login";
import NotFound from "@/pages/NotFound";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>

        <Route path="/login" element={<Login />} />

        <Route element={<AppLayout />}>

          <Route index element={<Dashboard />} />

          <Route
            path="/schedule"
            element={<Schedule />}
          />

          <Route
            path="/tasks"
            element={<Tasks />}
          />

          <Route
            path="/events"
            element={<Events />}
          />

          <Route
            path="/calendar"
            element={<Calendar />}
          />

          <Route
            path="/settings"
            element={<Settings />}
          />

          <Route path="*" element={<NotFound />} />

        </Route>

      </Routes>
    </BrowserRouter>
  );
}