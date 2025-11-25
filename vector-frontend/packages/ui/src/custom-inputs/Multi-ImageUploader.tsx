"use client"

import type React from "react"

import { useState, useRef } from "react"
import { X, Upload } from "lucide-react"
import { cn } from "../lib/utils.js"
import { Button } from "../components/button.js"

interface ImageUploaderProps {
  onImagesChange: (images: File[]) => void
  maxImages?: number
  className?: string
}

export function MultiImageUploader({ onImagesChange, maxImages = 5, className }: ImageUploaderProps) {
  const [images, setImages] = useState<File[]>([])
  const [dragActive, setDragActive] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFiles = (files: FileList | null) => {
    if (!files) return

    const newImages = Array.from(files).filter((file) => file.type.startsWith("image/"))
    const updatedImages = [...images, ...newImages].slice(0, maxImages)

    setImages(updatedImages)
    onImagesChange(updatedImages)
  }

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    handleFiles(e.dataTransfer.files)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFiles(e.target.files)
  }

  const removeImage = (index: number) => {
    const updatedImages = images.filter((_, i) => i !== index)
    setImages(updatedImages)
    onImagesChange(updatedImages)
  }

  const openFileDialog = () => {
    fileInputRef.current?.click()
  }

  return (
    <div className={cn("space-y-4", className)}>
      {/* Upload Area */}
      <div
        className={cn(
          "border-2 border-dashed rounded-lg p-6 text-center transition-colors",
          dragActive ? "border-primary bg-primary/5" : "border-muted-foreground/25 hover:border-muted-foreground/50",
        )}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={openFileDialog}
      >
        <Upload className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
        <p className="text-sm text-muted-foreground mb-1">
          <span className="font-medium text-primary cursor-pointer">Click to upload</span> or drag and drop
        </p>
        <p className="text-xs text-muted-foreground">JPG, PNG or GIF (max size 5MB)</p>

        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*"
          onChange={handleInputChange}
          className="hidden"
        />
      </div>

      {/* Uploaded Images */}
      {images.length > 0 && (
        <div className="space-y-2">
          {images.map((image, index) => (
            <div key={index} className="flex items-center gap-3 p-2 border rounded-lg">
              <img
                src={URL.createObjectURL(image) || "/placeholder.svg"}
                alt={`Upload ${index + 1}`}
                className="w-12 h-12 rounded object-cover"
              />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{image.name}</p>
                <p className="text-xs text-muted-foreground">{(image.size / 1024 / 1024).toFixed(2)} MB</p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => removeImage(index)}
                className="text-muted-foreground hover:text-destructive"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      )}

      {images.length >= maxImages && (
        <p className="text-xs text-muted-foreground text-center">Maximum {maxImages} images allowed</p>
      )}
    </div>
  )
}
