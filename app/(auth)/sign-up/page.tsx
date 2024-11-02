import { getCurrent } from "@/features/auth/action";
import SignUpCard from "@/features/auth/components/sign-up-card";
import { redirect } from "next/navigation";
import React from "react";

const SignUpPage = async () => {
  const user = await getCurrent();

  if (user) redirect("/");
  return (
    <div className="w-full h-full flex justify-center items-center">
      <SignUpCard />
    </div>
  );
};

export default SignUpPage;
