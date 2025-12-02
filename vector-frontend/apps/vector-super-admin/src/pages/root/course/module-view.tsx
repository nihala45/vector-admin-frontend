"use client";

import React from "react";
import { useNavigate, useParams } from "react-router";
import { Button } from "@repo/ui/components/button";
import { useGetSingleModule } from "../../../apis/module.ts/Queries";
import { useDeleteTopic } from "../../../apis/topic/Mutations"; // <-- You must create this hook

export default function ModuleView() {
  const { id } = useParams(); // module ID
  const navigate = useNavigate();

  const { data: module, isLoading } = useGetSingleModule(id);

  if (isLoading) {
    return <div className="p-4 text-center">Loading Module...</div>;
  }

  if (!module) {
    return <div className="p-4 text-center text-red-500">Module not found</div>;
  }

  const handleDeleteTopic = (topicId: number) => {
    if (confirm("Are you sure you want to delete this topic?")) {
      deleteTopic.mutate(topicId);
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-6">

      {/* MODULE HEADER */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">{module.title}</h1>
            <p className="text-gray-600">{module.description}</p>
          </div>

          <img
            src={
              module.image ??
              "https://dummyimage.com/300x200/ddd/000&text=No+Image"
            }
            alt="Module"
            className="w-48 h-32 rounded-lg object-cover shadow border"
          />
        </div>

        {/* EDIT MODULE */}
        <Button
          className="mt-4"
          onClick={() => navigate(`/module/edit/${module.id}/`)}
        >
          Edit Module
        </Button>
      </div>

      {/* TOPICS SECTION */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Topics</h2>

          <Button
            onClick={() => navigate(`/module/topic/create/${module.id}`)}
          >
            + Create Topic
          </Button>
        </div>

        {module.topics?.length === 0 && (
          <p className="text-gray-500">No topics available</p>
        )}

        <div className="space-y-4">
          {module.topics?.map((topic: any) => (
            <div
              key={topic.id}
              className="flex items-center justify-between bg-gray-50 p-4 rounded-lg border"
            >
              <div>
                <h3 className="font-semibold">{topic.title}</h3>
                <p className="text-sm text-gray-600">{topic.description}</p>
              </div>

              <div className="flex gap-2">
                <Button
                  variant="secondary"
                  onClick={() => navigate(`/topic/view/${topic.id}/`)}
                >
                  View
                </Button>

                <Button
                  variant="outline"
                  onClick={() => navigate(`/topic/edit/${topic.id}`)}
                >
                  Edit
                </Button>

                <Button
                  variant="destructive"
                  onClick={() => handleDeleteTopic(topic.id)}
                >
                  Delete
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
