import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import React from "react";

const Test = () => {
  return (
    <>
      <div className="flex gap-4 m-10">
        <Button>Primary</Button>
        <Button variant={"secondary"}>Secondary</Button>
        <Button variant={"destructive"}>Destructive</Button>
        <Button variant={"ghost"}>Ghost</Button>
        <Button variant={"link"}>Link</Button>
        <Button variant={"outline"}>Outline</Button>
      </div>
      <div className="flex gap-4 m-10">
        <Input />
      </div>
    </>
  );
};

export default Test;
