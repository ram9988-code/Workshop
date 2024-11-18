"use client";
import { useQueryState } from "nuqs";
import { PlusIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useWorkspaceId } from "@/features/workspaces/hooks/use-workspace-id";

import { useGetTasks } from "../api";
import DataFilters from "./data-filters";
import { useTaskFilters } from "../hooks/use-task-filters";
import { useCreateTaskModal } from "../hooks/use-create-task-modal";

const TaskViewSwitcher = () => {
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
  const { open } = useCreateTaskModal();

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
          <Button onClick={open} size={"sm"} className="w-full lg:w-auto">
            <PlusIcon className={"size-4"} />
            New
          </Button>
        </div>
        <DataFilters />
        <>
          <TabsContent value="table" className="mt-0">
            Data table
          </TabsContent>
          <TabsContent value="kanban" className="mt-0">
            Data kanban
          </TabsContent>
          <TabsContent value="calender" className="mt-0">
            Data calender
          </TabsContent>
        </>
      </div>
      {JSON.stringify(tasks)}
    </Tabs>
  );
};

export default TaskViewSwitcher;
