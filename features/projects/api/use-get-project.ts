import { useQuery } from "@tanstack/react-query";

import { client } from "@/lib/rpc";

interface useGetProjectProps {
  projectId: string;
}

export const useGetProject = ({ projectId }: useGetProjectProps) => {
  const query = useQuery({
    queryKey: ["project", projectId],
    queryFn: async () => {
      const response = await client.api.projects[":projectId"].$get({
        param: { projectId },
      });
      if (!response.ok) {
        throw new Error("Failed to get projects");
      }
      const { data } = await response.json();

      return data;
    },
    refetchInterval: 60 * 1000, // Refresh every minute
  });
  return query;
};
