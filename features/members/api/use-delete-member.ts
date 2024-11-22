import { toast } from "sonner";
import { InferRequestType, InferResponseType } from "hono";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { client } from "@/lib/rpc";

type ResponseType = InferResponseType<
  (typeof client.api.members)[":memberId"]["$delete"],
  200
>;

type RequestType = InferRequestType<
  (typeof client.api.members)[":memberId"]["$delete"]
>;

export const useDeleteMember = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ param }) => {
      const response = await client.api.members[":memberId"]["$delete"]({
        param,
      });

      if (!response.ok) {
        const { error } = (await response.json()) as { error: string };
        throw new Error(error);
      }

      return await response.json();
    },
    onSuccess: () => {
      toast.success("Member deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["members"] });
    },
    onError: ({ message }) => {
      if (message) {
        toast.error(message);
      } else {
        toast.error("Failed to delete member");
      }
    },
    // Additional options like retry, delay, etc. can be added here.
  });
  return mutation;
};
