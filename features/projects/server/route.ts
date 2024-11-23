/**
 * Imports various modules and utilities needed for project management functionality.
 * @module ProjectManagement
 * @requires Hono
 * @requires ID
 * @requires Query
 * @requires z
 * @requires zValidator
 * @requires endOfMonth
 * @requires startOfMonth
 * @requires subMonths
 * @requires DATABASE_ID
 * @requires IMAGES_ID
 * @requires PROJECTS_ID
 * @requires TASKS_ID
 * @requires getMember
 * @requires sessionMiddleware
 * @requires createProjectSchema
 * @requires updateProjectSchema
 * @requires Project
 * @requires TaskStatus
 */
import { Hono } from "hono";
import { ID, Query } from "node-appwrite";
import { z } from "zod";
import { zValidator } from "@hono/zod-validator";
import { endOfMonth, startOfMonth, subMonths } from "date-fns";

import { DATABASE_ID, IMAGES_ID, PROJECTS_ID, TASKS_ID } from "@/config";
import { getMember } from "@/features/members/utils";
import { sessionMiddleware } from "@/lib/session-middleware";

import { createProjectSchema, updateProjectSchema } from "../schemas";
import { Project } from "../types";
import { TaskStatus } from "@/features/tasks/types";

/**
 * Creates a new instance of the Hono class.
 * @returns {Hono} A new instance of the Hono class.
 */
const app = new Hono()
  //Get Project by ID
  /**
   * Route handler for getting a project by projectId.
   * @param {Request} c - The request object containing user and databases information.
   * @returns {Response} JSON response with the project data or an error message if unauthorized.
   */
  .get("/:projectId", sessionMiddleware, async (c) => {
    const user = c.get("user");
    const databases = c.get("databases");

    const { projectId } = c.req.param();

    const project = await databases.getDocument<Project>(
      DATABASE_ID,
      PROJECTS_ID,
      projectId
    );

    const member = await getMember({
      databases,
      workspaceId: project.workspaceId,
      userId: user.$id,
    });

    if (!member) {
      return c.json({ error: "Unauthorized" }, 401);
    }
    return c.json({ data: project });
  })

  //Get all Projects
  /**
   * Route handler for GET request to the root endpoint.
   * Validates the query parameters using zod schema and checks for user authorization.
   * Retrieves projects associated with the specified workspace ID.
   * @param {Request} c - The request object containing user and database information.
   * @returns {Response} A JSON response with the list of projects for the workspace.
   */
  .get(
    "/",
    sessionMiddleware,
    zValidator("query", z.object({ workspaceId: z.string() })),
    async (c) => {
      const user = c.get("user");
      const databases = c.get("databases");

      const { workspaceId } = c.req.valid("query");

      if (!workspaceId) {
        return c.json({ error: "Workspace ID is required" }, 400);
      }

      const member = await getMember({
        databases,
        workspaceId,
        userId: user.$id,
      });

      if (!member) {
        return c.json({ error: "Unauthorized" }, 401);
      }

      const projects = await databases.listDocuments<Project>(
        DATABASE_ID,
        PROJECTS_ID,
        [Query.equal("workspaceId", workspaceId), Query.orderDesc("$createdAt")]
      );

      return c.json({ data: projects });
    }
  )

  //Create a new project
  /**
   * Handles the creation of a new project by processing the form data and storing it in the database.
   * @param {Object} c - The context object containing request and response information.
   * @returns None
   */
  .post(
    "/",
    sessionMiddleware,
    zValidator("form", createProjectSchema),
    async (c) => {
      const databases = c.get("databases");
      const storage = c.get("storage");
      const user = c.get("user");

      const { name, image, workspaceId } = c.req.valid("form");
      const member = await getMember({
        databases,
        workspaceId,
        userId: user.$id,
      });

      if (!member) {
        return c.json({ error: "Unauthorized to create the project" }, 401);
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
      }

      const project = await databases.createDocument(
        DATABASE_ID,
        PROJECTS_ID,
        ID.unique(),
        {
          name,
          userId: user.$id,
          imageUrl: uploadImageUrl,
          workspaceId,
          imageId: fileId,
        }
      );

      return c.json({ data: project });
    }
  )

  //Update project
  /**
   * Updates a project with the provided projectId, name, and image.
   * @param {string} projectId - The ID of the project to update.
   * @param {string} name - The new name for the project.
   * @param {File | string} image - The new image for the project, either a File object or a base64 string.
   * @returns {Object} - The updated project data.
   */
  .patch(
    "/:projectId",
    sessionMiddleware,
    zValidator("form", updateProjectSchema),
    async (c) => {
      const databases = c.get("databases");
      const storage = c.get("storage");
      const user = c.get("user");

      const { projectId } = c.req.param();
      const { name, image } = c.req.valid("form");

      const existingProject = await databases.getDocument<Project>(
        DATABASE_ID,
        PROJECTS_ID,
        projectId
      );

      const member = await getMember({
        databases,
        workspaceId: existingProject.workspaceId,
        userId: user.$id,
      });

      if (!member) {
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

      const project = await databases.updateDocument(
        DATABASE_ID,
        PROJECTS_ID,
        projectId,
        { name, imageUrl: uploadImageUrl, imageId: fileId }
      );
      return c.json({ data: project });
    }
  )

  //Delete project
  /**
   * Deletes a project by projectId after checking user authorization.
   * @param {Request} c - The request object containing databases, user, and storage.
   * @returns {Response} - JSON response indicating success or failure of the deletion.
   */
  .delete("/:projectId", sessionMiddleware, async (c) => {
    const databases = c.get("databases");
    const user = c.get("user");
    const storage = c.get("storage");

    const { projectId } = c.req.param();

    const existingProject = await databases.getDocument<Project>(
      DATABASE_ID,
      PROJECTS_ID,
      projectId
    );

    const member = await getMember({
      databases,
      workspaceId: existingProject.workspaceId,
      userId: user.$id,
    });

    if (!member) {
      return c.json({ error: "Unauthorized to delete the workspace" }, 401);
    }
    const project = await databases.getDocument<Project>(
      DATABASE_ID,
      PROJECTS_ID,
      projectId
    );

    //Fetching the tasks
    const tasks = await databases.listDocuments(DATABASE_ID, TASKS_ID, [
      Query.equal("projectId", projectId),
    ]);

    //Deleting the images for the project
    if (project.imageId) await storage.deleteFile(IMAGES_ID, project.imageId);

    //Delete the tasks associated with the project
    if (tasks.total > 0) {
      for (const task of tasks.documents) {
        await databases.deleteDocument(DATABASE_ID, TASKS_ID, task.$id);
      }
    }

    await databases.deleteDocument(DATABASE_ID, PROJECTS_ID, projectId);

    return c.json({
      data: { $id: projectId, workspaceId: existingProject.workspaceId },
    });
  })

  /**
   * Route handler for retrieving analytics data for a specific project.
   * @param {Request} c - The request object containing user and database information.
   * @returns None
   */
  .get("/:projectId/analytics", sessionMiddleware, async (c) => {
    const user = c.get("user");
    const databases = c.get("databases");

    const { projectId } = c.req.param();

    const project = await databases.getDocument<Project>(
      DATABASE_ID,
      PROJECTS_ID,
      projectId
    );

    const member = await getMember({
      databases,
      workspaceId: project.workspaceId,
      userId: user.$id,
    });

    if (!member) {
      return c.json({ error: "Unauthorized to view analytics" }, 401);
    }

    const now = new Date();
    const thisMonthStart = startOfMonth(now);
    const thisMonthEnd = endOfMonth(now);
    const lastMonthStart = startOfMonth(subMonths(now, 1));
    const lastMonthEnd = endOfMonth(subMonths(now, 1));

    const thisMonthTask = await databases.listDocuments(DATABASE_ID, TASKS_ID, [
      Query.equal("projectId", projectId),
      Query.greaterThanEqual("$createdAt", thisMonthStart.toISOString()),
      Query.lessThanEqual("$createdAt", thisMonthEnd.toISOString()),
    ]);

    const lastMonthTask = await databases.listDocuments(DATABASE_ID, TASKS_ID, [
      Query.equal("projectId", projectId),
      Query.greaterThanEqual("$createdAt", lastMonthStart.toISOString()),
      Query.lessThanEqual("$createdAt", lastMonthEnd.toISOString()),
    ]);

    const taskCount = thisMonthTask.total;
    const taskDiff = taskCount - lastMonthTask.total;

    const thisMonthAssignedTasks = await databases.listDocuments(
      DATABASE_ID,
      TASKS_ID,
      [
        Query.equal("projectId", projectId),
        Query.equal("assigneeId", member.$id),
        Query.greaterThanEqual("$createdAt", thisMonthStart.toISOString()),
        Query.lessThanEqual("$createdAt", thisMonthEnd.toISOString()),
      ]
    );

    const lastMonthAssignedTasks = await databases.listDocuments(
      DATABASE_ID,
      TASKS_ID,
      [
        Query.equal("projectId", projectId),
        Query.equal("assigneeId", member.$id),
        Query.greaterThanEqual("$createdAt", lastMonthStart.toISOString()),
        Query.lessThanEqual("$createdAt", lastMonthEnd.toISOString()),
      ]
    );

    const assigneeTaskCount = thisMonthAssignedTasks.total;
    const assigneeTaskDiff = assigneeTaskCount - lastMonthAssignedTasks.total;

    const thisMonthCompletedTasks = await databases.listDocuments(
      DATABASE_ID,
      TASKS_ID,
      [
        Query.equal("projectId", projectId),
        Query.equal("status", TaskStatus.DONE),
        Query.greaterThanEqual("$createdAt", thisMonthStart.toISOString()),
        Query.lessThanEqual("$createdAt", thisMonthEnd.toISOString()),
      ]
    );

    const lastMonthCompletedTasks = await databases.listDocuments(
      DATABASE_ID,
      TASKS_ID,
      [
        Query.equal("projectId", projectId),
        Query.equal("status", TaskStatus.DONE),
        Query.greaterThanEqual("$createdAt", lastMonthStart.toISOString()),
        Query.lessThanEqual("$createdAt", lastMonthEnd.toISOString()),
      ]
    );

    const CompleteTasksCount = thisMonthCompletedTasks.total;
    const CompleteTasksDiff =
      CompleteTasksCount - lastMonthCompletedTasks.total;

    const thisMonthInCompletedTasks = await databases.listDocuments(
      DATABASE_ID,
      TASKS_ID,
      [
        Query.equal("projectId", projectId),
        Query.notEqual("status", TaskStatus.DONE),
        Query.greaterThanEqual("$createdAt", thisMonthStart.toISOString()),
        Query.lessThanEqual("$createdAt", thisMonthEnd.toISOString()),
      ]
    );

    const lastMonthInCompletedTasks = await databases.listDocuments(
      DATABASE_ID,
      TASKS_ID,
      [
        Query.equal("projectId", projectId),
        Query.notEqual("status", TaskStatus.DONE),
        Query.greaterThanEqual("$createdAt", lastMonthStart.toISOString()),
        Query.lessThanEqual("$createdAt", lastMonthEnd.toISOString()),
      ]
    );

    const inCompletedTaskCount = thisMonthInCompletedTasks.total;
    const inCompletedTasksDiff =
      inCompletedTaskCount - lastMonthInCompletedTasks.total;

    const thisMonthOverDueTasks = await databases.listDocuments(
      DATABASE_ID,
      TASKS_ID,
      [
        Query.equal("projectId", projectId),
        Query.notEqual("status", TaskStatus.DONE),
        Query.lessThan("dueDate", now.toISOString()),
        Query.greaterThanEqual("$createdAt", thisMonthStart.toISOString()),
        Query.lessThanEqual("$createdAt", thisMonthEnd.toISOString()),
      ]
    );

    const lastMonthOverDueTasks = await databases.listDocuments(
      DATABASE_ID,
      TASKS_ID,
      [
        Query.equal("projectId", projectId),
        Query.notEqual("status", TaskStatus.DONE),
        Query.lessThan("dueDate", now.toISOString()),
        Query.greaterThanEqual("$createdAt", lastMonthStart.toISOString()),
        Query.lessThanEqual("$createdAt", lastMonthEnd.toISOString()),
      ]
    );

    const overDueTaskCount = thisMonthOverDueTasks.total;
    const overDueTasksDiff = overDueTaskCount - lastMonthOverDueTasks.total;

    return c.json({
      data: {
        taskCount,
        taskDiff,
        assigneeTaskCount,
        assigneeTaskDiff,
        CompleteTasksCount,
        CompleteTasksDiff,
        inCompletedTaskCount,
        inCompletedTasksDiff,
        overDueTaskCount,
        overDueTasksDiff,
      },
    });
  });

export default app;
