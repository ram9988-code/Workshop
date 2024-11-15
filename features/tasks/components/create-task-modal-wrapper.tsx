import React from "react";
import { Loader } from "lucide-react";

import { useGetMembers } from "@/features/members/api";
import { useGetProjects } from "@/features/projects/api";
import { Card, CardContent } from "@/components/ui/card";
import { useWorkspaceId } from "@/features/workspaces/hooks/use-workspace-id";

import CreateTaskForm from "./create-task-form";

interface CreateTaskModalWrapperProps {
  onCancel: () => void;
}
const CreateTaskModalWrapper = ({ onCancel }: CreateTaskModalWrapperProps) => {
  const workspaceId = useWorkspaceId();

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
    !projectsOptions;

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
    <CreateTaskForm
      onCancel={onCancel}
      membersOptions={membersOptions}
      projectsOptions={projectsOptions}
    />
  );
};

export default CreateTaskModalWrapper;
