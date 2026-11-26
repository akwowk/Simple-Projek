
import { useState } from "react";
import type { FormEvent } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

import {
  toLocalInput,
  fromLocalInput,
} from "@/lib/date";

import type { Event } from "@/types";

interface Props {
  open: boolean;
  onClose: () => void;
  onSave: (event: Event) => void;
  initialData?: Event | null;
}

export default function EventForm({
  open,
  onClose,
  onSave,
  initialData,
}: Props) {
  const [title, setTitle] = useState(
    initialData?.title ?? ""
  );

  const [description, setDescription] = useState(
    initialData?.description ?? ""
  );

  const [location, setLocation] = useState(
    initialData?.location ?? ""
  );

  const [startAt, setStartAt] = useState(
    initialData
      ? toLocalInput(initialData.startAt)
      : ""
  );

  const [endAt, setEndAt] = useState(
    initialData
      ? toLocalInput(initialData.endAt)
      : ""
  );

  const [error, setError] = useState("");

  function handleStartChange(value: string) {
    setStartAt(value);

    // Otomatis mengisi durasi awal satu jam.
    if (value && (!endAt || endAt <= value)) {
      const start = Date.parse(
        `${value}:00+07:00`
      );

      if (!Number.isNaN(start)) {
        setEndAt(
          toLocalInput(
            new Date(
              start + 3600000
            ).toISOString()
          )
        );
      }
    }
  }

  function handleSubmit(
    e: FormEvent<HTMLFormElement>
  ) {
    e.preventDefault();
    setError("");

    if (!title.trim()) {
      setError("Nama acara wajib diisi.");
      return;
    }

    if (!startAt || !endAt) {
      setError("Waktu mulai dan selesai wajib diisi.");
      return;
    }

    const start = Date.parse(
      `${startAt}:00+07:00`
    );

    const end = Date.parse(
      `${endAt}:00+07:00`
    );

    if (
      Number.isNaN(start) ||
      Number.isNaN(end)
    ) {
      setError("Tanggal atau waktu tidak valid.");
      return;
    }

    if (start >= end) {
      setError(
        "Waktu selesai harus setelah waktu mulai."
      );
      return;
    }

    const event: Event = {
      id: initialData?.id ?? crypto.randomUUID(),
      title: title.trim(),
      description: description.trim(),
      location: location.trim(),
      startAt: fromLocalInput(startAt),
      endAt: fromLocalInput(endAt),
    };

    onSave(event);
    onClose();
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(value) => {
        if (!value) onClose();
      }}
    >
      <DialogContent className="max-h-[90dvh] overflow-y-auto sm:max-w-lg">

        <DialogHeader>

          <DialogTitle>
            {initialData ? "Edit Acara" : "Tambah Acara"}
          </DialogTitle>

          <DialogDescription>
            Catat aktivitas dan acara pentingmu.
          </DialogDescription>

        </DialogHeader>

        <form
          className="space-y-4"
          onSubmit={handleSubmit}
        >

          <div className="space-y-2">
            <Label htmlFor="event-title">
              Nama Acara
            </Label>

            <Input
              id="event-title"
              placeholder="Contoh: Seminar teknologi"
              value={title}
              onChange={(e) =>
                setTitle(e.target.value)
              }
              maxLength={150}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="event-start">
              Waktu Mulai (WIB)
            </Label>

            <Input
              id="event-start"
              type="datetime-local"
              value={startAt}
              onChange={(e) =>
                handleStartChange(e.target.value)
              }
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="event-end">
              Waktu Selesai (WIB)
            </Label>

            <Input
              id="event-end"
              type="datetime-local"
              value={endAt}
              min={startAt || undefined}
              onChange={(e) =>
                setEndAt(e.target.value)
              }
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="event-location">
              Lokasi
            </Label>

            <Input
              id="event-location"
              placeholder="Contoh: Aula kampus atau online"
              value={location}
              onChange={(e) =>
                setLocation(e.target.value)
              }
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="event-description">
              Deskripsi
            </Label>

            <textarea
              id="event-description"
              rows={3}
              className="w-full resize-y rounded-md border border-input bg-background p-3 text-sm"
              placeholder="Informasi tambahan tentang acara..."
              value={description}
              onChange={(e) =>
                setDescription(e.target.value)
              }
            />
          </div>

          {error && (
            <p
              role="alert"
              className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive"
            >
              {error}
            </p>
          )}

          <DialogFooter>

            <Button
              type="button"
              variant="outline"
              onClick={onClose}
            >
              Batal
            </Button>

            <Button type="submit">
              Simpan Acara
            </Button>

          </DialogFooter>

        </form>

      </DialogContent>
    </Dialog>
  );
}
