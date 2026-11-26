
import {
  Clock,
  MapPin,
  Pencil,
  Trash2,
  CalendarDays,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

import {
  formatDate,
  formatTime,
  getEventStatus,
  getCountdown,
  TIMEZONE,
} from "@/lib/date";

import type { Event } from "@/types";

interface Props {
  event: Event;
  now: number;
  onEdit: (event: Event) => void;
  onDelete: (id: string) => void;
}

const STATUS_LABELS = {
  upcoming: "Mendatang",
  ongoing: "Berlangsung",
  completed: "Selesai",
};

const STATUS_COLORS = {
  upcoming: "bg-blue-100 text-blue-700",
  ongoing: "bg-emerald-100 text-emerald-700",
  completed: "bg-slate-100 text-slate-700",
};

export default function EventCard({
  event,
  now,
  onEdit,
  onDelete,
}: Props) {
  const status = getEventStatus(
    event.startAt,
    event.endAt,
    now
  );

  const startDate = new Date(event.startAt);

  const day = new Intl.DateTimeFormat("id-ID", {
    day: "2-digit",
    timeZone: TIMEZONE,
  }).format(startDate);

  const month = new Intl.DateTimeFormat("id-ID", {
    month: "short",
    timeZone: TIMEZONE,
  }).format(startDate);

  const sameDay =
    formatDate(event.startAt) ===
    formatDate(event.endAt);

  const timeLabel = sameDay
    ? `${formatTime(event.startAt)} – ${formatTime(event.endAt)} WIB`
    : `${formatDate(event.startAt)}, ${formatTime(event.startAt)} – ${formatDate(event.endAt)}, ${formatTime(event.endAt)} WIB`;

  return (
    <article className="space-y-4 rounded-xl border bg-card p-4 sm:p-5">

      <div className="flex items-start gap-4">

        <div className="flex min-w-16 shrink-0 flex-col items-center justify-center rounded-xl bg-primary/20 p-3">

          <span className="text-3xl font-bold">
            {day}
          </span>

          <span className="text-xs font-semibold uppercase">
            {month}
          </span>

        </div>

        <div className="min-w-0 flex-1 space-y-2">

          <div className="flex flex-wrap items-center gap-2">

            <h3 className="break-words font-semibold">
              {event.title}
            </h3>

            <Badge className={STATUS_COLORS[status]}>
              {STATUS_LABELS[status]}
            </Badge>

          </div>

          {event.description && (
            <p className="whitespace-pre-wrap break-words text-sm text-muted-foreground">
              {event.description}
            </p>
          )}

          <div className="flex items-start gap-2 text-sm text-muted-foreground">
            <CalendarDays
              size={16}
              className="mt-0.5 shrink-0"
            />

            {formatDate(event.startAt)}
          </div>

          <div className="flex items-start gap-2 text-sm text-muted-foreground">
            <Clock
              size={16}
              className="mt-0.5 shrink-0"
            />

            {timeLabel}
          </div>

          <div className="flex items-start gap-2 text-sm text-muted-foreground">
            <MapPin
              size={16}
              className="mt-0.5 shrink-0"
            />

            {event.location || "Lokasi belum ditentukan"}
          </div>

        </div>

      </div>

      <div className="flex items-center justify-between gap-2 border-t pt-3">

        <p className="text-xs font-medium text-muted-foreground">

          {status === "upcoming" &&
            `Dimulai ${getCountdown(event.startAt, now)}`}

          {status === "ongoing" &&
            "Acara sedang berlangsung"}

          {status === "completed" &&
            "Acara sudah selesai"}

        </p>

        <div className="flex shrink-0 gap-1">

          <Button
            variant="ghost"
            size="icon"
            aria-label="Edit acara"
            onClick={() => onEdit(event)}
          >
            <Pencil size={16} />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className="text-destructive"
            aria-label="Hapus acara"
            onClick={() => onDelete(event.id)}
          >
            <Trash2 size={16} />
          </Button>

        </div>

      </div>

    </article>
  );
}
