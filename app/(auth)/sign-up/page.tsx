import React from "react";
import { redirect } from "next/navigation";

import { getCurrent } from "@/features/auth/queries";
import SignUpCard from "@/features/auth/components/sign-up-card";

const SignUpPage = async () => {
  const user = await getCurrent();

  if (user) redirect("/dashboard");
  return (
    <div className="w-full h-full flex justify-center items-center">
      <SignUpCard />
    </div>
  );
};

export default SignUpPage;
