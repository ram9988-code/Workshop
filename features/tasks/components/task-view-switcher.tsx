"use client";
import { useCallback } from "react";
import { useQueryState } from "nuqs";
import { PlusIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useWorkspaceId } from "@/features/workspaces/hooks/use-workspace-id";

import { columns } from "./columns";
import { useBulkUpdateTasks, useGetTasks } from "../api";
import { TaskStatus } from "../types";
import { DataTable } from "./data-table";
import { useTaskFilters } from "../hooks/use-task-filters";
import { useCreateTaskModal } from "../hooks/use-create-task-modal";

import DataKanban from "./data-kanban";
import DataFilters from "./data-filters";
import DataCalendar from "./data-calendar";

interface TaskViewSwitcherProps {
  hideProjectFilter?: boolean;
}
const TaskViewSwitcher = ({ hideProjectFilter }: TaskViewSwitcherProps) => {
  const [view, setView] = useQueryState("task-view", { defaultValue: "table" });
  const workspaceId = useWorkspaceId();
  const [{ assigneeId, dueDate, projectId, search, status }, setFilters] =
    useTaskFilters();

  const { data: tasks, isLoading: isLoadingTasks } = useGetTasks({
    workspaceId,
    assigneeId,
    dueDate,
    projectId,
    search,
    status,
  });
  const { mutate: bulkUpdate } = useBulkUpdateTasks();

  const { open } = useCreateTaskModal();

  const onKanbanChange = useCallback(
    (tasks: { $id: string; status: TaskStatus; position: number }[]) => {
      bulkUpdate({ json: { tasks } });
    },
    [bulkUpdate]
  );
  return (
    <Tabs
      defaultValue={view}
      onValueChange={setView}
      className="flex-1 w-full border rounded-lg"
    >
      <div className="h-full flex flex-col overflow-auto p-4">
        <div className="flex flex-col gap-y-2 lg:flex-row justify-between items-center">
          <TabsList className="w-full lg:w-auto">
            <TabsTrigger className="h-8 w-full lg:w-auto" value="table">
              Table
            </TabsTrigger>
            <TabsTrigger className="h-8 w-full lg:w-auto" value="kanban">
              Kanban
            </TabsTrigger>
            <TabsTrigger className="h-8 w-full lg:w-auto" value="calender">
              Calender
            </TabsTrigger>
          </TabsList>
          <Button
            onClick={() => open("")}
            size={"sm"}
            className="w-full lg:w-auto"
          >
            <PlusIcon className={"size-4"} />
            New
          </Button>
        </div>
        <div className="my-2">
          <DataFilters hideProjectFilter={hideProjectFilter} />
        </div>
        <>
          <TabsContent value="table" className="mt-0">
            <DataTable columns={columns} data={tasks ?? []} />
          </TabsContent>
          <TabsContent value="kanban" className="mt-0">
            <DataKanban data={tasks ?? []} onChange={onKanbanChange} />
          </TabsContent>
          <TabsContent value="calender" className="mt-0 h-full pb-5">
            <DataCalendar data={tasks ?? []} />
          </TabsContent>
        </>
      </div>
    </Tabs>
  );
};

export default TaskViewSwitcher;
