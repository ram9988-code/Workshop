"use client";

import PageError from "@/components/page-error";
import PageLoader from "@/components/page-loader";
import { useGetProjects } from "@/features/projects/api";
import ProjectCard from "@/features/projects/components/project-card";
import { useWorkspaceId } from "@/features/workspaces/hooks/use-workspace-id";

const WorkspaceIdClient = () => {
  const workspaceId = useWorkspaceId();
  const { data, isLoading } = useGetProjects({ workspaceId });

  if (isLoading) return <PageLoader />;

  if (!data?.documents) {
    return <PageError message="Projects Not Found" />;
  }
  return (
    <div className="grid grid-cols-2 lg:grid-cols-2 gap-8">
      {data.documents.map((project) => (
        <div key={project.$id}>
          <ProjectCard project={project} />
        </div>
      ))}
    </div>
  );
};

export default WorkspaceIdClient;
