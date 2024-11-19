"use client";
import {
  useQueryState,
  parseAsBoolean,
  useQueryStates,
  parseAsString,
} from "nuqs";
import { TaskStatus } from "../types";

export const useCreateTaskModal = () => {
  // const [isOpen, setIsOpen] = useQueryState(
  //   "create-task",
  //   parseAsBoolean.withDefault(false).withOptions({ clearOnDefault: true })
  // );

  const [{ status, createTask }, setIsOpen] = useQueryStates(
    {
      createTask: parseAsBoolean
        .withDefault(false)
        .withOptions({ clearOnDefault: true }),
      status: parseAsString
        .withDefault("")
        .withOptions({ clearOnDefault: true }),
    },
    {
      urlKeys: {
        createTask: "create-task",
        status: "status",
      },
    }
  );

  const open = (initialValue: TaskStatus | string) =>
    setIsOpen({ createTask: true, status: initialValue });

  const close = () => setIsOpen({ createTask: false, status: "" });

  return {
    isOpen: !!createTask,
    open,
    close,
    setIsOpen,
    status,
  };
};
