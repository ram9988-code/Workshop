import { useQuery } from "@tanstack/react-query";

import { client } from "@/lib/rpc";

interface useGetWorkspaceProps {
  workspaceId: string;
}

export const useGetWorkspaceInfo = ({ workspaceId }: useGetWorkspaceProps) => {
  const query = useQuery({
    queryKey: ["workspace", workspaceId],
    queryFn: async () => {
      const response = await client.api.workspaces[":workspaceId"]["info"].$get(
        {
          param: { workspaceId },
        }
      );
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