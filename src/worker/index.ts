import { Hono } from "hono";

const app = new Hono();

app.get("/api/health", (c) => {
  return c.json({
    success: true,
    message: "Personal Planner API is running",
    timestamp: new Date().toISOString(),
  });
});

export default app;