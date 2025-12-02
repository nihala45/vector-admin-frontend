"use client";

import React, { useEffect } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import { Form } from "@repo/ui/components/form";
import { Button } from "@repo/ui/components/button";
import { TextInput } from "@repo/ui/custom-inputs/TextInput.tsx";
import { FileUploadInput } from "@repo/ui/custom-inputs/FileUploadInput.tsx";
import { toast } from "sonner";
import { useNavigate, useParams } from "react-router";


import { useGetPdfById } from "../../../apis/Files/Queries";
import { useUpdatePdf } from "../../../apis/Files/Mutations";
const schema = z.object({
  title: z.string().min(2, "Title is required"),
  file: z.any().optional(),
});

export default function DocumentEdit() {
  const navigate = useNavigate();
  const { id: docId } = useParams();

  const { data: doc, isLoading } = useGetPdfById(docId);
  const updateDocument = useUpdatePdf(docId);

  const methods = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      title: "",
      file: null,
    },
  });

  useEffect(() => {
    if (doc) {
      methods.reset({
        title: doc.title,
        file: null,
      });
    }
  }, [doc, methods]);

  if (isLoading) return <div className="p-6 text-center">Loading document...</div>;

  const onSubmit = (data: any) => {
    const formData = new FormData();
    formData.append("title", data.title);
    formData.append("topic", doc.topic);

    if (data.file instanceof File) {
      formData.append("file", data.file);
    }

    updateDocument.mutate(formData, {
      onSuccess: () => {
        toast.success("Document Updated Successfully!");
        navigate(-1);
      },
      onError: (error) => {
        toast.error(
          error?.response?.data?.detail || "Failed to update document"
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
          <h2 className="text-2xl font-bold mb-4">Edit Document</h2>

          <TextInput name="title" label="Document Title" />

          {doc?.file && (
            <div>
              <p className="text-sm text-gray-500 mb-1">Current PDF:</p>
              <a
                href={doc.file}
                target="_blank"
                className="text-blue-600 underline"
              >
                View PDF
              </a>
            </div>
          )}

          <FileUploadInput
            name="file"
            label="Upload New PDF (optional)"
            accept=".pdf"
          />

          <Button type="submit" className="w-full bg-violet-600 text-white py-2">
            Update Document
          </Button>
        </form>
      </Form>
    </FormProvider>
  );
}
