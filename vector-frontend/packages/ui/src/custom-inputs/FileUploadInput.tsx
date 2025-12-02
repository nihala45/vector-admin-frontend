"use client";

import React, { useState } from "react";
import { useFormContext } from "react-hook-form";

interface FileUploadProps {
  name: string;
  label?: string;
  accept?: string; // ".pdf", ".docx", etc.
}

export function FileUploadInput({ name, label, accept }: FileUploadProps) {
  const { register, setValue, watch } = useFormContext();
  const file = watch(name);
  const [fileName, setFileName] = useState("");

  const handleFileChange = (e: any) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setValue(name, selectedFile, { shouldValidate: true });
      setFileName(selectedFile.name);
    }
  };

  return (
    <div className="space-y-1">
      {label && <p className="text-sm text-gray-700 font-medium">{label}</p>}

      <label className="cursor-pointer flex items-center justify-center w-full p-3 border rounded-lg bg-gray-50 hover:bg-gray-100 transition">
        <input
          type="file"
          accept={accept}
          {...register(name)}
          onChange={handleFileChange}
          className="hidden"
        />
        <span className="text-gray-600">
          {fileName || "Choose File"}
        </span>
      </label>

      {file && file instanceof File && (
        <p className="text-sm text-green-600">
          Selected: {file.name}
        </p>
      )}
    </div>
  );
}
