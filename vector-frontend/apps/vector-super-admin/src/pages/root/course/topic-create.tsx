"use client";

import React from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import { Form } from "@repo/ui/components/form";
import { TextInput } from "@repo/ui/custom-inputs/TextInput";
import { ImageUploadInput } from "@repo/ui/custom-inputs/ImageUpload";
import { Button } from "@repo/ui/components/button";
import { toast } from "sonner";
import { useNavigate, useParams } from "react-router";

import { useCreatTopic } from "../../../apis/topics/Mutation";

// -----------------------
// ZOD VALIDATION
// -----------------------
const topicSchema = z.object({
  title: z.string().min(2, "Title is required"),
  description: z.string().min(5, "Description is required"),
  image: z.any().optional(),
});

// -----------------------
// COMPONENT
// -----------------------
export default function TopicCreate() {
  const navigate = useNavigate();
  const { id: moduleId } = useParams(); // module ID from URL

  const createTopic = useCreatTopic();

  const methods = useForm({
    resolver: zodResolver(topicSchema),
    defaultValues: {
      title: "",
      description: "",
      image: null,
    },
  });

  const onSubmit = (data: any) => {
    const formData = new FormData();

    formData.append("title", data.title);
    formData.append("description", data.description);

    // backend expects module id
    formData.append("module", moduleId);

    if (data.image instanceof File) {
      formData.append("image", data.image);
    }

    createTopic.mutate(formData, {
      onSuccess: () => {
        toast.success("Topic Created Successfully!");
        navigate(`/module/${moduleId}`); // go back to module view
      },
      onError: (error) => {
        const backendError =
          error?.response?.data?.error ||
          error?.response?.data?.detail ||
          "Failed to create topic";

        toast.error(backendError);
      },
    });
  };

  return (
    <FormProvider {...methods}>
      <Form {...methods}>
        <form
          onSubmit={methods.handleSubmit(onSubmit)}
          className="space-y-6 bg-white p-6 rounded-xl shadow max-w-4xl mx-auto"
        >
          <h1 className="text-2xl font-semibold mb-4">Create Topic</h1>

          <ImageUploadInput name="image" label="Topic Image (optional)" />

          <div className="grid grid-cols-2 gap-4">
            <TextInput name="title" label="Topic Title" />
            <TextInput name="description" label="Description" textarea />
          </div>

          <Button type="submit" className="w-full bg-violet-600 text-white">
            Create Topic
          </Button>
        </form>
      </Form>
    </FormProvider>
  );
}
