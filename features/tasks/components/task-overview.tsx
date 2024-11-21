import React from "react";
import { PencilIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import MemberAvatar from "@/features/members/components/member-avatar";

import OverviewProperty from "./overview-property";

import { Task } from "../types";
import TaskDate from "./task-date";
import { Badge } from "@/components/ui/badge";
import { snakeCaseToTitleCase } from "@/lib/utils";
import { useEditTaskModal } from "../hooks/use-update-task-modal";
import TaskDescription from "./task-description";

interface TaskOverViewProps {
  task: Task;
}
const TaskOverView = ({ task }: TaskOverViewProps) => {
  const { open } = useEditTaskModal();
  return (
    <div className="flex flex-col gap-y-4 col-span-1 w-full">
      <div className="bg-muted rounded-lg p-4">
        <div className="flex items-center justify-between">
          <p className="text-lg font-semibold">Overview</p>
          <Button
            onClick={() => open(task.$id)}
            size={"sm"}
            variant={"secondary"}
          >
            <PencilIcon className="size-4 mr-2" />
            Edit
          </Button>
        </div>
        <div className="flex flex-col gap-y-4">
          <OverviewProperty label="Assignee">
            <MemberAvatar name={task.assignee.name} className="size-6" />
            <p className="text-sm font-medium">{task.assignee.name}</p>
          </OverviewProperty>
          <OverviewProperty label="Due Date">
            <TaskDate value={task.dueDate} className="text-sm font-medium" />
          </OverviewProperty>
          <OverviewProperty label={task.status}>
            <Badge variant={task.status}>
              {snakeCaseToTitleCase(task.status)}
            </Badge>
          </OverviewProperty>
        </div>
      </div>
      <div className="flex flex-col gap-y-4">
        <TaskDescription task={task} />
      </div>
    </div>
  );
};

export default TaskOverView;
