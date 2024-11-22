import React from "react";
import { snakeCaseToTitleCase } from "@/lib/utils";
import {
  CircleCheckIcon,
  CircleDashedIcon,
  CircleDotDashedIcon,
  CircleDotIcon,
  CircleIcon,
  PlusIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { TaskStatus } from "@/features/tasks/types";
import { useCreateTaskModal } from "@/features/tasks/hooks/use-create-task-modal";

interface KanbanColumnHeaderProps {
  board: TaskStatus;
  taskCount: number;
}

const statusIconMap: Record<TaskStatus, React.ReactNode> = {
  [TaskStatus.BACKLOG]: (
    <CircleDashedIcon className="size-[18px] text-pink-400" />
  ),
  [TaskStatus.DONE]: <CircleCheckIcon className="size-[18px] text-green-400" />,
  [TaskStatus.IN_PROGRESS]: (
    <CircleDotDashedIcon className="size-[18px] text-yellow-400" />
  ),
  [TaskStatus.IN_REVIEW]: (
    <CircleDotIcon className="size-[18px] text-blue-400" />
  ),
  [TaskStatus.TODO]: <CircleIcon className="size-[18px] text-red-400" />,
};

const CardstatusHeader = ({ board, taskCount }: KanbanColumnHeaderProps) => {
  const icon = statusIconMap[board];
  return (
    <div className="flex flex-col justify-center items-center">
      <div className="px-2 py-1.5 flex items-center justify-between">
        <div className="flex justify-center items-center gap-x-2">
          {icon}
          <h2 className="text-sm font-medium">{snakeCaseToTitleCase(board)}</h2>
        </div>
      </div>
      <div className="size-10 flex items-center justify-center rounded-md bg-neutral-200 text-base text-neutral-700 font-medium">
        {taskCount}
      </div>
    </div>
  );
};

export default CardstatusHeader;
