import { getCurrent } from "@/features/auth/action";
import CreateWorkspaceForm from "@/features/workspaces/components/create-workspace-form";
import { redirect } from "next/navigation";
import React from "react";

const Dashboard = async () => {
  const user = await getCurrent();
  if (!user) redirect("/sign-in");

  return (
    <div className="flex items-center justify-center flex-col">
      <CreateWorkspaceForm />
    </div>
  );
};

export default Dashboard;
