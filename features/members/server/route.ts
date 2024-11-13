import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { z } from "zod";

import { sessionMiddleware } from "@/lib/session-middleware";
import { createAdminClient } from "@/lib/appwrite";

import { getMember } from "../utils";
import { DATABASE_ID, MEMBERS_ID } from "@/config";
import { Models, Query } from "node-appwrite";
import { MemberRole } from "../types";

const app = new Hono()
  .get(
    "/",
    sessionMiddleware,
    zValidator("query", z.object({ workspaceId: z.string() })),
    async (c) => {
      const { users } = await createAdminClient();

      const databases = c.get("databases");
      const user = c.get("user");
      const { workspaceId } = c.req.valid("query");

      const member = await getMember({
        databases,
        workspaceId,
        userId: user.$id,
      });

      if (!member) {
        return c.json({ error: "Unauthorized" }, 401);
      }

      const members = await databases.listDocuments(DATABASE_ID, MEMBERS_ID, [
        Query.equal("workspaceId", workspaceId),
      ]);

      const populatedMembers: Models.Document[] = await Promise.all(
        members.documents.map(async (member) => {
          const user = await users.get(member.userId);
          return { ...member, name: user.name, email: user.email };
        })
      );

      return c.json({ data: { ...members, documents: populatedMembers } });
    }
  )
  .delete("/:memberId", sessionMiddleware, async (c) => {
    const databases = c.get("databases");
    const user = c.get("user");
    const { memberId } = c.req.param();

    const memberToDelete = await databases.getDocument(
      DATABASE_ID,
      MEMBERS_ID,
      memberId
    );

    const allMembers = await databases.listDocuments(DATABASE_ID, MEMBERS_ID, [
      Query.equal("workspaceId", memberToDelete.workspaceId),
    ]);

    const member = await getMember({
      databases,
      workspaceId: memberToDelete.workspaceId,
      userId: user.$id,
    });

    if (!member) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    if (
      member.$id !== memberToDelete.$databaseId &&
      member.role !== MemberRole.ADMIN
    ) {
      return c.json({ error: "Not Authorized to delete" }, 401);
    }

    if (allMembers.total === 1) {
      return c.json({ error: "Cannot delete last member" }, 401);
    }

    await databases.deleteDocument(DATABASE_ID, MEMBERS_ID, memberId);

    return c.json({ data: { $id: memberToDelete.$id } });
  })
  .patch(
    "/:memberId",
    sessionMiddleware,
    zValidator("json", z.object({ role: z.nativeEnum(MemberRole) })),
    async (c) => {
      const databases = c.get("databases");
      const user = c.get("user");
      const { memberId } = c.req.param();
      const { role } = c.req.valid("json");

      const memberToUpdate = await databases.getDocument(
        DATABASE_ID,
        MEMBERS_ID,
        memberId
      );

      const allMembers = await databases.listDocuments(
        DATABASE_ID,
        MEMBERS_ID,
        [Query.equal("workspaceId", memberToUpdate.workspaceId)]
      );

      const member = await getMember({
        databases,
        workspaceId: memberToUpdate.workspaceId,
        userId: user.$id,
      });

      if (!member) {
        return c.json({ error: "Unauthorized" }, 401);
      }

      if (member.role !== MemberRole.ADMIN) {
        return c.json({ error: "Not Authorized" }, 401);
      }

      if (allMembers.total === 1) {
        return c.json({ error: "Cannot downgrade last member" }, 401);
      }

      await databases.updateDocument(DATABASE_ID, MEMBERS_ID, memberId, {
        role,
      });

      return c.json({ data: { $id: memberToUpdate.$id } });
    }
  );

export default app;