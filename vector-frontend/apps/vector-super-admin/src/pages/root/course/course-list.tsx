"use client";

import React, { useState } from "react";
import { useNavigate } from "react-router";

import { CustomDataTable } from "../../../../components/common/data-table/CustomDataTable";
import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@repo/ui/components/button";
import { MoreHorizontal } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@repo/ui/components/dropdown-menu";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@repo/ui/components/alert-dialog";

import { Avatar, AvatarFallback } from "@repo/ui/components/avatar";

import { useGetCourse } from "../../../apis/course/Queries";
import { useDeleteCourseById } from "../../../apis/course/Mutation";

// ------------------ TYPES -------------------
export type CourseType = {
  id: number;
  title: string;
  description: string;
  slug: string;
  status: string; // "draft" | "published"
  image: string | null;
};

// ------------------ TABLE COLUMNS -------------------
const CourseColumns = () => {
  const columns: ColumnDef<CourseType>[] = [
    {
      accessorKey: "title",
      header: "Course",
      cell: ({ row }) => {
        const { title } = row.original;
        return (
          <div className="flex items-center gap-2">
            <Avatar>
              <AvatarFallback>{title.charAt(0).toUpperCase()}</AvatarFallback>
            </Avatar>
            <span>{title}</span>
          </div>
        );
      },
    },

    {
      accessorKey: "id",
      header: "ID",
    },

    {
      accessorKey: "slug",
      header: "Slug",
    },

    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.getValue("status") as string;
        const published = status === "published";

        return (
          <span
            className={`px-2 py-1 rounded-md text-sm font-medium ${
              published
                ? "bg-green-100 text-green-600"
                : "bg-yellow-100 text-yellow-700"
            }`}
          >
            {published ? "Published" : "Draft"}
          </span>
        );
      },
    },

    // ------------ ACTIONS ------------
    {
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => {
        const course = row.original;
        const navigate = useNavigate();

        const deleteMutation = useDeleteCourseById(course.id);
        const [open, setOpen] = useState(false);

        const handleDelete = () => {
          deleteMutation.mutate(undefined, {
            onSuccess: () => setOpen(false),
          });
        };

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <MoreHorizontal />
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>

              <DropdownMenuItem
                onClick={() => navigate(`/course/edit/${course.id}`)}
              >
                Edit Course
              </DropdownMenuItem>
              

              {/* ✅ View Page only if course.status === "published" */}
              {course.status === "published" && (
                <DropdownMenuItem
                  onClick={() => navigate(`/course/view/${course.slug}`)}
                >
                  View Page
                </DropdownMenuItem>
              )}

              <DropdownMenuItem
                onClick={() => navigator.clipboard.writeText(String(course.id))}
              >
                Copy ID
              </DropdownMenuItem>

              <AlertDialog open={open} onOpenChange={setOpen}>
                <AlertDialogTrigger asChild>
                  <Button
                    variant="ghost"
                    className="w-full text-red-600 hover:text-red-700 hover:bg-red-50 justify-start"
                    onClick={(e) => e.stopPropagation()}
                  >
                    Delete Course
                  </Button>
                </AlertDialogTrigger>

                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Delete this course?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This action is permanent and cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>

                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>

                    <AlertDialogAction
                      onClick={handleDelete}
                      className="bg-red-600 hover:bg-red-700 text-white"
                    >
                      Delete
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  return columns;
};

// ------------------ MAIN COMPONENT -------------------
export default function CourseList() {
  const navigate = useNavigate();
  const { data: courses } = useGetCourse();

  const courseList = Array.isArray(courses) ? courses : [];

  const mappedData = courseList.map((course: any) => ({
    id: course.id,
    title: course.title,
    description: course.description,
    slug: course.slug,
    status: course.status,
    image: course.image,
  }));

  return (
    <div className="bg-white">
      <div className="p-4 flex flex-col sm:flex-row justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Course Management</h1>
          <p className="text-sm text-gray-600">
            Manage all courses, update and delete courses easily
          </p>
        </div>

        <Button
          className="bg-violet-500"
          onClick={() => navigate("/course/create")}
        >
          Add New Course
        </Button>
      </div>

      <CustomDataTable
        columns={CourseColumns()}
        data={mappedData}
        exportFileName="courses.csv"
      />
    </div>
  );
}
