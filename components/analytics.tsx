import { ProjectAnalyticsResponseType } from "@/features/projects/api/use-get-project-analytics";
import React from "react";
import { ScrollArea, ScrollBar } from "./ui/scroll-area";
import AnalyticsCard from "./analytics-card";
import DotteSeparator from "./dotted-separator";

const Analytics = ({ data }: ProjectAnalyticsResponseType) => {
  return (
    <ScrollArea className="border rounded-lg w-full whitespace-nowrap shrink-0">
      <div className="w-full flex flow-row">
        <div className="flex items-center flex-1">
          <AnalyticsCard
            title="Total Tasks"
            value={data.taskCount}
            varient={data.taskDiff > 0 ? "up" : "down"}
            increaseValue={data.taskDiff}
          />
        </div>
        <DotteSeparator direction="Vertical" />
        <div className="flex items-center flex-1">
          <AnalyticsCard
            title="Assigneed Task"
            value={data.assigneeTaskCount}
            varient={data.assigneeTaskDiff > 0 ? "up" : "down"}
            increaseValue={data.assigneeTaskCount}
          />
        </div>
        <DotteSeparator direction="Vertical" />
        <div className="flex items-center flex-1">
          <AnalyticsCard
            title="Competed Task"
            value={data.CompleteTasksCount}
            varient={data.CompleteTasksDiff > 0 ? "up" : "down"}
            increaseValue={data.CompleteTasksCount}
          />
        </div>
        <DotteSeparator direction="Vertical" />
        <div className="flex items-center flex-1">
          <AnalyticsCard
            title="Over Due Task"
            value={data.overDueTaskCount}
            varient={data.overDueTasksDiff > 0 ? "up" : "down"}
            increaseValue={data.overDueTaskCount}
          />
        </div>
        <DotteSeparator direction="Vertical" />
        <div className="flex items-center flex-1">
          <AnalyticsCard
            title="Incompleted Task"
            value={data.inCompletedTaskCount}
            varient={data.inCompletedTasksDiff > 0 ? "up" : "down"}
            increaseValue={data.inCompletedTaskCount}
          />
        </div>
      </div>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  );
};

export default Analytics;
