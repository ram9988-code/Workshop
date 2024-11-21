import { Loader } from "lucide-react";
import React from "react";

const PageLoader = () => {
  return (
    <div className="h-full flex items-center justify-center">
      <Loader className="size-6 animate-spin to-muted-foreground" />
    </div>
  );
};

export default PageLoader;
