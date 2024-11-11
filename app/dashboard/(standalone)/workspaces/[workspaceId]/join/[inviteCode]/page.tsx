import { redirect } from "next/navigation";

import { getCurrent } from "@/features/auth/queries";
import { getWorkspaceInfo } from "@/features/workspaces/queries";
import JoinWorkspaceForm from "@/features/workspaces/components/join-workspace-form";

interface JoinWorkspacePageProps {
  params: {
    workspaceId: string;
  };
}
const JoinWorkspacePage = async ({ params }: JoinWorkspacePageProps) => {
  const { workspaceId } = await params;
  const user = await getCurrent();

  if (!user) redirect("/sign-in");

  const workspace = await getWorkspaceInfo({ workspaceId });

  if (!workspace) redirect("/dashboard/");
  return (
    <div className="w-3/4 lg:max-w-xl">
      <JoinWorkspaceForm initialValue={workspace} />
    </div>
  );
};

export default JoinWorkspacePage;
