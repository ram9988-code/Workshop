/**
 * Imports the useQuery hook from the "@tanstack/react-query" library
 * and the client object from the "@/lib/rpc" module.
 */
import { useQuery } from "@tanstack/react-query";

import { client } from "@/lib/rpc";

/**
 * Interface representing the properties required for the useGetProject hook.
 * @interface useGetProjectProps
 * @property {string} projectId - The ID of the project to fetch.
 */
interface useGetProjectProps {
  projectId: string;
}

/**
 * Custom hook to fetch project data based on the provided projectId.
 * @param {useGetProjectProps} projectId - The ID of the project to fetch.
 * @returns The query result containing the project data.
 */
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
