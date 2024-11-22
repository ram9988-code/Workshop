"use client";

import PageError from "@/components/page-error";
import PageLoader from "@/components/page-loader";
import { useGetWorkspace } from "@/features/workspaces/api/use-get-workspace";
import { useWorkspaceId } from "@/features/workspaces/hooks/use-workspace-id";
import EditWorkspaceForm from "@/features/workspaces/components/edit-workspace-form";

const WorksapceIdSettingClient = () => {
  const workspaceId = useWorkspaceId();
  const { data: initialValue, isLoading } = useGetWorkspace({ workspaceId });

  if (isLoading) {
    return <PageLoader />;
  }

  if (!initialValue) {
    return <PageError message="Workspace not found" />;
  }

  console.log(initialValue);
  return (
    <div className="w-full lg:max-w-4xl">
      <EditWorkspaceForm initialValues={initialValue} />
    </div>
  );
};

export default WorksapceIdSettingClient;
