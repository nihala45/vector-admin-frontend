"use client";

import React from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import { Button } from "@repo/ui/components/button";
import { TextInput } from "@repo/ui/custom-inputs/TextInput.js";
import { ImageUploadInput } from "@repo/ui/custom-inputs/ImageUpload.js";
import { toast } from "sonner";
import { useNavigate, useParams } from "react-router";
import { useCreatModule } from "../../../apis/module.ts/Mutation";

const moduleSchema = z.object({
  title: z.string().min(2, "Title is required"),
  description: z.string().min(10, "Description is required"),
  image: z.any().optional(),
});

export default function ModuleCreate() {
  const navigate = useNavigate();
  const { id: courseId } = useParams(); // course ID from url

  const methods = useForm({
    resolver: zodResolver(moduleSchema),
    defaultValues: {
      title: "",
      description: "",
      image: null,
    },
  });

  const create = useCreatModule();

  const onSubmit = async (data: any) => {
    const formData = new FormData();

    formData.append("title", data.title);
    formData.append("description", data.description);

    // attach course id (VERY IMPORTANT)
    formData.append("course", courseId);

    if (data.image instanceof File) {
      formData.append("image", data.image);
    }

    create.mutate(formData, {
      onSuccess: () => {
        toast.success("Module Created Successfully!");
        navigate(`/course/${courseId}`); // go back to course view
      },
      onError: (error) => {
        const backendError =
          error?.response?.data?.error ||
          error?.response?.data?.detail ||
          Object.values(error?.response?.data || {})?.[0]?.[0] ||
          "Failed to create module";

        toast.error(backendError);
      },
    });
  };

  return (
    <FormProvider {...methods}>
      <form
        onSubmit={methods.handleSubmit(onSubmit)}
        className="space-y-6 bg-white p-6 rounded-xl shadow"
      >
        {/* IMAGE */}
        <ImageUploadInput name="image" label="Module Image" />

        <div className="grid grid-cols-2 gap-4">
          {/* TITLE */}
          <TextInput name="title" label="Module Title" />

          {/* DESCRIPTION */}
          <TextInput name="description" label="Description" textarea />
        </div>

        <Button type="submit" className="w-full bg-violet-600 text-white">
          Create Module
        </Button>
      </form>
    </FormProvider>
  );
}
