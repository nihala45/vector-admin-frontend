"use client";

import React, { useEffect } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@repo/ui/components/form";
import * as z from "zod";

import { Button } from "@repo/ui/components/button";
import { TextInput } from "@repo/ui/custom-inputs/TextInput";
import { SelectInput } from "@repo/ui/custom-inputs/SelectInput";
import { ImageUploadInput } from "@repo/ui/custom-inputs/ImageUpload";
import { toast } from "sonner";
import { useNavigate, useParams } from "react-router";

import { useUpdateCourse } from "../../../apis/course/Mutation";
import { useGetSingleCourse } from "../../../apis/course/Queries"; // <-- You MUST create this query

// ---------------------------------------------------
// ZOD SCHEMA
// ---------------------------------------------------
const courseSchema = z.object({
  title: z.string().min(2, "Title is required"),
  description: z.string().min(10, "Description is required"),
  status: z.enum(["draft", "published"], {
    required_error: "Status is required",
  }),
  image: z.any().optional(),
});

// ---------------------------------------------------
// COMPONENT
// ---------------------------------------------------
export default function CourseEdit() {
  const navigate = useNavigate();
  const { id } = useParams();

  const { data: course, isLoading } = useGetSingleCourse(id);
  const updateCourse = useUpdateCourse(id);

  const methods = useForm({
    resolver: zodResolver(courseSchema),
    mode: "onBlur",
  });

  // Prefill form after API data loads
  useEffect(() => {
    if (course) {
      methods.reset({
        title: course.title,
        description: course.description,
        status: course.status,
      });
    }
  }, [course, methods]);

  if (isLoading) {
    return <div className="p-4 text-center">Loading course...</div>;
  }

  // ---------------------------------------------------
  // SUBMIT HANDLER
  // ---------------------------------------------------
  const onSubmit = async (data: any) => {
    const formData = new FormData();

    formData.append("title", data.title);
    formData.append("description", data.description);
    formData.append("status", data.status);

    // Add only if user selected a new image
    if (data.image instanceof File) {
      formData.append("image", data.image);
    }

    updateCourse.mutate(formData, {
      onSuccess: () => {
        toast.success("Course Updated Successfully");
        navigate("/course");
      },
      onError: (error) => {
        const backendError =
          error?.response?.data?.error ||
          error?.response?.data?.detail ||
          Object.values(error?.response?.data || {})?.[0]?.[0] ||
          "Failed to update course";

        toast.error(backendError);
      },
    });
  };

  // ---------------------------------------------------
  // JSX
  // ---------------------------------------------------
  return (
    <FormProvider {...methods}>
      <Form {...methods}>
       
        <form
          onSubmit={methods.handleSubmit(onSubmit)}
          className="space-y-6 bg-white p-6 rounded-xl shadow"
        >
           {course.status === "published" && (
                <p className="text-green-500">Published</p>
              )}

          {/* CURRENT IMAGE PREVIEW */}
          {course?.image && (
            <div className="mb-4">
              <p className="text-sm text-gray-600 mb-1">Current Image:</p>
              <img
                src={course.image}
                alt="Course"
                className="h-32 w-32 object-cover rounded"
              />
            </div>
          )}

          {/* UPLOAD NEW IMAGE */}
          <ImageUploadInput name="image" label="Upload New Thumbnail" />

          <div className="grid grid-cols-2 gap-4">
            {/* TITLE */}
            <TextInput name="title" label="Course Title" />

            {/* STATUS */}
               {course.status === "draft" && (
            <SelectInput
              name="status"
              label="Status"
              options={[
                { label: "Draft", value: "draft" },
                { label: "Published", value: "published" },
              ]}
            />
               )}
               
            {/* DESCRIPTION */}
            <TextInput
              name="description"
              label="Description"
              type="textarea"
            />
          </div>

          <Button type="submit" className="w-full bg-violet-600 text-white">
            Update Course
          </Button>
        </form>
      </Form>
    </FormProvider>
  );
}
