"use client";

import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import { useGetCourseBySlug } from "../../../apis/course/Queries";
import { Button } from "@repo/ui/components/button";
import { useGetStaff } from "../../../apis/staff/Queries";
import { MultiSelect } from "@repo/ui/custom-inputs/MultiSelect.tsx";
import { useUpdateCourseStaff } from "../../../apis/course/Mutation";

// ⭐ Added for MultiSelect
import { useForm, FormProvider } from "react-hook-form";

export default function CourseViewPage() {
  const params = useParams();
  const navigate = useNavigate();
  const slug = params.slug as string;

  const methods = useForm({
    defaultValues: {
      staff: [],
    },
  });

  const { setValue, watch } = methods;

  const selectedStaff = watch("staff");

  const { data: course, isLoading, isError, refetch } = useGetCourseBySlug(slug);
  const { data: staffList } = useGetStaff();

  const updateStaffMutation = useUpdateCourseStaff(course?.id);

  
  useEffect(() => {
    if (course?.staff && staffList) {
      const matched = staffList
        .filter((u: any) => course.staff.includes(u.email))
        .map((s: any) => s.id);

      setValue("staff", matched);
    }
  }, [course, staffList, setValue]);

  if (isLoading) return <div className="p-6">Loading...</div>;
  if (isError || !course) return <div className="p-6">Failed to load</div>;

  // 🔥 Update Staff
  const handleStaffUpdate = () => {
    updateStaffMutation.mutate(
      {
        courseId: course.id,
        staff_ids: selectedStaff, // since RHF stores only IDs
      },
      {
        onSuccess: () => {
          alert("Staff updated successfully!");
          refetch();
        },
        onError: () => alert("Failed to update staff"),
      }
    );
  };

  return (
    <FormProvider {...methods}>
      <div className="max-w-6xl mx-auto p-6 space-y-6">
        
        {/* HEADER SECTION */}
        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex justify-between items-start">
            
            <div>
              <h1 className="text-3xl font-bold mb-2">{course.title}</h1>
              <p className="text-gray-600 mb-3">{course.description}</p>

              <p className="text-sm text-gray-700 mb-2">
                <strong>Created At:</strong>{" "}
                {new Date(course.created_at).toLocaleDateString()}
              </p>

              {/* MULTISELECT STAFF UPDATE */}
              <div className="mt-4">
                <p className="font-semibold mb-2">Assigned Staff</p>

                <MultiSelect
                  name="staff"
                  options={
                    staffList?.map((s: any) => ({
                      label: s.email,
                      value: s.id,
                    })) || []
                  }
                  placeholder="Select staff"
                />

                <Button onClick={handleStaffUpdate} className="mt-3">
                  Update Staff
                </Button>
              </div>

            
            </div>

            {/* COURSE IMAGE */}
            <img
              src={
                course.image ||
                "https://dummyimage.com/400x250/ddd/000&text=No+Image"
              }
              className="w-72 h-48 object-cover rounded-lg border shadow"
            />
          </div>
        </div>

        {/* MODULES SECTION */}
        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex justify-between mb-4">
            <h2 className="text-xl font-semibold">Modules</h2>

            <Button onClick={() => navigate(`/module/create/${course.id}`)}>
              + Create Module
            </Button>
          </div>

          {course.modules.length === 0 && (
            <p className="text-gray-500">No modules available</p>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {course.modules.map((mod: any) => (
              <div
                key={mod.id}
                className="flex bg-gray-50 p-3 rounded-lg border gap-4"
              >
                <img
                  src={
                    mod.image ||
                    "https://dummyimage.com/150x100/ddd/000&text=No+Image"
                  }
                  className="w-28 h-20 rounded object-cover"
                />
                <div>
                  <h3 className="font-semibold">{mod.title}</h3>
                  <p className="text-sm text-gray-600">{mod.description}</p>

                  <Button
                    className="mt-2"
                    variant="secondary"
                    onClick={() => navigate(`/module/edit/${mod.id}`)}
                  >
                    Edit
                  </Button>

                   <Button
                    className="mt-2"
                    variant="secondary"
                    onClick={() => navigate(`/module/view/${mod.id}`)}
                  >
                    View
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </FormProvider>
  );
}
