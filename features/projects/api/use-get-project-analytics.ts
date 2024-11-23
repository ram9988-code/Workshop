/**
 * Imports the useQuery hook from the "@tanstack/react-query" library
 * and the client object from the "@/lib/rpc" module.
 */
import { useQuery } from "@tanstack/react-query";

/**
 * Represents the properties required for using the getProjectAnalytics function.
 * @interface useGetProjectAnalyticsProps
 * @property {string} projectId - The ID of the project for which analytics are to be retrieved.
 */
import { client } from "@/lib/rpc";
import { InferResponseType } from "hono";

interface useGetProjectAnalyticsProps {
  projectId: string;
}

/**
 * Defines the response type for project analytics API endpoint.
 * @type {ProjectAnalyticsResponseType}
 */
export type ProjectAnalyticsResponseType = InferResponseType<
  (typeof client.api.projects)[":projectId"]["analytics"]["$get"],
  200
>;

/**
 * Custom hook to fetch project analytics data for a specific project ID.
 * @param {useGetProjectAnalyticsProps} projectId - The ID of the project to fetch analytics for.
 * @returns The query object containing the analytics data.
 */
export const useGetProjectAnalytics = ({
  projectId,
}: useGetProjectAnalyticsProps) => {
  const query = useQuery({
    queryKey: ["analytics", projectId],
    queryFn: async () => {
      const response = await client.api.projects[":projectId"][
        "analytics"
      ].$get({
        param: { projectId },
      });
      if (!response.ok) {
        throw new Error("Failed to get projects analytics");
      }
      const { data } = await response.json();

      return data;
    },
    refetchInterval: 60 * 1000, // Refresh every minute
  });
  return query;
};
