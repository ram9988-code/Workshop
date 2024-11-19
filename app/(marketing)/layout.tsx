import React from "react";
import { Navbar } from "./_components/navbar";
import { Footer } from "./_components/footer";
import { NuqsAdapter } from "nuqs/adapters/next/app";

const MarketingLayout = async ({ children }: { children: React.ReactNode }) => {
  return (
    <NuqsAdapter>
      <div className="h-full bg-slate-100">
        <Navbar />
        <main className="pt-40 pb-20">{children}</main>
        <Footer />
      </div>
    </NuqsAdapter>
  );
};

export default MarketingLayout;
