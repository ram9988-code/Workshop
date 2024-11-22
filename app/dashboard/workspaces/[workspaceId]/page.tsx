import React from "react";
import { redirect } from "next/navigation";

import { getCurrent } from "@/features/auth/queries";
import ProjectCard from "@/features/workspaces/components/project-card";

const WorkspaceIdPage = async () => {
  const user = await getCurrent();
  if (!user) redirect("/sign-in");
  return <ProjectCard />;
};

export default WorkspaceIdPage;
