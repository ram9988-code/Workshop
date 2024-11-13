import { createSessionClient } from "@/lib/appwrite";
import { getMember } from "../members/utils";
import { Project } from "./types";
import { DATABASE_ID, PROJECTS_ID } from "@/config";

interface GetWorkspaceId {
  projectId: string;
}

export const getProject = async ({ projectId }: GetWorkspaceId) => {
  try {
    const { account, databases } = await createSessionClient();
    const user = await account.get();

    const project = await databases.getDocument<Project>(
      DATABASE_ID,
      PROJECTS_ID,
      projectId
    );

    const member = await getMember({
      databases,
      userId: user.$id,
      workspaceId: project.workspaceId,
    });

    if (!member) return null;

    return project;
  } catch (err: any) {
    console.log(`Failed to excute credentials ${err.message}`);
    return null;
  }
};
