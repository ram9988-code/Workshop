import React from "react";
import { redirect } from "next/navigation";

import { getCurrent } from "@/features/auth/queries";
import { TaskIdClient } from "./client";

const TaskPage = async () => {
  const user = await getCurrent();
  if (!user) {
    redirect("/sign-in");
  }
  return <TaskIdClient />;
};

export default TaskPage;
