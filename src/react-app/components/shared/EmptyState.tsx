import type { ReactNode } from "react";

interface Props {
  icon: ReactNode;
  title: string;
  description: string;
  action?: ReactNode;
}

export default function EmptyState({
  icon,
  title,
  description,
  action,
}: Props) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed bg-card p-8 text-center sm:p-12">

      <div className="rounded-full bg-muted p-4 text-muted-foreground">
        {icon}
      </div>

      <h3 className="font-semibold">
        {title}
      </h3>

      <p className="max-w-sm text-sm text-muted-foreground">
        {description}
      </p>

      {action}

    </div>
  );
}