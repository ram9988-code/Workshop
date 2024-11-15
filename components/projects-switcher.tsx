"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { RiAddCircleFill } from "react-icons/ri";

import { cn } from "@/lib/utils";
import { useGetProjects } from "@/features/projects/api/use-get-projects";
import ProjectAvatar from "@/features/projects/components/Project-Avatar";
import { useWorkspaceId } from "@/features/workspaces/hooks/use-workspace-id";
import { useCreateProjectModal } from "@/features/projects/hooks/use-create-project-modal";

const ProjectSwitcher = () => {
  const pathname = usePathname();
  const { open, close } = useCreateProjectModal();
  const workspaceId = useWorkspaceId();
  const { data } = useGetProjects({ workspaceId });

  return (
    <div className="flx flex-col gap-y-2">
      <div className="flex justify-between items-center mb-2">
        <p className="text-sm uppercase text-neutral-500">Projects</p>
        <RiAddCircleFill
          onClick={open}
          className="size-5 text-neutral-500 cursor-pointer hover:opacity-75 transition"
        />
      </div>
      {data?.total === 0 ? (
        <p className="text-sm text-neutral-600">No project found</p>
      ) : (
        data?.documents.map((project) => {
          const href = `/dashboard/workspaces/${workspaceId}/projects/${project.$id}`;
          const isActive = pathname === href;
          return (
            <Link href={href} key={project.$id}>
              <div
                className={cn(
                  "flex items-center gap-2.5 p-2.5 rounded-md hover:opacity-75 transition cursor-pointer text-neutral-500",
                  isActive &&
                    "bg-white shadow-sm hover:opacity-100 text-primary"
                )}
              >
                <ProjectAvatar name={project.name} image={project.imageUrl} />
                <span className="truncate">{project.name}</span>
              </div>
            </Link>
          );
        })
      )}
    </div>
  );
};

export default ProjectSwitcher;
