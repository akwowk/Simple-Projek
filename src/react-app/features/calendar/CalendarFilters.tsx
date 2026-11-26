import {
  CALENDAR_CATEGORIES,
} from "@/lib/calendar";

import type {
  CalendarCategory,
} from "@/lib/calendar";

import { cn } from "@/lib/utils";

interface Props {
  selected: CalendarCategory[];
  onChange: (category: CalendarCategory) => void;
}

export default function CalendarFilters({
  selected,
  onChange,
}: Props) {
  return (
    <div className="flex flex-wrap gap-2">
      {CALENDAR_CATEGORIES.map((item) => {
        const active = selected.includes(item.value);

        return (
          <button
            key={item.value}
            type="button"
            aria-pressed={active}
            onClick={() => onChange(item.value)}
            className={cn(
              "flex items-center gap-2 rounded-lg border px-3 py-2 text-sm transition-colors",
              active
                ? "bg-card font-medium"
                : "bg-muted text-muted-foreground opacity-60"
            )}
          >
            <span
              className="size-3 rounded-full"
              style={{
                backgroundColor: item.color,
              }}
            />

            {item.label}
          </button>
        );
      })}
    </div>
  );
}