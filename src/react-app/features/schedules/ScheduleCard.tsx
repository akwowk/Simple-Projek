
import {
  Clock,
  MapPin,
  UserRound,
  Pencil,
  Trash2,
} from "lucide-react";

import { Button } from "@/components/ui/button";

import type {
  Schedule,
  Subject,
} from "@/types";

interface Props {
  schedule: Schedule;
  subject?: Subject;
  onEdit: (schedule: Schedule) => void;
  onDelete: (id: string) => void;
}

export default function ScheduleCard({
  schedule,
  subject,
  onEdit,
  onDelete,
}: Props) {
  return (
    <article
      className="overflow-hidden rounded-xl border border-l-4 bg-card"
      style={{
        borderLeftColor: subject?.color ?? "#3fcb83",
      }}
    >
      <div className="space-y-3 p-4 md:p-5">

        <div className="flex flex-wrap items-center justify-between gap-2">

          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Clock size={16} />

            <span>
              {schedule.startTime} – {schedule.endTime} WIB
            </span>
          </div>

          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onEdit(schedule)}
              aria-label="Edit jadwal"
            >
              <Pencil size={16} />
            </Button>

            <Button
              variant="ghost"
              size="icon"
              className="text-destructive hover:text-destructive"
              onClick={() => onDelete(schedule.id)}
              aria-label="Hapus jadwal"
            >
              <Trash2 size={16} />
            </Button>
          </div>

        </div>

        <h3 className="text-lg font-semibold">
          {subject?.name ?? "Mata kuliah tidak ditemukan"}
        </h3>

        <div className="flex flex-wrap gap-x-5 gap-y-2 text-sm text-muted-foreground">

          <div className="flex items-center gap-2">
            <UserRound size={16} />
            {subject?.lecturer ?? "-"}
          </div>

          <div className="flex items-center gap-2">
            <MapPin size={16} />
            {schedule.room}
          </div>

        </div>

      </div>
    </article>
  );
}
