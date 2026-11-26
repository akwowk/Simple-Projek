
import { useState } from "react";

import FullCalendar from "@fullcalendar/react";

import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import luxon3Plugin from "@fullcalendar/luxon3";

import idLocale from "@fullcalendar/core/locales/id";

import type {
  EventApi,
  EventClickArg,
} from "@fullcalendar/core";

import {
  Card,
  CardContent,
} from "@/components/ui/card";

import { usePlanner } from "@/context/PlannerContext";

import CalendarFilters from
  "@/features/calendar/CalendarFilters";

import CalendarDetail from
  "@/features/calendar/CalendarDetail";

import {
  buildCalendarEvents,
} from "@/lib/calendar";

import type {
  CalendarCategory,
} from "@/lib/calendar";

import "@/features/calendar/calendar.css";

export default function Calendar() {
  const {
    schedules,
    subjects,
    tasks,
    events,
  } = usePlanner();

  const [categories, setCategories] =
    useState<CalendarCategory[]>([
      "schedule",
      "task",
      "event",
    ]);

  const [selectedEvent, setSelectedEvent] =
    useState<EventApi | null>(null);

  const calendarEvents = buildCalendarEvents(
    schedules,
    subjects,
    tasks,
    events
  ).filter((event) =>
    categories.includes(
      event.extendedProps?.category
    )
  );

  function toggleCategory(
    category: CalendarCategory
  ) {
    setCategories((previous) =>
      previous.includes(category)
        ? previous.filter(
            (item) => item !== category
          )
        : [...previous, category]
    );
  }

  function handleEventClick(
    info: EventClickArg
  ) {
    setSelectedEvent(info.event);
  }

  return (
    <div className="min-w-0 space-y-6">

      <section>
        <h1 className="text-2xl font-bold tracking-tight">
          Kalender
        </h1>

        <p className="mt-1 text-sm text-muted-foreground">
          Lihat seluruh jadwal, tugas, dan acara
          dalam satu kalender.
        </p>
      </section>

      <CalendarFilters
        selected={categories}
        onChange={toggleCategory}
      />

      <Card className="min-w-0">
        <CardContent className="p-2 sm:p-5">

          <div className="planner-calendar">

            <FullCalendar
              plugins={[
                dayGridPlugin,
                timeGridPlugin,
                interactionPlugin,
                luxon3Plugin,
              ]}

              locale={idLocale}

              timeZone="Asia/Jakarta"

              initialView="dayGridMonth"

              firstDay={1}

              headerToolbar={{
                left: "prev,next today",
                center: "title",
                right: "dayGridMonth,timeGridWeek,timeGridDay",
              }}

              buttonText={{
                today: "Hari ini",
                month: "Bulan",
                week: "Minggu",
                day: "Hari",
              }}

              events={calendarEvents}

              eventClick={handleEventClick}

              height="auto"

              dayMaxEvents={3}

              moreLinkText={(count) =>
                `+${count} lainnya`
              }

              nowIndicator={true}

              editable={false}

              selectable={false}

              allDaySlot={false}

              slotMinTime="00:00:00"

              slotMaxTime="24:00:00"

              scrollTime="07:00:00"

              eventTimeFormat={{
                hour: "2-digit",
                minute: "2-digit",
                hour12: false,
              }}

              slotLabelFormat={{
                hour: "2-digit",
                minute: "2-digit",
                hour12: false,
              }}

            />

          </div>

        </CardContent>
      </Card>

      <CalendarDetail
        event={selectedEvent}
        onClose={() => setSelectedEvent(null)}
      />

    </div>
  );
}
