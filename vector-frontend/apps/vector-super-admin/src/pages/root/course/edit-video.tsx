"use client";

import React, { useEffect } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import { Form } from "@repo/ui/components/form";
import { Button } from "@repo/ui/components/button";
import { TextInput } from "@repo/ui/custom-inputs/TextInput.tsx";
import { toast } from "sonner";
import { useNavigate, useParams } from "react-router";


import { useGetVideoById } from "../../../apis/vidoes/Queries";
import { useUpdateVideo } from "../../../apis/vidoes/Mutations";

const videoSchema = z.object({
  title: z.string().min(2, "Title is required"),
  video_url: z.string().url("Valid URL is required"),
  duration: z.string().optional(),
});

export default function VideoEdit() {
  const navigate = useNavigate();
  const { id: videoId } = useParams();

  const { data: video, isLoading } = useGetVideoById(videoId);
  const updateVideo = useUpdateVideo(videoId);

  const methods = useForm({
    resolver: zodResolver(videoSchema),
    defaultValues: {
      title: "",
      video_url: "",
      duration: "",
    },
  });

  useEffect(() => {
    if (video) {
      methods.reset({
        title: video.title,
        video_url: video.video_url,
        duration: video.duration || "",
      });
    }
  }, [video, methods]);

  if (isLoading) {
    return <div className="p-6 text-center">Loading...</div>;
  }

  const onSubmit = (data: any) => {
    const payload = {
      ...data,
      topic: video.topic, // Keep same topic
    };

    updateVideo.mutate(payload, {
      onSuccess: () => {
        toast.success("Video Updated Successfully!");
        navigate(-1);
      },
      onError: (error) => {
        toast.error(
          error?.response?.data?.detail ||
            "Failed to update video"
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
          <h2 className="text-2xl font-bold mb-4">Edit Video</h2>

          <TextInput name="title" label="Title" />
          <TextInput name="video_url" label="Video URL" />
          <TextInput name="duration" label="Duration (optional)" />

          <Button type="submit" className="w-full bg-violet-600 text-white py-2">
            Update Video
          </Button>
        </form>
      </Form>
    </FormProvider>
  );
}
