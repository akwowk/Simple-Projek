
import type { EventApi } from "@fullcalendar/core";

import { useNavigate } from "react-router-dom";

import {
  Clock,
  MapPin,
  BookOpen,
  ExternalLink,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

import { formatDateTime } from "@/lib/date";

import type {
  CalendarCategory,
} from "@/lib/calendar";

interface Props {
  event: EventApi | null;
  onClose: () => void;
}

const CATEGORY_CONFIG = {
  schedule: {
    label: "Mata Kuliah",
    path: "/schedule",
  },
  task: {
    label: "Deadline Tugas",
    path: "/tasks",
  },
  event: {
    label: "Acara",
    path: "/events",
  },
};

export default function CalendarDetail({
  event,
  onClose,
}: Props) {
  const navigate = useNavigate();

  if (!event) return null;

  const category =
    event.extendedProps.category as CalendarCategory;

  const config = CATEGORY_CONFIG[category];

  return (
    <Dialog
      open={event !== null}
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
    >
      <DialogContent className="max-h-[90dvh] overflow-y-auto sm:max-w-md">

        <DialogHeader>

          <DialogTitle>
            {event.title}
          </DialogTitle>

          <DialogDescription>
            Detail aktivitas kalender.
          </DialogDescription>

        </DialogHeader>

        <div className="space-y-4">

          <Badge variant="secondary">
            {config.label}
          </Badge>

          {event.start && (
            <div className="flex items-start gap-3">
              <Clock
                size={18}
                className="mt-1 shrink-0 text-muted-foreground"
              />

              <div>
                <p className="text-sm font-medium">
                  {category === "task"
                    ? "Deadline"
                    : "Waktu Mulai"}
                </p>

                <p className="text-sm text-muted-foreground">
                  {formatDateTime(
                    event.start.toISOString()
                  )}
                </p>
              </div>
            </div>
          )}

          {event.end && category !== "task" && (
            <div className="flex items-start gap-3">
              <Clock
                size={18}
                className="mt-1 shrink-0 text-muted-foreground"
              />

              <div>
                <p className="text-sm font-medium">
                  Waktu Selesai
                </p>

                <p className="text-sm text-muted-foreground">
                  {formatDateTime(
                    event.end.toISOString()
                  )}
                </p>
              </div>
            </div>
          )}

          {event.extendedProps.location && (
            <div className="flex items-center gap-3">
              <MapPin
                size={18}
                className="shrink-0 text-muted-foreground"
              />

              <p className="text-sm">
                {event.extendedProps.location}
              </p>
            </div>
          )}

          {event.extendedProps.subjectName && (
            <div className="flex items-center gap-3">
              <BookOpen
                size={18}
                className="shrink-0 text-muted-foreground"
              />

              <p className="text-sm">
                {event.extendedProps.subjectName}
              </p>
            </div>
          )}

          {event.extendedProps.description && (
            <div className="rounded-lg bg-muted p-3">
              <p className="mb-1 text-sm font-medium">
                {category === "schedule"
                  ? "Dosen Pengampu"
                  : "Deskripsi"}
              </p>

              <p className="whitespace-pre-wrap break-words text-sm text-muted-foreground">
                {event.extendedProps.description}
              </p>
            </div>
          )}

        </div>

        <DialogFooter>

          <Button
            variant="outline"
            onClick={onClose}
          >
            Tutup
          </Button>

          <Button
            onClick={() => {
              onClose();
              navigate(config.path);
            }}
          >
            <ExternalLink size={16} />
            Kelola Data
          </Button>

        </DialogFooter>

      </DialogContent>
    </Dialog>
  );
}
