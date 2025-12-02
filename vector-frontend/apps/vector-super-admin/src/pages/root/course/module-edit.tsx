"use client";

import React, { useEffect } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@repo/ui/components/form";
import * as z from "zod";

import { Button } from "@repo/ui/components/button";
import { TextInput } from "@repo/ui/custom-inputs/TextInput";
import { ImageUploadInput } from "@repo/ui/custom-inputs/ImageUpload";
import { toast } from "sonner";
import { useNavigate, useParams } from "react-router";

import { useUpdateModule } from "../../../apis/module.ts/Mutation";
import { useGetSingleModule } from "../../../apis/module.ts/Queries";

const moduleSchema = z.object({
  title: z.string().min(2, "Title is required"),
  description: z.string().min(10, "Description is required"),
  image: z.any().optional(),
});

export default function ModuleEdit() {
  const navigate = useNavigate();
  const { id } = useParams();

  const { data: course, isLoading } = useGetSingleModule(id);
  const updateCourse = useUpdateModule(id);

  const methods = useForm({
    resolver: zodResolver(moduleSchema),
    mode: "onBlur",
    defaultValues: {
      title: "",
      description: "",
      image: null,
    },
  });

  useEffect(() => {
    if (course) {
      methods.reset({
        title: course.title,
        description: course.description,
      });
    }
  }, [course, methods]);

  if (isLoading) {
    return <div className="p-4 text-center">Loading module...</div>;
  }

  const onSubmit = async (data: any) => {
    const formData = new FormData();

    formData.append("title", data.title);
    formData.append("description", data.description);

    // ONLY PATCH course if backend allows changing it
    formData.append("course", course.course);

    if (data.image instanceof File) {
      formData.append("image", data.image);
    }

    updateCourse.mutate(formData, {
      onSuccess: () => {
        toast.success("Module Updated Successfully");
        navigate(-1);
      },
      onError: (error) => {
        const backendError =
          error?.response?.data?.error ||
          error?.response?.data?.detail ||
          Object.values(error?.response?.data || {})?.[0]?.[0] ||
          "Failed to update module";

        toast.error(backendError);
      },
    });
  };

  return (
    <FormProvider {...methods}>
      <Form {...methods}>
        <form
          onSubmit={methods.handleSubmit(onSubmit)}
          className="space-y-6 bg-white p-6 rounded-xl shadow"
        >
          {course?.image && (
            <div className="mb-4">
              <p className="text-sm text-gray-600 mb-1">Current Image:</p>
              <img
                src={course.image}
                alt="Module"
                className="h-32 w-32 object-cover rounded"
              />
            </div>
          )}

          <ImageUploadInput name="image" label="Upload New Thumbnail" />

          <div className="grid grid-cols-2 gap-4">
            <TextInput name="title" label="Module Title" />
            <TextInput name="description" label="Description" textarea />
          </div>

          <Button type="submit" className="w-full bg-violet-600 text-white">
            Update Module
          </Button>
        </form>
      </Form>
    </FormProvider>
  );
}
