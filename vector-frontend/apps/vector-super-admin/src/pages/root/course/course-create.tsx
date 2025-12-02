"use client";

import React from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@repo/ui/components/form";
import * as z from "zod";

import { Button } from "@repo/ui/components/button";
import { TextInput } from "@repo/ui/custom-inputs/TextInput.js";
import { SelectInput } from "@repo/ui/custom-inputs/SelectInput.js";
import { ImageUploadInput } from "@repo/ui/custom-inputs/ImageUpload.js";
import { toast } from "sonner";
import { useNavigate } from "react-router";

import { useCreateCourse } from "../../../apis/course/Mutation";
import { useGetStaff } from "../../../apis/staff/Queries";


// --------------------
// ⭐ ZOD VALIDATION
// --------------------
const courseSchema = z.object({
  title: z.string().min(2, "Title is required"),
  description: z.string().min(10, "Description is required"),
  status: z.enum(["draft", "published"], {
    required_error: "Status is required",
  }),
  image: z.any().optional(),
});


export default function CourseCreate() {
  const navigate = useNavigate();

  const methods = useForm({
    resolver: zodResolver(courseSchema),
    mode: "onBlur",
    defaultValues: {
      status: "draft",
    },
  });

  const create = useCreateCourse();
  const { data: staffUsers } = useGetStaff();

  const staffOptions = Array.isArray(staffUsers)
    ? staffUsers.map((s: any) => ({
        label: s.username,
        value: String(s.id),
      }))
    : [];


  // --------------------
  // ⭐ SUBMIT HANDLER
  // --------------------
  const onSubmit = async (data: any) => {
    const formData = new FormData();

    formData.append("title", data.title);
    formData.append("description", data.description);
    formData.append("status", data.status);

    if (data.image instanceof File) {
      formData.append("image", data.image);
    }

    create.mutate(formData, {
      onSuccess: () => {
        toast.success("Course Created Successfully");
        navigate("/courses");
      },
      onError: (error) => {
        const backendError =
          error?.response?.data?.error ||
          error?.response?.data?.detail ||
          Object.values(error?.response?.data || {})?.[0]?.[0] ||
          "Failed to create course";

        toast.error(backendError);
      },
    });
  };


  // --------------------
  // ⭐ JSX FORM UI
  // --------------------
  return (
    <FormProvider {...methods}>
      <Form {...methods}>
        <form
          onSubmit={methods.handleSubmit(onSubmit)}
          className="space-y-6 bg-white p-6 rounded-xl shadow"
        >
          {/* IMAGE UPLOAD */}
          <ImageUploadInput name="image" label="Course Thumbnail" />

          <div className="grid grid-cols-2 gap-4">
            {/* TITLE */}
            <TextInput name="title" label="Course Title" />

            {/* STATUS (FIXED) */}
            <SelectInput
              name="status"
              label="Status"
              options={[
                { label: "Draft", value: "draft" },
                { label: "Published", value: "published" },
              ]}
            />

            {/* DESCRIPTION FIXED TEXTAREA */}
            <TextInput
              name="description"
              label="Description"
              textarea
            />
          </div>

          <Button type="submit" className="w-full bg-violet-600 text-white">
            Create Course
          </Button>
        </form>
      </Form>
    </FormProvider>
  );
}
