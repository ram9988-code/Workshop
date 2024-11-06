import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { ID, Query } from "node-appwrite";

import { sessionMiddleware } from "@/lib/session-middleware";

import { DATABASE_ID, IMAGES_ID, MEMBERS_ID, WORKSPACES_ID } from "@/config";
import { MemberRole } from "@/features/members/types";
import { generateInviteCode } from "@/lib/utils";

import { createWorkspceSchema } from "../schema";

const app = new Hono()
  .get("/", sessionMiddleware, async (c) => {
    const user = c.get("user");
    const databases = c.get("databases");

    const members = await databases.listDocuments(DATABASE_ID, MEMBERS_ID, [
      Query.equal("userId", user.$id),
    ]);

    if (members.total === 0) {
      return c.json({ data: { documents: [], total: 0 } });
    }

    const workspace_ID = members.documents.map((member) => member.workspaceId);

    const workspaces = await databases.listDocuments(
      DATABASE_ID,
      WORKSPACES_ID,
      [Query.orderDesc("$createdAt"), Query.contains("$id", workspace_ID)]
    );
    return c.json({ data: workspaces });
  })
  .post(
    "/",
    zValidator("form", createWorkspceSchema),
    sessionMiddleware,
    async (c) => {
      const databases = c.get("databases");
      const storage = c.get("storage");
      const user = c.get("user");

      const { name, image } = c.req.valid("form");

      let uploadImageUrl: string | undefined;

      if (image instanceof File) {
        const file = await storage.createFile(IMAGES_ID, ID.unique(), image);

        const arrayBuffer = await storage.getFilePreview(IMAGES_ID, file.$id);

        uploadImageUrl = `data:image/png;base64,${Buffer.from(
          arrayBuffer
        ).toString("base64")}`;
      }

      const workspace = await databases.createDocument(
        DATABASE_ID,
        WORKSPACES_ID,
        ID.unique(),
        {
          name,
          userId: user.$id,
          imageUrl: uploadImageUrl,
          inviteCode: generateInviteCode(7),
        }
      );

      await databases.createDocument(DATABASE_ID, MEMBERS_ID, ID.unique(), {
        userId: user.$id,
        workspaceId: workspace.$id,
        role: MemberRole.ADMIN,
      });

      return c.json({ data: workspace });
    }
  );

export default app;
