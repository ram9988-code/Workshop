"use client";
import Link from "next/link";
import { AlertTriangle } from "lucide-react";

import { Button } from "@/components/ui/button";

interface PageErrorProps {
  message: string;
}
const PageError = ({ message = "Something went wrong" }: PageErrorProps) => {
  return (
    <div className="h-screen flex flex-col gap-y-2 items-center justify-center">
      <AlertTriangle />
      <p className="text-sm text-muted-foreground">{message}</p>
    </div>
  );
};

export default PageError;
