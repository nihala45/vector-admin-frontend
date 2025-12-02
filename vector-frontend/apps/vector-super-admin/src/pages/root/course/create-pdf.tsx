"use client";

import React from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import { Form } from "@repo/ui/components/form";
import { Button } from "@repo/ui/components/button";
import { TextInput } from "@repo/ui/custom-inputs/TextInput.tsx";
import { FileUploadInput } from "@repo/ui/custom-inputs/FileUploadInput.tsx";
import { toast } from "sonner";
import { useNavigate, useParams } from "react-router";
import { useCreatePdf } from "../../../apis/Files/Mutations";

const schema = z.object({
  title: z.string().min(2, "Title is required"),
  file: z.any().refine((f) => f instanceof File, "PDF file is required"),
});

export default function DocumentCreate() {
  const navigate = useNavigate();
  const { id: topicId } = useParams();

  const methods = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      title: "",
      file: null,
    },
  });

  const createDocument = useCreatePdf();

  const onSubmit = (data: any) => {
    const formData = new FormData();
    formData.append("title", data.title);
    formData.append("file", data.file);
    formData.append("topic", topicId);

    createDocument.mutate(formData, {
      onSuccess: () => {
        toast.success("Document uploaded successfully!");
        navigate(-1);
      },
      onError: (error) => {
        toast.error(
          error?.response?.data?.detail || "Failed to upload document"
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
          <h2 className="text-2xl font-bold mb-4">Upload PDF Document</h2>

          <TextInput name="title" label="Document Title" />

          <FileUploadInput
            name="file"
            label="Upload PDF"
            accept=".pdf"
          />

          <Button type="submit" className="w-full bg-violet-600 text-white py-2">
            Upload Document
          </Button>
        </form>
      </Form>
    </FormProvider>
  );
}
