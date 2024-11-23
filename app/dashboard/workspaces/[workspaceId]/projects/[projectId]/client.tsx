"use client";
import React from "react";
import Link from "next/link";
import { PencilIcon } from "lucide-react";

import Analytics from "@/components/analytics";
import { Button } from "@/components/ui/button";
import PageError from "@/components/page-error";
import PageLoader from "@/components/page-loader";
import { useProjectId } from "@/features/projects/hooks/use-project-id";
import ProjectAvatar from "@/features/projects/components/Project-Avatar";
import { useGetProject, useGetProjectAnalytics } from "@/features/projects/api";
import TaskViewSwitcher from "@/features/tasks/components/task-view-switcher";

const ProjectIdClient = () => {
  /**
   * Retrieves the project ID using a custom hook.
   * @returns The project ID.
   */
  const projectId = useProjectId();
  /**
   * Fetches project data using the projectId and manages loading state.
   * @param {string} projectId - The unique identifier of the project to fetch.
   * @returns An object containing the project data and a boolean indicating if the data is still loading.
   */
  const { data, isLoading } = useGetProject({ projectId });
  /**
   * Fetches project analytics data using the projectId and sets the data and loading state.
   * @param {string} projectId - The unique identifier of the project to fetch analytics for.
   * @returns Object containing the analytics data and loading state.
   */
  const { data: analyticsData, isLoading: isLoadingAnalytics } =
    useGetProjectAnalytics({ projectId });

  /**
   * Renders a PageLoader component if isLoading is true.
   * @param {boolean} isLoading - A flag indicating whether the page is still loading.
   * @returns {JSX.Element} - The PageLoader component if isLoading is true, otherwise null.
   */
  if (isLoading || isLoadingAnalytics) {
    return <PageLoader />;
  }

  /**
   * Checks if the data is falsy, and if so, returns a PageError component with the message "Project Not Found".
   * @param {any} data - The data to check for existence.
   * @returns {JSX.Element} - Either a PageError component or null.
   */
  if (!data || !analyticsData) {
    return <PageError message="Project Not Found" />;
  }
  return (
    <div className="flex flex-col gap-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-x-2">
          <ProjectAvatar
            name={data?.name}
            image={data.imageUrl}
            className="size-8"
          />
          <p className="text-lg font-semibold">{data.name}</p>
        </div>
        <div>
          <Button asChild variant={"outline"} size={"sm"}>
            <Link
              href={`/dashboard/workspaces/${data.workspaceId}/projects/${data.$id}/settings`}
            >
              <PencilIcon className="size-4" />
              Edit Project
            </Link>
          </Button>
        </div>
      </div>
      {analyticsData && <Analytics data={analyticsData} />}
      <TaskViewSwitcher />
    </div>
  );
};

export default ProjectIdClient;
