"use client";

import React, { useEffect } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import { Form } from "@repo/ui/components/form";
import { Button } from "@repo/ui/components/button";
import { TextInput } from "@repo/ui/custom-inputs/TextInput.tsx";
import { ImageUploadInput } from "@repo/ui/custom-inputs/ImageUpload.tsx";
import { toast } from "sonner";
import { useNavigate, useParams } from "react-router";

import { useGetTopicById } from "../../../apis/topics/Queries";
import { useUpdateTopic } from "../../../apis/topics/Mutation";


const topicSchema = z.object({
  title: z.string().min(2, "Title is required"),
  description: z.string().min(10, "Description is required"),
  image: z.any().optional(),
});


export default function TopicEdit() {
  const navigate = useNavigate();
  const { id: topicId } = useParams();

  const { data: topic, isLoading } = useGetTopicById(topicId);
  const updateTopic = useUpdateTopic(topicId);

  const methods = useForm({
    resolver: zodResolver(topicSchema),
    defaultValues: {
      title: "",
      description: "",
      image: null,
    },
  });

  
  useEffect(() => {
    if (topic) {
      methods.reset({
        title: topic.title,
        description: topic.description,
        image: null,
      });
    }
  }, [topic, methods]);

  if (isLoading) {
    return <div className="p-4 text-center">Loading topic...</div>;
  }

  const onSubmit = async (data: any) => {
    const formData = new FormData();

    formData.append("title", data.title);
    formData.append("description", data.description);

    formData.append("module", topic.module);

    // Add image only if updated
    if (data.image instanceof File) {
      formData.append("image", data.image);
    }

    updateTopic.mutate(formData, {
      onSuccess: () => {
        toast.success("Topic Updated Successfully!");
        navigate(-1);
      },
      onError: (error) => {
        const backendError =
          error?.response?.data?.error ||
          error?.response?.data?.detail ||
          Object.values(error?.response?.data || {})?.[0]?.[0] ||
          "Failed to update topic";

        toast.error(backendError);
      },
    });
  };

  // ---------------------------------------------
  // JSX UI
  // ---------------------------------------------
  return (
    <FormProvider {...methods}>
      <Form {...methods}>
        <form
          onSubmit={methods.handleSubmit(onSubmit)}
          className="space-y-6 bg-white p-6 rounded-xl shadow max-w-4xl mx-auto mt-8"
        >
          <h2 className="text-2xl font-bold mb-4">Edit Topic</h2>

          {/* CURRENT IMAGE PREVIEW */}
          {topic?.image && (
            <div className="mb-4">
              <p className="text-sm text-gray-600 mb-1">Current Image:</p>
              <img
                src={topic.image}
                alt="Topic"
                className="h-32 w-32 object-cover rounded"
              />
            </div>
          )}

          {/* UPLOAD NEW IMAGE */}
          <ImageUploadInput name="image" label="Upload New Topic Image" />

          <div className="grid grid-cols-2 gap-4">
            {/* TITLE */}
            <TextInput name="title" label="Topic Title" />

            {/* DESCRIPTION */}
            <TextInput name="description" label="Description" textarea />
          </div>

          <Button type="submit" className="w-full bg-violet-600 text-white py-2">
            Update Topic
          </Button>
        </form>
      </Form>
    </FormProvider>
  );
}
