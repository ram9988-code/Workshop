import { z } from "zod";

export const createWorkspceSchema = z.object({
  name: z.string().trim().min(1, "Required"),
});
