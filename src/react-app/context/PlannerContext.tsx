
/* eslint-disable react-refresh/only-export-components */

import {
  createContext,
  useContext,
  useState,
} from "react";

import type {
  ReactNode,
  Dispatch,
  SetStateAction,
} from "react";

import type {
  Subject,
  Schedule,
  Task,
  Event,
} from "@/types";

import {
  subjects as mockSubjects,
  schedules as mockSchedules,
  tasks as mockTasks,
  events as mockEvents,
} from "@/data/mock";

interface PlannerContextType {
  subjects: Subject[];
  setSubjects: Dispatch<SetStateAction<Subject[]>>;

  schedules: Schedule[];
  setSchedules: Dispatch<SetStateAction<Schedule[]>>;

  tasks: Task[];
  setTasks: Dispatch<SetStateAction<Task[]>>;

  events: Event[];
  setEvents: Dispatch<SetStateAction<Event[]>>;
}

const PlannerContext = createContext<
  PlannerContextType | undefined
>(undefined);

export function PlannerProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [subjects, setSubjects] =
    useState<Subject[]>(mockSubjects);

  const [schedules, setSchedules] =
    useState<Schedule[]>(mockSchedules);

  const [tasks, setTasks] =
    useState<Task[]>(mockTasks);

  const [events, setEvents] =
    useState<Event[]>(mockEvents);

  return (
    <PlannerContext.Provider
      value={{
        subjects,
        setSubjects,
        schedules,
        setSchedules,
        tasks,
        setTasks,
        events,
        setEvents,
      }}
    >
      {children}
    </PlannerContext.Provider>
  );
}

export function usePlanner() {
  const context = useContext(PlannerContext);

  if (!context) {
    throw new Error(
      "usePlanner must be used inside PlannerProvider"
    );
  }

  return context;
}
