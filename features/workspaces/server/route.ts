/**
 * Imports various modules and functions needed for workspace management.
 * @module WorkspaceManagement
 * @requires z
 * @requires Hono
 * @requires ID
 * @requires Query
 * @requires zValidator
 * @requires sessionMiddleware
 * @requires DATABASE_ID
 * @requires IMAGES_ID
 * @requires MEMBERS_ID
 * @requires PROJECTS_ID
 * @requires TASKS_ID
 * @requires WORKSPACES_ID
 * @requires MemberRole
 * @requires getMember
 * @requires generateInviteCode
 * @requires createWorkspceSchema
 * @requires updateWorkspceSchema
 * @requires Workspace
 */
import { z } from "zod";
import { Hono } from "hono";
import { ID, Query } from "node-appwrite";
import { zValidator } from "@hono/zod-validator";

import { sessionMiddleware } from "@/lib/session-middleware";

import {
  DATABASE_ID,
  IMAGES_ID,
  MEMBERS_ID,
  PROJECTS_ID,
  TASKS_ID,
  WORKSPACES_ID,
} from "@/config";
import { MemberRole } from "@/features/members/types";
import { getMember } from "@/features/members/utils";
import { generateInviteCode } from "@/lib/utils";

import { createWorkspceSchema, updateWorkspceSchema } from "../schema";
import { Workspace } from "../types";

const app = new Hono()
  //Get all Workspaces
  /**
   * Route handler for GET requests to the root path.
   * Retrieves user and databases information from the context.
   * Queries the database for members with a specific userId.
   * If no members are found, returns an empty array.
   * Retrieves workspace IDs from the members' documents.
   * Queries the database for workspaces based on the retrieved workspace IDs.
   * Returns a JSON response with the list of workspaces.
   * @param {RequestContext} c - The request context object.
   * @returns None
   */
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

  //Get workspace information
  /**
   * Route handler for getting information about a workspace with a specific ID.
   * @param {string} workspaceId - The ID of the workspace to retrieve information for.
   * @param {Function} sessionMiddleware - Middleware function for handling session data.
   * @param {Object} c - The context object containing request and response information.
   * @returns {Object} JSON response containing workspace information.
   */
  .get("/:workspaceId/info", sessionMiddleware, async (c) => {
    const databases = c.get("databases");
    const { workspaceId } = c.req.param();

    const workspace = await databases.getDocument<Workspace>(
      DATABASE_ID,
      WORKSPACES_ID,
      workspaceId
    );

    return c.json({
      data: {
        $id: workspace.$id,
        name: workspace.name,
        imageUrl: workspace.imageUrl,
      },
    });
  })

  //Get a single Workspace
  /**
   * Retrieves the workspace information for a given workspace ID.
   * @param {string} workspaceId - The ID of the workspace to retrieve information for.
   * @param {Function} sessionMiddleware - Middleware function for session management.
   * @returns {Object} The workspace data or an error message if unauthorized.
   */
  .get("/:workspaceId", sessionMiddleware, async (c) => {
    const databases = c.get("databases");
    const user = c.get("user");
    const { workspaceId } = c.req.param();

    const member = await getMember({
      databases,
      workspaceId,
      userId: user.$id,
    });

    if (!member) {
      return c.json({ error: "Unauthorized to view the workspace" }, 401);
    }

    const workspace = await databases.getDocument<Workspace>(
      DATABASE_ID,
      WORKSPACES_ID,
      workspaceId
    );
    return c.json({ data: workspace });
  })
  //Create a new workspace
  /**
   * Handles the POST request to create a new workspace with the provided data.
   * @param {Object} c - The context object containing request and response data.
   * @returns None
   */
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
      //console.log(image);
      let fileId: string | undefined;

      if (image instanceof File) {
        const file = await storage.createFile(IMAGES_ID, ID.unique(), image);
        fileId = file.$id;

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
          imageId: fileId,
        }
      );

      await databases.createDocument(DATABASE_ID, MEMBERS_ID, ID.unique(), {
        userId: user.$id,
        workspaceId: workspace.$id,
        role: MemberRole.ADMIN,
      });

      return c.json({ data: workspace });
    }
  )

  //Update the workspace
  /**
   * Updates a workspace with the provided workspaceId, name, and image.
   * @param {string} workspaceId - The ID of the workspace to update.
   * @param {string} name - The new name for the workspace.
   * @param {string | File} image - The new image for the workspace, either as a URL or a File object.
   * @returns {Object} The updated workspace object.
   */
  .patch(
    "/:workspaceId",
    sessionMiddleware,
    zValidator("form", updateWorkspceSchema),
    async (c) => {
      const databases = c.get("databases");
      const storage = c.get("storage");
      const user = c.get("user");

      const { workspaceId } = c.req.param();
      const { name, image } = c.req.valid("form");

      const member = await getMember({
        databases,
        workspaceId,
        userId: user.$id,
      });

      if (!member || member.role !== MemberRole.ADMIN) {
        return c.json({ error: "Unauthorized to update the workspace" }, 401);
      }

      let uploadImageUrl: string | undefined;
      let fileId: string | undefined;

      if (image instanceof File) {
        const file = await storage.createFile(IMAGES_ID, ID.unique(), image);
        fileId = file.$id;

        const arrayBuffer = await storage.getFilePreview(IMAGES_ID, file.$id);

        uploadImageUrl = `data:image/png;base64,${Buffer.from(
          arrayBuffer
        ).toString("base64")}`;
      } else {
        uploadImageUrl = image;
      }

      const workspace = await databases.updateDocument(
        DATABASE_ID,
        WORKSPACES_ID,
        workspaceId,
        { name, imageUrl: uploadImageUrl, imageId: fileId }
      );
      return c.json({ data: workspace });
    }
  )

  //Delete the workspace
  /**
   * Deletes a workspace with the specified workspaceId if the user is an admin of the workspace.
   * @param {string} workspaceId - The ID of the workspace to delete.
   * @param {Function} sessionMiddleware - Middleware function to check user session.
   * @param {Object} c - Context object containing databases, user, and storage information.
   * @returns {Object} JSON response indicating success or failure of the deletion operation.
   */
  .delete("/:workspaceId", sessionMiddleware, async (c) => {
    const databases = c.get("databases");
    const user = c.get("user");
    const storage = c.get("storage");

    const { workspaceId } = c.req.param();

    const member = await getMember({
      databases,
      workspaceId,
      userId: user.$id,
    });

    if (!member || member.role !== MemberRole.ADMIN) {
      return c.json({ error: "Unauthorized to delete the workspace" }, 401);
    }

    const workspace = await databases.getDocument(
      DATABASE_ID,
      WORKSPACES_ID,
      workspaceId
    );

    if (workspace.imageId)
      await storage.deleteFile(IMAGES_ID, workspace.imageId);

    const projects = await databases.listDocuments(DATABASE_ID, PROJECTS_ID, [
      Query.equal("workspaceId", workspace.$id),
    ]);

    const tasks = await databases.listDocuments(DATABASE_ID, TASKS_ID, [
      Query.equal("workspaceId", workspace.$id),
    ]);

    await databases.deleteDocument(DATABASE_ID, WORKSPACES_ID, workspaceId);
    if (projects.total !== 0) {
      for (const project of projects.documents) {
        await databases.deleteDocument(DATABASE_ID, PROJECTS_ID, project.$id);
      }
    }

    if (tasks.total !== 0) {
      for (const task of tasks.documents) {
        await databases.deleteDocument(DATABASE_ID, TASKS_ID, task.$id);
      }
    }
    return c.json({ data: { $id: workspaceId } });
  })

  //Reset invite Code for workspace
  /**
   * Reset the invite code for a workspace with the given workspaceId.
   * @param {string} workspaceId - The ID of the workspace to reset the invite code for.
   * @returns {Object} JSON response with the updated workspace data.
   */
  .post("/:workspaceId/reset-invite-code", sessionMiddleware, async (c) => {
    const databases = c.get("databases");
    const user = c.get("user");

    const { workspaceId } = c.req.param();

    const member = await getMember({
      databases,
      workspaceId,
      userId: user.$id,
    });

    if (!member || member.role !== MemberRole.ADMIN) {
      return c.json({ error: "Unauthorized to reset the workspace" }, 401);
    }

    const workspace = await databases.updateDocument(
      DATABASE_ID,
      WORKSPACES_ID,
      workspaceId,
      {
        inviteCode: generateInviteCode(7),
      }
    );

    return c.json({ data: workspace });
  })

  //Join the workspace using invite code
  /**
   * Handles the POST request to join a workspace with a given invite code.
   * @param {string} workspaceId - The ID of the workspace to join.
   * @param {string} code - The invite code to use for joining the workspace.
   * @returns {Object} JSON response indicating success or error.
   */
  .post(
    "/:workspaceId/join",
    sessionMiddleware,
    zValidator("json", z.object({ code: z.string() })),
    async (c) => {
      const { workspaceId } = c.req.param();
      const { code } = c.req.valid("json");

      const databases = c.get("databases");
      const user = c.get("user");

      const member = await getMember({
        databases,
        workspaceId,
        userId: user.$id,
      });

      if (member) {
        return c.json({ error: "Already member" }, 400);
      }

      const workspace = await databases.getDocument<Workspace>(
        DATABASE_ID,
        WORKSPACES_ID,
        workspaceId
      );

      if (workspace.inviteCode !== code) {
        return c.json({ error: "Invalid invite code" }, 400);
      }

      await databases.createDocument(DATABASE_ID, MEMBERS_ID, ID.unique(), {
        userId: user.$id,
        workspaceId,
        role: MemberRole.MEMBER,
      });

      return c.json({ data: workspace });
    }
  );

export default app;
