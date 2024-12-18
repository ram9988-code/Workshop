"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { RiAddCircleFill } from "react-icons/ri";

import { useWorkspaceId } from "@/features/workspaces/hooks/use-workspace-id";
import WorkspaceAvatar from "@/features/workspaces/components/workspace-avatar";
import { useGetWorkspaces } from "@/features/workspaces/api/use-get-workspaces";
import { useCreateWorkspaceModal } from "@/features/workspaces/hooks/use-create-workspace-modal";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

const WorkspaceSwitcher = () => {
  const { open } = useCreateWorkspaceModal();
  const workspaceId = useWorkspaceId();
  const router = useRouter();
  const { data } = useGetWorkspaces();

  const onSelect = (id: string) => {
    router.push(`/dashboard/workspaces/${id}`);
  };

  return (
    <div className="flx flex-col gap-y-2">
      <div className="flex justify-between items-center mb-2">
        <p className="text-sm uppercase text-neutral-500">Workspaces</p>
        <RiAddCircleFill
          onClick={open}
          className="size-5 text-neutral-500 cursor-pointer hover:opacity-75 transition"
        />
      </div>
      <Select onValueChange={onSelect} value={workspaceId}>
        <SelectTrigger className="w-full bg-neutral-200 p-2 font-medium">
          <SelectValue placeholder="No workspace selected" />
        </SelectTrigger>
        <SelectContent>
          {data?.total === 0 ? (
            <p className="text-sm text-neutral-600">No workspace found</p>
          ) : (
            data?.documents.map((workspace) => (
              <SelectItem key={workspace.$id} value={workspace.$id}>
                <div className="flex justify-start items-center gap-3 font-medium">
                  <WorkspaceAvatar
                    name={workspace.name}
                    image={workspace.imageUrl}
                  />
                  <span className="truncate">{workspace.name}</span>
                </div>
              </SelectItem>
            ))
          )}
        </SelectContent>
      </Select>
    </div>
  );
};

export default WorkspaceSwitcher;
