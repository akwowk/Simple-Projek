import { DAYS, getTodayWIB } from "@/lib/schedule";
import { cn } from "@/lib/utils";
import type { Schedule } from "@/types";

interface Props {
  selectedDay: number;
  onChange: (day: number) => void;
  schedules: Schedule[];
}

export default function DaySelector({
  selectedDay,
  onChange,
  schedules,
}: Props) {
  const today = getTodayWIB();

  return (
    <div className="grid grid-cols-4 gap-2 lg:grid-cols-7">
      {DAYS.map((day) => {
        const total = schedules.filter(
          (item) => item.dayOfWeek === day.value
        ).length;

        return (
          <button
            type="button"
            key={day.value}
            onClick={() => onChange(day.value)}
            aria-pressed={selectedDay === day.value}
            className={cn(
              "flex flex-col items-center gap-1 rounded-xl border p-3 transition-colors",
              selectedDay === day.value
                ? "border-primary bg-primary text-primary-foreground"
                : "bg-card hover:bg-muted"
            )}
          >
            <span className="text-sm font-semibold">
              {day.label}
            </span>

            <span className="text-xs opacity-75">
              {total} kelas
            </span>

            {today === day.value && (
              <span className="text-[10px] font-medium">
                Hari ini
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}