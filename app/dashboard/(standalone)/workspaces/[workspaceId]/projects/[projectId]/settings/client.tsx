"use client";
import PageError from "@/components/page-error";
import PageLoader from "@/components/page-loader";
import { useGetProject } from "@/features/projects/api";
import { useProjectId } from "@/features/projects/hooks/use-project-id";
import EditProjectForm from "@/features/projects/components/edit-project-form";

const ProjectEditPageClient = () => {
  const projectId = useProjectId();
  const { data, isLoading } = useGetProject({ projectId: projectId });
  if (isLoading) {
    return <PageLoader />;
  }
  if (!data) {
    return <PageError message="Project not found" />;
  }
  return (
    <div className="w-full lg:max-w-4xl">
      <EditProjectForm initialValues={data} />
    </div>
  );
};

export default ProjectEditPageClient;
