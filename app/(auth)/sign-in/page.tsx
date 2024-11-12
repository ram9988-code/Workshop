import { getCurrent } from "@/features/auth/queries";
import SignInCard from "@/features/auth/components/sign-in-card";
import { redirect } from "next/navigation";
import React from "react";

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
