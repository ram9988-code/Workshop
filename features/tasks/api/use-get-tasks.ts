import { useQuery } from "@tanstack/react-query";

import { client } from "@/lib/rpc";

interface UseGetTasksProps {
  workspaceId: string;
}

export const useGetTasks = ({ workspaceId }: UseGetTasksProps) => {
  const query = useQuery({
    queryKey: ["tasks", workspaceId],
    queryFn: async () => {
      const response = await client.api.tasks.$get({ query: { workspaceId } });

      if (!response.ok) {
        throw new Error("Failed to get workspace");
      }
      const { data } = await response.json();
      console.log(data);

      return data;
    },
    refetchInterval: 60 * 1000, // Refresh every minute
  });
  return query;
};
