"use client";
import React from "react";
import ResponsiveModal from "@/components/responsive-modal";

import { useEditTaskModal } from "../hooks/use-update-task-modal";
import EditTaskModalWrapper from "./edit-task-modal-wrapper";

const EditTaskModal = () => {
  const { taskId, setTaskId, close } = useEditTaskModal();
  return (
    <ResponsiveModal open={!!taskId} onOpenChange={close}>
      {taskId && <EditTaskModalWrapper onCancel={close} id={taskId} />}
    </ResponsiveModal>
  );
};

export default EditTaskModal;
