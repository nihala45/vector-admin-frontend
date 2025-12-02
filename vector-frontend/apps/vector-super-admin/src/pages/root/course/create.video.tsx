"use client";

import React from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import { Form } from "@repo/ui/components/form";
import { Button } from "@repo/ui/components/button";
import { TextInput } from "@repo/ui/custom-inputs/TextInput.tsx";
import { toast } from "sonner";
import { useNavigate, useParams } from "react-router";

import { useCreatVideo } from "../../../apis/vidoes/Mutations";

// Zod schema
const videoSchema = z.object({
  title: z.string().min(2, "Title is required"),
  video_url: z.string().url("Enter a valid video URL"),
  duration: z.string().optional(),
});

export default function VideoCreate() {
  const navigate = useNavigate();
  const { id: topicId } = useParams(); // topic_id in URL

  const methods = useForm({
    resolver: zodResolver(videoSchema),
    defaultValues: {
      title: "",
      video_url: "",
      duration: "",
    },
  });

  const createVideo = useCreatVideo();

  const onSubmit = (data: any) => {
    const payload = {
      ...data,
      topic: topicId,
    };

    createVideo.mutate(payload, {
      onSuccess: () => {
        toast.success("Video Created Successfully!");
        navigate(-1);
      },
      onError: (error) => {
        toast.error(
          error?.response?.data?.detail ||
            "Failed to create video"
        );
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
          <h2 className="text-2xl font-bold mb-4">Add Video</h2>

          <TextInput name="title" label="Video Title" />
          <TextInput name="video_url" label="Video URL" />
          <TextInput name="duration" label="Duration (optional)" />

          <Button type="submit" className="w-full bg-violet-600 text-white py-2">
            Create Video
          </Button>
        </form>
      </Form>
    </FormProvider>
  );
}
