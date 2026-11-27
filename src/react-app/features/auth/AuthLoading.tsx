import {
  CalendarCheck,
  LoaderCircle,
} from "lucide-react";

export default function AuthLoading() {
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center gap-4 bg-background">

      <div className="rounded-2xl bg-primary p-4 text-primary-foreground">
        <CalendarCheck size={32} />
      </div>

      <h1 className="text-xl font-bold">
        MyPlanner
      </h1>

      <div className="flex items-center gap-2 text-sm text-muted-foreground">

        <LoaderCircle
          size={18}
          className="animate-spin"
        />

        Memeriksa session...

      </div>

    </div>
  );
}