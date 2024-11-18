import { useQuery } from "@tanstack/react-query";

import { client } from "@/lib/rpc";
import { TaskStatus } from "../types";

interface UseGetTasksProps {
  workspaceId: string;
  projectId?: string | null;
  status?: TaskStatus | null;
  assigneeId?: string | null;
  dueDate?: string | null;
  search?: string | null;
}

export const useGetTasks = ({
  workspaceId,
  assigneeId,
  dueDate,
  projectId,
  search,
  status,
}: UseGetTasksProps) => {
  const query = useQuery({
    queryKey: [
      "tasks",
      workspaceId,
      assigneeId,
      dueDate,
      projectId,
      search,
      status,
    ],
    queryFn: async () => {
      const response = await client.api.tasks.$get({
        query: {
          workspaceId,
          projectId: projectId ?? undefined,
          assigneeId: assigneeId ?? undefined,
          dueDate: dueDate ?? undefined,
          search: search ?? undefined,
          status: status ?? undefined,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to get workspace");
      }
      const { data } = await response.json();

      return data;
    },
    refetchInterval: 60 * 1000, // Refresh every minute
  });
  return query;
};
