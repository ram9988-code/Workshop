import { FolderIcon, ListCheckIcon, UserIcon } from "lucide-react";

import { useGetMembers } from "@/features/members/api";
import { useGetProjects } from "@/features/projects/api";
import { useWorkspaceId } from "@/features/workspaces/hooks/use-workspace-id";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { TaskStatus } from "../types";
import { useTaskFilters } from "../hooks/use-task-filters";
import { DatePicker } from "@/components/date-picker";

interface DataFilterProps {
  hideProjectFilter?: boolean;
}
const DataFilters = ({ hideProjectFilter }: DataFilterProps) => {
  const workspaceId = useWorkspaceId();
  const { data: projects, isLoading: isLoadingProjects } = useGetProjects({
    workspaceId,
  });

  const { data: members, isLoading: isLoadingMembers } = useGetMembers({
    workspaceId,
  });

  const isLoading = isLoadingProjects || isLoadingMembers;

  const projectOptions = projects?.documents.map((project) => ({
    value: project.$id,
    label: project.name,
  }));

  const memberOptions = members?.documents.map((member) => ({
    value: member.$id,
    label: member.name,
  }));

  const [{ assigneeId, dueDate, projectId, search, status }, setFilters] =
    useTaskFilters();

  const onStatusChanged = (value: string) =>
    setFilters({ status: value === "all" ? null : (value as TaskStatus) });

  const onAssigneeChanged = (value: string) =>
    setFilters({ assigneeId: value === "all" ? null : (value as string) });

  const onProjectChanged = (value: string) =>
    setFilters({ projectId: value === "all" ? null : (value as string) });

  if (isLoading) return null;

  return (
    <div className="flex flex-row lg:flow-col gap-2">
      <Select
        defaultValue={status ?? undefined}
        onValueChange={(value) => onStatusChanged(value)}
      >
        <SelectTrigger className="w-full lg:w-auto h-8">
          <div className="flex items-center pr-2">
            <ListCheckIcon className="size-4 mr-2" />
            <SelectValue placeholder="All Statuses" />
          </div>
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Statuses</SelectItem>
          <SelectSeparator />
          <SelectItem value={TaskStatus.BACKLOG}>BackLog</SelectItem>
          <SelectItem value={TaskStatus.IN_PROGRESS}>In Progress</SelectItem>
          <SelectItem value={TaskStatus.IN_REVIEW}>In Review</SelectItem>
          <SelectItem value={TaskStatus.TODO}>Todo</SelectItem>
          <SelectItem value={TaskStatus.DONE}>Done</SelectItem>
        </SelectContent>
      </Select>
      <Select
        defaultValue={assigneeId ?? undefined}
        onValueChange={(value) => onAssigneeChanged(value)}
      >
        <SelectTrigger className="w-full lg:w-auto h-8">
          <div className="flex items-center pr-2">
            <UserIcon className="size-4 mr-2" />
            <SelectValue placeholder="All Assignees" />
          </div>
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Assignees</SelectItem>
          <SelectSeparator />
          {memberOptions?.map((member) => (
            <SelectItem key={member.value} value={member.value}>
              {member.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Select
        defaultValue={projectId ?? undefined}
        onValueChange={(value) => onProjectChanged(value)}
      >
        <SelectTrigger className="w-full lg:w-auto h-8">
          <div className="flex items-center pr-2">
            <FolderIcon className="size-4 mr-2" />
            <SelectValue placeholder="All Projects" />
          </div>
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Projects</SelectItem>
          <SelectSeparator />
          {projectOptions?.map((project) => (
            <SelectItem key={project.value} value={project.value}>
              {project.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <DatePicker
        placeholder="Due Date"
        className="h-8 w-full lg:w-auto"
        value={dueDate ? new Date(dueDate) : undefined}
        onChange={(date) =>
          setFilters({ dueDate: date ? date.toISOString() : null })
        }
      />
    </div>
  );
};

export default DataFilters;
