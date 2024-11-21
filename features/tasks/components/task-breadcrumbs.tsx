import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronsRightIcon, TrashIcon } from "lucide-react";

import useConfirm from "@/hooks/use-confirm";
import { Button } from "@/components/ui/button";
import { Project } from "@/features/projects/types";
import ProjectAvatar from "@/features/projects/components/Project-Avatar";
import { useWorkspaceId } from "@/features/workspaces/hooks/use-workspace-id";

import { Task } from "../types";
import { useDeleteTask } from "../api";

interface TaskBreadcrumbsProps {
  project: Project;
  task: Task;
}
const TaskBreadcrumbs = ({ project, task }: TaskBreadcrumbsProps) => {
  const workspaceId = useWorkspaceId();
  const router = useRouter();
  const { mutate, isPending } = useDeleteTask();
  const [ConfirmDialog, confirm] = useConfirm(
    "Delete task",
    "This action cannot be undone",
    "destructive"
  );

  const handleDeleteTask = async () => {
    const ok = await confirm();
    if (!ok) return;
    mutate(
      { param: { taskId: task.$id } },
      {
        onSuccess: () => {
          router.push(`/dashboard/workspace/${workspaceId}/tasks`);
        },
      }
    );
  };

  return (
    <div className="flex items-center gap-x-2">
      <ConfirmDialog />
      <ProjectAvatar
        name={project.name}
        image={project.imageUrl}
        className="size-6 lg:size-8"
      />
      <Link
        href={`/dashboard/workspaces/${workspaceId}/projects/${project.$id}`}
      >
        <p className="text-sm lg:text-lg font-semibold text-muted-foreground hover:opacity-75 transition">
          {project.name}
        </p>
      </Link>
      <ChevronsRightIcon className="size-4 lg:size-5 text-muted-foreground" />
      <p className="text-sm lg:text-lg font-semibold">{task.name}</p>
      <Button
        onClick={handleDeleteTask}
        disabled={isPending}
        className="ml-auto"
        variant={"destructive"}
        size={"sm"}
      >
        <TrashIcon className="size-4 lg:mr-2" />
        <span className="hidden lg:block">Delete Task</span>
      </Button>
    </div>
  );
};

export default TaskBreadcrumbs;
