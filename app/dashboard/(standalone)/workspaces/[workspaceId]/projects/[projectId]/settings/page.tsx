import React from "react";
import { redirect } from "next/navigation";

import { getCurrent } from "@/features/auth/queries";

import ProjectEditPageClient from "./client";

const ProjectSettingPage = async () => {
  const user = await getCurrent();
  if (!user) redirect("/sign-in");

  return <ProjectEditPageClient />;
};

export default ProjectSettingPage;
