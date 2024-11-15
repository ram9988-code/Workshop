"use client";
import React from "react";
import ResponsiveModal from "@/components/responsive-modal";

import CreateTaskModalWrapper from "./create-task-modal-wrapper";
import { useCreateTaskModal } from "../hooks/use-create-task-modal";

const CreateTaskModal = () => {
  const { isOpen, setIsOpen, close } = useCreateTaskModal();
  return (
    <ResponsiveModal open={isOpen} onOpenChange={setIsOpen}>
      <CreateTaskModalWrapper onCancel={close} />
    </ResponsiveModal>
  );
};

export default CreateTaskModal;
