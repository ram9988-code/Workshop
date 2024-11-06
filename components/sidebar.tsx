import React from "react";
import Logo from "./logo";
import DotteSeparator from "./dotted-separator";
import Navigation from "./Navigation";
import WorkspaceSwitcher from "./workspace-switcher";

const Sidebar = () => {
  return (
    <aside className="h-full bg-neutral-100 p-4 w-full">
      <Logo />
      <DotteSeparator className="my-4" />
      <WorkspaceSwitcher />
      <DotteSeparator className="my-4" />
      <Navigation />
    </aside>
  );
};

export default Sidebar;
