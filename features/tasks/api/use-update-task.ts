import { toast } from "sonner";
import { InferRequestType, InferResponseType } from "hono";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { client } from "@/lib/rpc";

type ResponseType = InferResponseType<
  (typeof client.api.tasks)[":taskId"]["$patch"],
  200
>;

type RequestType = InferRequestType<
  (typeof client.api.tasks)[":taskId"]["$patch"]
>;

export const useUpdateTask = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ json, param }) => {
      const response = await client.api.tasks[":taskId"]["$patch"]({
        json,
        param,
      });

      if (!response.ok) {
        const { error } = (await response.json()) as { error: string };
        throw new Error(error);
      }

      return await response.json();
    },
    onSuccess: ({ data }) => {
      toast.success("Task is updated successfully");
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      queryClient.invalidateQueries({ queryKey: ["task", data.$id] });
    },
    onError: () => {
      toast.error("Failed to update task");
    },
    // Additional options like retry, delay, etc. can be added here.
  });
  return mutation;
};
