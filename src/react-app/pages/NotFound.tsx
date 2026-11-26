import { Link } from "react-router-dom";

import {
  FileQuestion,
  ArrowLeft,
} from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex min-h-[65vh] flex-col items-center justify-center gap-4 text-center">

      <div className="rounded-full bg-muted p-6">
        <FileQuestion
          size={48}
          className="text-muted-foreground"
        />
      </div>

      <h1 className="text-5xl font-bold">
        404
      </h1>

      <h2 className="text-xl font-semibold">
        Halaman Tidak Ditemukan
      </h2>

      <p className="max-w-sm text-sm text-muted-foreground">
        Halaman yang kamu cari tidak tersedia
        atau sudah dipindahkan.
      </p>

      <Link
        to="/"
        className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
      >
        <ArrowLeft size={16} />
        Kembali ke Dashboard
      </Link>

    </div>
  );
}