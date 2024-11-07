import React from "react";

import { Loader } from "lucide-react";

const DashboardLoading = () => {
  return (
    <div className="h-full flex items-center justify-center">
      <Loader className="size-6 animate-spin to-muted-foreground" />
    </div>
  );
};

export default DashboardLoading;
