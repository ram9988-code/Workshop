"use server";

import { Query } from "node-appwrite";

import { createSessionClient } from "@/lib/appwrite";
import { DATABASE_ID, MEMBERS_ID, WORKSPACES_ID } from "@/config";

export const getWorkspaces = async () => {
  try {
    const { account, databases } = await createSessionClient();

    const user = await account.get();

    const members = await databases.listDocuments(DATABASE_ID, MEMBERS_ID, [
      Query.equal("userId", user.$id),
    ]);

    if (members.total === 0) {
      return { documents: [], total: 0 };
    }

    const workspace_ID = members.documents.map((member) => member.workspaceId);

    const workspaces = await databases.listDocuments(
      DATABASE_ID,
      WORKSPACES_ID,
      [Query.orderDesc("$createdAt"), Query.contains("$id", workspace_ID)]
    );
    return workspaces;
  } catch (err: any) {
    console.log(`Failed to excute credentials ${err.message}`);
    return null;
  }
};
