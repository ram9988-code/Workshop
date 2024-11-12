import { getCurrent } from "@/features/auth/queries";
import MembersList from "@/features/workspaces/components/members-list";
import { redirect } from "next/navigation";
import React from "react";

const MembersPage = async () => {
  const user = await getCurrent();
  if (!user) return redirect("/sign-in");

  return (
    <div className="w-full lg:max-w-4xl">
      <MembersList />
    </div>
  );
};

export default MembersPage;
