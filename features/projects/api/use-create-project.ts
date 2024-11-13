import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";

import { client } from "@/lib/rpc";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

type ResponseType = InferResponseType<
  (typeof client.api.projects)["$post"],
  200
>;

type RequestType = InferRequestType<(typeof client.api.projects)["$post"]>;

export const useCreateProject = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ form }) => {
      const response = await client.api.projects["$post"]({ form });

      if (!response.ok) {
        const { error } = (await response.json()) as { error: string };
        throw new Error(error);
      }

      return await response.json();
    },
    onSuccess: () => {
      router.refresh();
      toast.success("Project created");
      queryClient.invalidateQueries({ queryKey: ["projects"] });
    },
    onError: ({ message }) => {
      if (message) {
        toast.error(message);
      } else {
        toast.error("Failed to create project");
      }
    },
  });
  return mutation;
};