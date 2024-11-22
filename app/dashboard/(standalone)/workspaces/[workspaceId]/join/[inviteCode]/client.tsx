"use client";

import { useWorkspaceId } from "@/features/workspaces/hooks/use-workspace-id";
import JoinWorkspaceForm from "@/features/workspaces/components/join-workspace-form";
import PageError from "@/components/page-error";
import { useGetWorkspaceInfo } from "@/features/workspaces/api";
import PageLoader from "@/components/page-loader";

const JoinWorkspaceClient = () => {
  const workspaceId = useWorkspaceId();
  const { data: workspace, isLoading } = useGetWorkspaceInfo({ workspaceId });

  if (isLoading) {
    return <PageLoader />;
  }
  if (!workspace) {
    return <PageError message="Workspace not found" />;
  }
  return (
    <div className="w-3/4 lg:max-w-xl">
      <JoinWorkspaceForm initialValue={workspace} />
    </div>
  );
};

export default JoinWorkspaceClient;
