import React from "react";
import { Loader } from "lucide-react";

import { useGetMembers } from "@/features/members/api";
import { useGetProjects } from "@/features/projects/api";
import { Card, CardContent } from "@/components/ui/card";
import { useWorkspaceId } from "@/features/workspaces/hooks/use-workspace-id";

import { useGetTask } from "../api";
import EditTaskForm from "./edit-task-form";

interface EditTaskModalWrapperProps {
  onCancel: () => void;
  id: string;
}

const EditTaskModalWrapper = ({ onCancel, id }: EditTaskModalWrapperProps) => {
  const workspaceId = useWorkspaceId();
  const { data: task, isLoading: isLoadingTask } = useGetTask({ taskId: id });

  const { data: projects, isLoading: isLoadingProjects } = useGetProjects({
    workspaceId,
  });
  const { data: members, isLoading: isLoadingMembers } = useGetMembers({
    workspaceId,
  });

  const projectsOptions = projects?.documents.map((project) => ({
    id: project.$id,
    name: project.name,
    imageUrl: project.imageUrl,
  }));
  const membersOptions = members?.documents.map((member) => ({
    id: member.$id,
    name: member.name,
  }));

  const isLoading =
    isLoadingMembers ||
    isLoadingProjects ||
    !membersOptions ||
    !projectsOptions ||
    isLoadingTask ||
    !task;

  if (isLoading) {
    return (
      <Card className="w-full h-[714px] border-none shadow-none">
        <CardContent className="flex items-center justify-center h-full">
          <Loader className="size-5 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }

  return (
    <EditTaskForm
      onCancel={onCancel}
      membersOptions={membersOptions}
      projectsOptions={projectsOptions}
      initialValue={task}
    />
  );
};

export default EditTaskModalWrapper;
