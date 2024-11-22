"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { useJoinWorkspace } from "../api";
import { useWorkspaceId } from "../hooks/use-workspace-id";
import { useInviteCode } from "../hooks/use-invite-code";

interface JoinWorkspaceFormProps {
  initialValue: { $id: string; name: string; imageUrl: string };
}
const JoinWorkspaceForm = ({ initialValue }: JoinWorkspaceFormProps) => {
  const router = useRouter();
  const workspaceId = useWorkspaceId();
  const inviteCode = useInviteCode();
  const { mutate, isPending } = useJoinWorkspace();

  const onSubmit = () => {
    mutate(
      {
        param: { workspaceId },
        json: { code: inviteCode },
      },
      {
        onSuccess: ({ data }) => {
          router.push(`/dashboard/workspaces/${data.$id}`);
        },
      }
    );
  };
  return (
    <Card className="w-full h-full border-none shadow-none">
      <CardHeader className="p-7">
        <CardTitle className="text-xl font-bold">Join workspace</CardTitle>
        <CardDescription>
          You&lsquo;ve been invited to join <strong>{initialValue.name}</strong>{" "}
          workspace
        </CardDescription>
      </CardHeader>
      <CardContent className="p-7">
        <div className="flex flex-col gap-2 lg:flex-row items-center justify-between">
          <Button
            variant={"secondary"}
            type="button"
            asChild
            size={"lg"}
            className="w-full lg:w-fit"
            disabled={isPending}
          >
            <Link href={"/dashboard"}>Cancel</Link>
          </Button>
          <Button
            size={"lg"}
            type="button"
            className="w-full lg:w-fit"
            variant="default"
            onClick={onSubmit}
            disabled={isPending}
          >
            Join Workspace
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default JoinWorkspaceForm;
