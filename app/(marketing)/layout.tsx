import React from "react";
import { Navbar } from "./_components/navbar";
import { Footer } from "./_components/footer";
import { getCurrent } from "@/features/auth/action";
import { redirect } from "next/navigation";

const MarketingLayout = async ({ children }: { children: React.ReactNode }) => {
  const user = await getCurrent();
  if (!user) redirect("/sign-in");

  return (
    <div className="h-full bg-slate-100">
      <Navbar user={user} />
      <main className="pt-40 pb-20 bg-slate-100">{children}</main>
      <Footer />
    </div>
  );
};

export default MarketingLayout;
