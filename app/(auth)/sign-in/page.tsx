import React from "react";
import { redirect } from "next/navigation";

import { getCurrent } from "@/features/auth/queries";
import SignInCard from "@/features/auth/components/sign-in-card";

const SignInPage = async () => {
  const user = await getCurrent();

  if (user) redirect("/dashboard");

  return (
    <div className="flex w-full h-full justify-center items-center">
      <SignInCard />
    </div>
  );
};

export default SignInPage;
