import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { InferRequestType, InferResponseType } from "hono";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { client } from "@/lib/rpc";

type ResponseType = InferResponseType<(typeof client.api.auth.logout)["$post"]>;

type RequestType = InferRequestType<(typeof client.api.auth.logout)["$post"]>;

export const useLogout = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async () => {
      const response = await client.api.auth.logout["$post"]();

      if (!response.ok) {
        throw new Error("Failed to logout");
      }

      return await response.json();
    },
    onSuccess: () => {
      toast.success("Logout Successfully");
      router.refresh();
      //window.location.reload();
      queryClient.invalidateQueries({ queryKey: ["current"] });
      queryClient.invalidateQueries({ queryKey: ["workspaces"] });
    },
    onError: (error) => {
      toast.error("Failed to Logout");
      //console.error(error);
    },
  });
  return mutation;
};
