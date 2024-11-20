import React from "react";
import { differenceInDays, format } from "date-fns";

import { cn } from "@/lib/utils";

interface TaskDateProps {
  value: string;
  className?: string;
}

const TaskDate = ({ value, className }: TaskDateProps) => {
  const today = new Date();
  const endDate = new Date(value);
  const diffInDays = differenceInDays(endDate, today);

  let textColor = "text-muted-foreground";

  if (diffInDays <= 3) {
    textColor = "text-red-300";
  } else if (diffInDays <= 7) {
    textColor = "text-orange-500";
  } else if (diffInDays <= 14) {
    textColor = "text-yellow-500";
  }

  return (
    <div className={cn("truncate", textColor, className)}>
      <span>{format(value, "PPP")}</span>
    </div>
  );
};

export default TaskDate;
