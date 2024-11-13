import React from "react";
import { Metadata } from "next";
import { NuqsAdapter } from "nuqs/adapters/next/app";

import Navbar from "@/components/Navbar";
import Sidebar from "@/components/sidebar";
import CreateWorkspaceModal from "@/features/workspaces/components/create-workspace-modal";
import CreateProjectModal from "@/features/projects/components/create-project-modal";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "A website that provides task management facilities",
  icons: [
    {
      url: "/logo.svg",
      href: "/logo.svg",
    },
  ],
};

interface DashboardLayout {
  children: React.ReactNode;
}

const DashboardLayout = ({ children }: DashboardLayout) => {
  return (
    <NuqsAdapter>
      <div className="min-h-screen bg-slate-100">
        <CreateWorkspaceModal />
        <CreateProjectModal />
        <div className="flex w-full h-full">
          <div className="fixed left-0 top-0 hidden lg:block lg:w-[264px] h-full overflow-y-auto">
            <Sidebar />
          </div>
          <div className="lg:pl-[264px] w-full">
            <div className="mx-auto max-w-screen-2xl h-full">
              <Navbar />
              <main className="h-full py-8 px-6 flex flex-col">{children}</main>
            </div>
          </div>
        </div>
      </div>
    </NuqsAdapter>
  );
};

export default DashboardLayout;
