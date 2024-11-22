"use client";

import React from "react";
import { useWorkspaceId } from "../../workspaces/hooks/use-workspace-id";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useGetTasks } from "@/features/tasks/api";
import { Task, TaskStatus } from "@/features/tasks/types";
import { Button } from "@/components/ui/button";

import { Project } from "../types";
import ProjectAvatar from "./Project-Avatar";
import { Skeleton } from "@/components/ui/skeleton";
import CardstatusHeader from "./card-status-header";
import Link from "next/link";
import { useCreateProjectModal } from "../hooks/use-create-project-modal";

interface ProjectCardProps {
  project: Project;
}

type TaskState = {
  [key in TaskStatus]: Task[];
};

const boards: TaskStatus[] = [
  TaskStatus.BACKLOG,
  TaskStatus.DONE,
  TaskStatus.IN_PROGRESS,
  TaskStatus.IN_REVIEW,
  TaskStatus.TODO,
];
const ProjectCard = ({ project }: ProjectCardProps) => {
  const workspaceId = useWorkspaceId();
  const { open } = useCreateProjectModal();
  const { data, isLoading } = useGetTasks({
    workspaceId,
    projectId: project.$id,
  });

  if (!data) {
    return (
      <div className="flex items-center space-x-4">
        <Skeleton className="h-12 w-12 rounded-full" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-[250px]" />
          <Skeleton className="h-4 w-[200px]" />
        </div>
      </div>
    );
  }

  const tasks = () => {
    const initialTasks: TaskState = {
      [TaskStatus.BACKLOG]: [],
      [TaskStatus.DONE]: [],
      [TaskStatus.IN_PROGRESS]: [],
      [TaskStatus.IN_REVIEW]: [],
      [TaskStatus.TODO]: [],
    };
    data?.forEach((task) => {
      initialTasks[task.status].push(task);
    });

    Object.keys(initialTasks).forEach((status) => {
      initialTasks[status as TaskStatus].sort(
        (a, b) => a.position - b.position
      );
    });
    return initialTasks;
  };
  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex flex-row items-center">
          <ProjectAvatar
            name={project.name}
            image={project.imageUrl}
            className="size-10 mr-2"
          />
          <CardTitle>{project.name}</CardTitle>
        </div>
        <CardDescription className="text-base font-medium">
          Task Status
        </CardDescription>
        <div className="flex flex-row items-center justify-between">
          {boards?.map((board) => (
            <CardstatusHeader
              key={board}
              board={board}
              taskCount={tasks()[board].length}
            />
          ))}
        </div>
      </CardHeader>
      <CardContent></CardContent>
      <CardFooter className="flex justify-between">
        <Button asChild variant={"outline"}>
          <Link
            href={`/dashboard/workspaces/${workspaceId}/projects/${project.$id}/settings`}
          >
            Edit project
          </Link>
        </Button>
        <Button asChild>
          <Link
            href={`/dashboard/workspaces/${workspaceId}/projects/${project.$id}`}
          >
            Open
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ProjectCard;
