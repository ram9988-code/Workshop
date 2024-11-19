"use client";
import React from "react";
import Link from "next/link";
import { Medal } from "lucide-react";
import { NuqsAdapter } from "nuqs/adapters/next/app";

import { Button } from "@/components/ui/button";
import { useTest } from "@/hooks/use-test";

const MarketingPage = () => {
  const { onChange, latitude, longitude } = useTest();
  return (
    <div className="flex items-center justify-center flex-col">
      <div className="flex items-center justify-center flex-col">
        <div className="mb-4 flex items-center border shadow-sm p-4 bg-amber-100 text-amber-700 rounded-full uppercase">
          <Medal className="h-6 w-6 mr-2" />
          No. 1 task management
        </div>
        <h1 className="text-3xl md:text-6xl text-center text-neutral-800 mb-4 md:mb-8">
          Workshop helps team move
        </h1>
        <div className="text-3xl md:text-6xl bg-gradient-to-r from-fuchsia-600 to-pink-600 text-white px-4 p-2 rounded-md pb-4 w-fit">
          work forward.
        </div>
      </div>
      <div className="text-sm md:text-xl text-neutral-400 mt-4 max-w-2xl text-center mx-auto">
        Collaborate, manage projects, and reach new productivity peaks.From high
        rises to the home office, the way your team works is unique - accomplish
        it all with Workshop.
      </div>
      <Button className="mt-6" size={"lg"} asChild>
        <Button onClick={onChange}>Get Workshop</Button>
      </Button>
    </div>
  );
};

export default MarketingPage;
