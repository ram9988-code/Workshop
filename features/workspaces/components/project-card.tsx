"use client";

import { useGetProjects } from "@/features/projects/api";
import React from "react";
import { useWorkspaceId } from "../hooks/use-workspace-id";

const ProjectCard = () => {
  const workspaceId = useWorkspaceId();
  const { data } = useGetProjects({ workspaceId });
  console.log(data);
  return <div>ProjectCard</div>;
};

export default ProjectCard;
