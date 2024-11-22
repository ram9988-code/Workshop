"use client";

import PageError from "@/components/page-error";
import PageLoader from "@/components/page-loader";
import { useGetTask } from "@/features/tasks/api";
import TaskBreadcrumbs from "@/features/tasks/components/task-breadcrumbs";
import TaskOverView from "@/features/tasks/components/task-overview";
import { useTaskId } from "@/features/tasks/hooks/use-task-id";

export const TaskIdClient = () => {
  const taskId = useTaskId();
  const { data, isLoading, error } = useGetTask({ taskId });

  if (isLoading || !data) {
    return <PageLoader />;
  }

  console.log(error);

  return (
    <div className="flex flex-col">
      <TaskBreadcrumbs project={data.project} task={data} />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <TaskOverView task={data} />
      </div>
    </div>
  );
};
