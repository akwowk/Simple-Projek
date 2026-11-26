
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

import type { Subject } from "@/types";

const COLORS = [
  "#3b82f6",
  "#16a34a",
  "#9333ea",
  "#f59e0b",
  "#ef4444",
  "#ec4899",
  "#06b6d4",
  "#64748b",
];

interface Props {
  open: boolean;
  onClose: () => void;
  onSave: (subject: Subject) => void;
  subjects: Subject[];
}

export default function SubjectForm({
  open,
  onClose,
  onSave,
  subjects,
}: Props) {
  const [name, setName] = useState("");
  const [lecturer, setLecturer] = useState("");
  const [color, setColor] = useState(COLORS[0]);
  const [error, setError] = useState("");

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    setError("");

    if (!name.trim() || !lecturer.trim()) {
      setError("Nama mata kuliah dan dosen wajib diisi.");
      return;
    }

    const exists = subjects.some(
      (subject) =>
        subject.name.toLowerCase() ===
        name.trim().toLowerCase()
    );

    if (exists) {
      setError("Mata kuliah sudah tersedia.");
      return;
    }

    onSave({
      id: crypto.randomUUID(),
      name: name.trim(),
      lecturer: lecturer.trim(),
      color,
    });

    onClose();
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(value) => {
        if (!value) onClose();
      }}
    >
      <DialogContent className="sm:max-w-md">

        <DialogHeader>
          <DialogTitle>
            Tambah Mata Kuliah
          </DialogTitle>

          <DialogDescription>
            Mata kuliah dapat digunakan untuk jadwal
            dan tugas.
          </DialogDescription>
        </DialogHeader>

        <form
          className="space-y-4"
          onSubmit={handleSubmit}
        >

          <div className="space-y-2">
            <Label htmlFor="subject-name">
              Nama Mata Kuliah
            </Label>

            <Input
              id="subject-name"
              placeholder="Contoh: Basis Data"
              value={name}
              onChange={(e) =>
                setName(e.target.value)
              }
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="lecturer">
              Nama Dosen
            </Label>

            <Input
              id="lecturer"
              placeholder="Nama dosen pengampu"
              value={lecturer}
              onChange={(e) =>
                setLecturer(e.target.value)
              }
              required
            />
          </div>

          <div className="space-y-2">
            <Label>Warna Mata Kuliah</Label>

            <div className="flex flex-wrap gap-3">
              {COLORS.map((item) => (
                <button
                  type="button"
                  key={item}
                  aria-label={`Pilih warna ${item}`}
                  aria-pressed={color === item}
                  onClick={() => setColor(item)}
                  className={`size-8 rounded-full transition-transform ${
                    color === item
                      ? "scale-110 ring-2 ring-foreground ring-offset-2"
                      : "hover:scale-110"
                  }`}
                  style={{ backgroundColor: item }}
                />
              ))}
            </div>
          </div>

          {error && (
            <p
              role="alert"
              className="text-sm text-destructive"
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
              Simpan Mata Kuliah
            </Button>
          </DialogFooter>

        </form>
      </DialogContent>
    </Dialog>
  );
}
