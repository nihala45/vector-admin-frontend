"use client";

import React from "react";
import { useParams, useNavigate } from "react-router";
import { Button } from "@repo/ui/components/button";

import { useGetTopicById } from "../../../apis/topics/Queries";
import { useDeleteVideo } from "../../../apis/vidoes/Mutations";
import { useDeletePdf } from "../../../apis/Files/Mutations";

export default function TopicView() {
  const { id: topicId } = useParams();
  const navigate = useNavigate();

  const { data: topic, isLoading } = useGetTopicById(topicId);
  const deleteVideo = useDeleteVideo();
  const deleteDocument = useDeletePdf();

  if (isLoading) {
    return <div className="p-6 text-center">Loading topic...</div>;
  }

  if (!topic) {
    return <div className="p-6 text-center text-red-500">Topic not found</div>;
  }

  // ----------------------------------
  // DELETE VIDEO
  // ----------------------------------
  const handleDeleteVideo = (id: number) => {
    if (confirm("Are you sure you want to delete this video?")) {
      deleteVideo.mutate(id);
    }
  };

  // ----------------------------------
  // DELETE DOCUMENT
  // ----------------------------------
  const handleDeleteDocument = (id: number) => {
    if (confirm("Are you sure you want to delete this document?")) {
      deleteDocument.mutate(id);
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-10">

      {/* TOPIC DETAILS */}
      <div className="bg-white shadow rounded-lg p-6 space-y-4">
        <h1 className="text-3xl font-bold">{topic.title}</h1>
        <p className="text-gray-600">{topic.description}</p>

        {topic.image && (
          <img
            src={topic.image}
            alt="Topic Image"
            className="w-60 h-40 rounded-lg object-cover border shadow"
          />
        )}

        <Button
          className="mt-4"
          onClick={() => navigate(`/topic/${topic.id}/edit`)}
        >
          Edit Topic
        </Button>
      </div>

      {/* VIDEOS SECTION */}
      <div className="bg-white shadow rounded-lg p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Videos</h2>

          <Button
            onClick={() => navigate(`/topic/video/create/${topic.id}`)}
          >
            + Add Video
          </Button>
        </div>

        {topic.videos?.length === 0 && (
          <p className="text-gray-500">No videos available</p>
        )}

        <div className="space-y-4">
          {topic.videos?.map((vid: any) => (
            <div
              key={vid.id}
              className="flex items-center justify-between p-4 bg-gray-50 border rounded-lg"
            >
              <div>
                <h3 className="font-semibold">{vid.title}</h3>
                <p className="text-sm text-gray-600">{vid.description}</p>
                <a
                  href={vid.url}
                  target="_blank"
                  className="text-blue-600 underline text-sm"
                >
                  Watch Video
                </a>
              </div>

              <div className="flex gap-2">
                <Button
                  variant="secondary"
                  onClick={() => navigate(`/video/edit/${vid.id}`)}
                >
                  Edit
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => handleDeleteVideo(vid.id)}
                >
                  Delete
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* DOCUMENTS SECTION */}
      <div className="bg-white shadow rounded-lg p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Documents</h2>

          <Button
            onClick={() => navigate(`/topic/document/create/${topic.id}`)}
          >
            + Add Document
          </Button>
        </div>

        {topic.documents?.length === 0 && (
          <p className="text-gray-500">No documents available</p>
        )}

        <div className="space-y-4">
          {topic.documents?.map((doc: any) => (
            <div
              key={doc.id}
              className="flex items-center justify-between p-4 bg-gray-50 border rounded-lg"
            >
              <div>
                <h3 className="font-semibold">{doc.title}</h3>
                <a
                  href={doc.file}
                  target="_blank"
                  className="text-blue-600 underline text-sm"
                >
                  View Document
                </a>
              </div>

              <div className="flex gap-2">
                <Button
                  variant="secondary"
                  onClick={() => navigate(`/document/edit/${doc.id}`)}
                >
                  Edit
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => handleDeleteDocument(doc.id)}
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
