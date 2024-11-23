import React from "react";
import { FaCaretDown, FaCaretUp } from "react-icons/fa";

import { Card, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { cn } from "@/lib/utils";

interface AnalyticsCardProps {
  title: string;
  value: number;
  varient: "up" | "down";
  increaseValue: number;
}

const AnalyticsCard = ({
  increaseValue,
  title,
  value,
  varient,
}: AnalyticsCardProps) => {
  const iconColor = varient === "up" ? "text-emerald-500" : "text-red-500";
  const increaseValueColor =
    varient === "up" ? "text-emerald-500" : "text-red-500";

  const Icon = varient === "up" ? FaCaretUp : FaCaretDown;
  return (
    <Card className="shadow-none border-none w-full">
      <CardHeader className="flex items-center justify-center">
        <div className="flex items-center gap-x-2.5">
          <CardDescription className="flex items-center gap-x-2 font-medium overflow-hidden">
            <span className="truncate text-base">{title}</span>
          </CardDescription>
          <div className="flex items-center gap-x-1">
            <Icon className={cn(iconColor, "size-4")} />
            <span
              className={cn(
                increaseValueColor,
                "truncate text-base font-medium"
              )}
            >
              {increaseValue}
            </span>
          </div>
        </div>
        <CardTitle className="text-3xl font-semibold">{value}</CardTitle>
      </CardHeader>
    </Card>
  );
};

export default AnalyticsCard;
