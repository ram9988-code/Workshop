"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import React, { useRef } from "react";
import { useForm } from "react-hook-form";
import Image from "next/image";
import { z } from "zod";
import { AvatarFallback } from "@radix-ui/react-avatar";
import { ArrowLeftIcon, CopyIcon, ImageIcon, Loader } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import DotteSeparator from "@/components/dotted-separator";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import useConfirm from "@/hooks/use-confirm";

import { useDeleteProject, useUpdateProject } from "../api";
import { updateProjectSchema } from "../schemas";
import { Project } from "../types";

interface EditProjectFormFormProps {
  onCancel?: () => void;
  initialValues: Project;
}

const EditProjectForm = ({
  onCancel,
  initialValues,
}: EditProjectFormFormProps) => {
  const router = useRouter();
  const { mutate, isPending } = useUpdateProject();
  const { mutate: deleteMutation, isPending: isDeletingProject } =
    useDeleteProject();

  const [DeleteDialog, confirmDelete] = useConfirm(
    "Delete Project",
    "This action will delete the project",
    "destructive"
  );

  const handleDelete = async () => {
    const ok = await confirmDelete();

    if (!ok) return;

    deleteMutation({ param: { projectId: initialValues.$id } });
  };

  const inputRef = useRef<HTMLInputElement>(null);

  const form = useForm<z.infer<typeof updateProjectSchema>>({
    resolver: zodResolver(updateProjectSchema),
    defaultValues: {
      ...initialValues,
      image: initialValues.imageUrl ?? "",
    },
  });

  const onSubmit = (values: z.infer<typeof updateProjectSchema>) => {
    const finalValues = {
      ...values,
      image: values.image instanceof File ? values.image : "",
    };

    mutate(
      { form: finalValues, param: { projectId: initialValues.$id } },
      {
        onSuccess: ({ data }) => {
          form.reset();
          router.push(
            `/dashboard/workspaces/${data.workspaceId}/projects/${data.$id}`
          );
        },
      }
    );
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      form.setValue("image", file);
    }
  };

  console.log(initialValues);

  return (
    <div className="flex flex-col gap-y-4">
      <DeleteDialog />
      <Card className="w-full h-full border-none shadow-none">
        <CardHeader className="flex flex-row items-center gap-x-4 p-7 space-y-0">
          <Button
            size={"sm"}
            variant={"secondary"}
            onClick={
              onCancel
                ? onCancel
                : () =>
                    router.push(
                      `/dashboard/workspaces/${initialValues.workspaceId}`
                    )
            }
          >
            <ArrowLeftIcon className="size-4 mr-2" />
            Back
          </Button>
          <CardTitle className="text-xl font-bold">
            {initialValues.name}
          </CardTitle>
        </CardHeader>
        <div className="px-7">
          <DotteSeparator />
        </div>
        <CardContent className="p-7">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <div className="flex flex-col gap-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Workspace Name</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Enter workspace name" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="image"
                  render={({ field }) => (
                    <div className="flex flex-col gap-y-2">
                      <div className="flex items-center gap-x-2">
                        {field.value ? (
                          <div className="text-neutral-800 size-[72px] relative rounded-md overflow-hidden">
                            <Image
                              src={
                                field.value instanceof File
                                  ? URL.createObjectURL(field.value)
                                  : field.value
                              }
                              alt="LOGO"
                              width={72}
                              height={72}
                              className="object-cover"
                            />
                          </div>
                        ) : (
                          <Avatar className="bg-neutral-100 flex justify-center items-center size-[72px]">
                            <AvatarFallback>
                              <ImageIcon className="size-[36px] text-neutral-400" />
                            </AvatarFallback>
                          </Avatar>
                        )}
                        <div className="flex flex-col">
                          <p className="text-sm">Workspace Icon</p>
                          <p className="text-sm text-muted-foreground">
                            JPG, PNG, SVG, WEBP OR JPEG, max 5MB
                          </p>
                          <Input
                            className="hidden"
                            type="file"
                            accept=".jpg, .png,.jpeg,.svg,.webp"
                            ref={inputRef}
                            onChange={handleImageChange}
                            disabled={isPending}
                          />
                          {field.value ? (
                            <Button
                              type="button"
                              disabled={isPending}
                              variant={"outline"}
                              size={"sm"}
                              className="w-fit mt-2"
                              onClick={() => {
                                field.onChange("");
                                if (inputRef.current) {
                                  inputRef.current.value = "";
                                }
                              }}
                            >
                              Remove Image
                            </Button>
                          ) : (
                            <Button
                              type="button"
                              disabled={isPending}
                              variant={"destructive"}
                              size={"sm"}
                              className="w-fit mt-2"
                              onClick={() => {
                                inputRef.current?.click();
                              }}
                            >
                              Upload Image
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                />
                <div className="flex justify-between items-center">
                  <Button
                    type="button"
                    size={"lg"}
                    variant={"secondary"}
                    onClick={onCancel}
                    disabled={isPending}
                    className={cn(!onCancel && "invisible")}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" size={"lg"} disabled={isPending}>
                    Save Changes{" "}
                    {isPending && (
                      <Loader className="size-4 animate-spin text-muted-foreground" />
                    )}
                  </Button>
                </div>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
      <Card className="w-full h-full border-none shadow-none">
        <CardContent className="p-7">
          <div className="flex flex-col">
            <h3 className="font-bold">Danger Zone</h3>
            <p className="text-sm text-muted-foreground">
              Delete a project is irreversible and will be removed all Data
            </p>
            <Button
              className="mt-6 w-fit ml-auto"
              size={"sm"}
              type="button"
              disabled={isDeletingProject || isPending}
              onClick={handleDelete}
              variant={"destructive"}
            >
              Delete Project
              {isDeletingProject && (
                <Loader className="size-4 animate-spin text-muted-foreground" />
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EditProjectForm;
