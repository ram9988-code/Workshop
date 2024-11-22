import { redirect } from "next/navigation";

import { getCurrent } from "@/features/auth/queries";
import JoinWorkspaceClient from "./client";

const JoinWorkspacePage = async () => {
  const user = await getCurrent();

  if (!user) redirect("/sign-in");
  return <JoinWorkspaceClient />;
};

export default JoinWorkspacePage;
