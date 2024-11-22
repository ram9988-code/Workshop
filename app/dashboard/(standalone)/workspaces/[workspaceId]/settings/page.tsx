import { redirect } from "next/navigation";

import { getCurrent } from "@/features/auth/queries";

import WorksapceIdSettingClient from "./client";

const WorkspaceIdSettingPage = async () => {
  const user = await getCurrent();
  if (!user) redirect("/sign-in");

  return <WorksapceIdSettingClient />;
};

export default WorkspaceIdSettingPage;
