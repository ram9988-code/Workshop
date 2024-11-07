import { getCurrent } from "@/features/auth/action";
import { getWorkspaces } from "@/features/workspaces/action";
import { redirect } from "next/navigation";
import React from "react";

const Dashboard = async () => {
  const user = await getCurrent();
  if (!user) redirect("/sign-in");

  const workspaces = await getWorkspaces();

  if (workspaces?.total === 0) {
    redirect("dashboard/workspaces/create-workspace");
  } else {
    redirect(`dashboard/workspaces/${workspaces?.documents[0].$id}`);
  }

  return (
    <div className="flex items-center justify-center flex-col">Workspace</div>
  );
};

export default Dashboard;
