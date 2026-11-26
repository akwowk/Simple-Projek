
import { useState } from "react";

import {
  Plus,
  Search,
  CalendarDays,
  CalendarClock,
  Timer,
  CalendarCheck,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import StatCard from "@/components/shared/StatCard";
import EmptyState from "@/components/shared/EmptyState";
import ConfirmDialog from "@/components/shared/ConfirmDialog";

import EventCard from "@/features/events/EventCard";
import EventForm from "@/features/events/EventForm";

import { usePlanner } from "@/context/PlannerContext";
import { useNow } from "@/hooks/useNow";
import { getEventStatus } from "@/lib/date";
import { cn } from "@/lib/utils";

import type { Event } from "@/types";

type EventFilter =
  | "all"
  | "upcoming"
  | "ongoing"
  | "completed";

const FILTERS: {
  value: EventFilter;
  label: string;
}[] = [
  { value: "all", label: "Semua" },
  { value: "upcoming", label: "Mendatang" },
  { value: "ongoing", label: "Berlangsung" },
  { value: "completed", label: "Selesai" },
];

export default function Events() {
  const {
    events,
    setEvents,
  } = usePlanner();

  const now = useNow();

  const [search, setSearch] = useState("");

  const [filter, setFilter] =
    useState<EventFilter>("all");

  const [formOpen, setFormOpen] = useState(false);

  const [editingEvent, setEditingEvent] =
    useState<Event | null>(null);

  const [deleteId, setDeleteId] =
    useState<string | null>(null);

  const upcoming = events.filter(
    (event) =>
      getEventStatus(
        event.startAt,
        event.endAt,
        now
      ) === "upcoming"
  ).length;

  const ongoing = events.filter(
    (event) =>
      getEventStatus(
        event.startAt,
        event.endAt,
        now
      ) === "ongoing"
  ).length;

  const completed = events.filter(
    (event) =>
      getEventStatus(
        event.startAt,
        event.endAt,
        now
      ) === "completed"
  ).length;

  const statusOrder = {
    ongoing: 0,
    upcoming: 1,
    completed: 2,
  };

  const filteredEvents = events
    .filter((event) => {
      const status = getEventStatus(
        event.startAt,
        event.endAt,
        now
      );

      const matchesFilter =
        filter === "all" || status === filter;

      const matchesSearch =
        `${event.title} ${event.description} ${event.location}`
          .toLowerCase()
          .includes(search.trim().toLowerCase());

      return matchesFilter && matchesSearch;
    })
    .sort((a, b) => {
      const statusA = getEventStatus(
        a.startAt,
        a.endAt,
        now
      );

      const statusB = getEventStatus(
        b.startAt,
        b.endAt,
        now
      );

      const order =
        statusOrder[statusA] -
        statusOrder[statusB];

      if (order !== 0) return order;

      if (statusA === "completed") {
        return (
          Date.parse(b.startAt) -
          Date.parse(a.startAt)
        );
      }

      return (
        Date.parse(a.startAt) -
        Date.parse(b.startAt)
      );
    });

  function handleAdd() {
    setEditingEvent(null);
    setFormOpen(true);
  }

  function handleEdit(event: Event) {
    setEditingEvent(event);
    setFormOpen(true);
  }

  function handleSave(event: Event) {
    setEvents((previous) => {
      const exists = previous.some(
        (item) => item.id === event.id
      );

      return exists
        ? previous.map((item) =>
            item.id === event.id ? event : item
          )
        : [...previous, event];
    });
  }

  function handleDelete() {
    if (!deleteId) return;

    setEvents((previous) =>
      previous.filter(
        (event) => event.id !== deleteId
      )
    );

    setDeleteId(null);
  }

  function resetFilters() {
    setSearch("");
    setFilter("all");
  }

  return (
    <div className="space-y-6">

      <section className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Daftar Acara
          </h1>

          <p className="mt-1 text-sm text-muted-foreground">
            Kelola aktivitas dan acara pentingmu.
          </p>
        </div>

        <Button onClick={handleAdd}>
          <Plus size={16} />
          Tambah Acara
        </Button>

      </section>

      {/* Statistics */}

      <section className="grid grid-cols-2 gap-3 xl:grid-cols-4">

        <StatCard
          title="Total Acara"
          value={events.length}
          icon={<CalendarDays size={22} />}
          color="bg-purple-100 text-purple-700"
        />

        <StatCard
          title="Mendatang"
          value={upcoming}
          icon={<CalendarClock size={22} />}
          color="bg-blue-100 text-blue-700"
        />

        <StatCard
          title="Berlangsung"
          value={ongoing}
          icon={<Timer size={22} />}
          color="bg-amber-100 text-amber-700"
        />

        <StatCard
          title="Selesai"
          value={completed}
          icon={<CalendarCheck size={22} />}
          color="bg-emerald-100 text-emerald-700"
        />

      </section>

      {/* Search and Filter */}

      <section className="space-y-4 rounded-xl border bg-card p-4">

        <div className="relative">

          <Search
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
          />

          <Input
            className="pl-10"
            placeholder="Cari acara atau lokasi..."
            aria-label="Cari acara"
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
          />

        </div>

        <div className="flex flex-wrap gap-2">

          {FILTERS.map((item) => (
            <button
              type="button"
              key={item.value}
              aria-pressed={filter === item.value}
              onClick={() => setFilter(item.value)}
              className={cn(
                "rounded-lg border px-3 py-2 text-sm font-medium transition-colors",
                filter === item.value
                  ? "border-primary bg-primary text-primary-foreground"
                  : "bg-background text-muted-foreground hover:bg-muted"
              )}
            >
              {item.label}
            </button>
          ))}

        </div>

        <div className="flex items-center justify-between gap-2">

          <p className="text-xs text-muted-foreground">
            Menampilkan {filteredEvents.length} dari{" "}
            {events.length} acara
          </p>

          <Button
            size="sm"
            variant="ghost"
            onClick={resetFilters}
          >
            Reset Filter
          </Button>

        </div>

      </section>

      {/* Event List */}

      {filteredEvents.length === 0 ? (
        <EmptyState
          icon={<CalendarDays size={32} />}
          title="Tidak ada acara"
          description="Belum ada acara atau tidak ditemukan acara yang sesuai dengan filter."
          action={
            <Button
              variant="outline"
              onClick={
                events.length
                  ? resetFilters
                  : handleAdd
              }
            >
              {events.length
                ? "Reset Filter"
                : "Tambah Acara"}
            </Button>
          }
        />
      ) : (
        <section className="grid gap-4 xl:grid-cols-2">

          {filteredEvents.map((event) => (
            <EventCard
              key={event.id}
              event={event}
              now={now}
              onEdit={handleEdit}
              onDelete={setDeleteId}
            />
          ))}

        </section>
      )}

      {formOpen && (
        <EventForm
          open={formOpen}
          initialData={editingEvent}
          onClose={() => setFormOpen(false)}
          onSave={handleSave}
        />
      )}

      <ConfirmDialog
        open={deleteId !== null}
        title="Hapus Acara?"
        description="Acara ini akan dihapus dari daftar aktivitas."
        confirmLabel="Hapus Acara"
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
      />

    </div>
  );
}
