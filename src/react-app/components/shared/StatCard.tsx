import type { ReactNode } from "react";

import {
  Card,
  CardContent,
} from "@/components/ui/card";

interface Props {
  title: string;
  value: number;
  icon: ReactNode;
  color?: string;
}

export default function StatCard({
  title,
  value,
  icon,
  color = "bg-primary/20 text-foreground",
}: Props) {
  return (
    <Card>
      <CardContent className="flex items-center gap-3 p-4">
        <div className={`shrink-0 rounded-xl p-3 ${color}`}>
          {icon}
        </div>

        <div className="min-w-0">
          <p className="text-xs text-muted-foreground sm:text-sm">
            {title}
          </p>

          <p className="text-2xl font-bold">
            {value}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}