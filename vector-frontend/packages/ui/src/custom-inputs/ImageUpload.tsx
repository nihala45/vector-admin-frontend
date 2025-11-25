import { useFormContext, Controller } from "react-hook-form"
import type React from "react"
import { useState, useEffect, useCallback } from "react"
import { X, Camera, ImageIcon } from "lucide-react"
import { Button } from "../components/button.js"
import { cn } from "../lib/utils.js"
import { Avatar, AvatarFallback, AvatarImage } from "../components/avatar.js"
import { FormControl, FormItem, FormLabel, FormMessage } from "../components/form.js"
import { toast } from "sonner"

type ImageUploadProps = {
  name: string
  label: string
  mode?: "single" | "multi" | "avatar"
  placeholder?: string
  size?: "sm" | "md" | "lg" | "xl"
}

const avatarSizeClasses = {
  sm: "w-16 h-16",
  md: "w-24 h-24",
  lg: "w-32 h-32",
  xl: "w-40 h-40",
}

export const ImageUploadInput = ({ name, label, mode = "single", placeholder, size = "lg" }: ImageUploadProps) => {
  const { control } = useFormContext()
  const [isDragOver, setIsDragOver] = useState(false)
  const [previewUrls, setPreviewUrls] = useState<string[]>([])



  const handleFiles = useCallback(
    async (files: FileList | null, fieldValue: any, onChange: (value: any) => void) => {
      if (!files) return

      const fileArray = Array.from(files)
      const newBlobUrls = fileArray.map((f) => URL.createObjectURL(f))
      // 🔹 Only keep files ≤ 3 MB
      const maxSize = 3 * 1024 * 1024;
      const allowedFiles = fileArray.filter((f) => {
        if (f.size > maxSize) {
          // optional: show a toast or alert for this one file
          toast(`${f.name} is larger than 3 MB and was skipped.`);
          return false;
        }
        return true;
      });

      if (allowedFiles.length === 0) return; // nothing valid

      const base64Promises = fileArray.map(
        (file) =>
          new Promise<string>((resolve) => {
            const reader = new FileReader()
            reader.onload = () => resolve(reader.result as string)
            reader.readAsDataURL(file)
          }),
      )
      const newBase64Values = await Promise.all(base64Promises)

      const base64Values: string[] = Array.isArray(fieldValue) ? fieldValue : fieldValue ? [fieldValue] : []
      const multiple = mode === "multi"

      if (multiple) {
        setPreviewUrls((prev) => [...prev, ...newBlobUrls])
        onChange([...base64Values, ...newBase64Values])
      } else {
        previewUrls.forEach((url) => {
          if (url.startsWith("blob:")) URL.revokeObjectURL(url)
        })

        if (newBlobUrls[0]) {
          setPreviewUrls([newBlobUrls[0]])
        }
        onChange(newBase64Values[0])
      }
    },
    [mode, previewUrls],
  )


  const removeImage = useCallback(
    (index: number, fieldValue: any, onChange: (value: any) => void) => {
      const base64Values: string[] = Array.isArray(fieldValue) ? fieldValue : fieldValue ? [fieldValue] : []
      const updatedPreviews = previewUrls.filter((_, i) => i !== index)
      const updatedBase64 = base64Values.filter((_, i) => i !== index)

      if (previewUrls[index] && previewUrls[index].startsWith("blob:")) {
        URL.revokeObjectURL(previewUrls[index])
      }

      setPreviewUrls(updatedPreviews)

      if (mode === "multi") {
        onChange(updatedBase64)
      } else {
        onChange("")
        setPreviewUrls([])
      }
    },
    [previewUrls, mode],
  )


  const getInitials = useCallback(() => {
    if (!placeholder) return "?"
    return placeholder
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }, [placeholder])

  useEffect(() => {
    return () => {
      previewUrls.forEach((url) => {
        if (url.startsWith("blob:")) URL.revokeObjectURL(url)
      })
    }
  }, [])

  const renderAvatarMode = (field: any, fieldState: any) => {
    const avatarUrl = previewUrls[0] || ""

    const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
      handleFiles(e.target.files, field.value, field.onChange)
    }

    return (
      <FormItem>
        <FormLabel>{label}</FormLabel>
        <FormControl>
          <div className="flex flex-col items-center gap-4">
            <div className="relative group">
              <label className="cursor-pointer">
                <Avatar
                  className={cn(
                    avatarSizeClasses[size],
                    "border-2 border-border shadow-sm transition-all hover:border-primary",
                  )}
                >
                  <AvatarImage src={avatarUrl || "/placeholder.svg"} alt="Avatar preview" />
                  <AvatarFallback className="text-lg font-medium bg-muted">{getInitials()}</AvatarFallback>
                </Avatar>

                <div className="absolute inset-0 flex items-center justify-center bg-black/60 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-200">
                  <Camera className="w-6 h-6 text-white" />
                </div>

                <input type="file" accept="image/*" onChange={handleFileInput} className="sr-only" />
              </label>

              {avatarUrl && (
                <Button
                  type="button"
                  size="icon"
                  variant="destructive"
                  className="absolute -top-2 -right-2 w-6 h-6 rounded-full shadow-sm"
                  onClick={() => removeImage(0, field.value, field.onChange)}
                >
                  <X className="w-3 h-3" />
                </Button>
              )}
            </div>
          </div>
        </FormControl>
        <FormMessage>{fieldState.error?.message}</FormMessage>
      </FormItem>
    )
  }

  const renderSingleMode = (field: any, fieldState: any) => {
    const imageUrl = previewUrls[0] || ""

    const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
      handleFiles(e.target.files, field.value, field.onChange)
    }

    const handleDrop = (e: React.DragEvent) => {
      e.preventDefault()
      setIsDragOver(false)
      handleFiles(e.dataTransfer.files, field.value, field.onChange)
    }

    const handleDragOver = (e: React.DragEvent) => {
      e.preventDefault()
      setIsDragOver(true)
    }

    const handleDragLeave = (e: React.DragEvent) => {
      e.preventDefault()
      setIsDragOver(false)
    }

    return (
      <FormItem>
        <FormLabel>{label}</FormLabel>
        <FormControl>
          <div className="space-y-4">
            {imageUrl && (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                <div className="relative group">
                  <div className="aspect-square rounded-lg overflow-hidden border-2 border-border shadow-sm">
                    <img
                      src={imageUrl || "/placeholder.svg"}
                      alt="Upload preview"
                      className="w-full h-full object-cover transition-transform group-hover:scale-105"
                    />
                  </div>
                  <Button
                    type="button"
                    size="icon"
                    variant="destructive"
                    className="absolute -top-2 -right-2 w-6 h-6 rounded-full shadow-sm opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => removeImage(0, field.value, field.onChange)}
                  >
                    <X className="w-3 h-3" />
                  </Button>
                </div>
              </div>
            )}

            <label
              className={cn(
                "relative border-2 border-dashed rounded-lg p-8 text-center transition-all duration-200 cursor-pointer block",
                isDragOver
                  ? "border-primary bg-primary/5 scale-[1.02]"
                  : "border-border hover:border-primary/50 hover:bg-muted/50",
              )}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
            >
              <div className="flex flex-col items-center gap-4">
                <div className={cn("p-4 rounded-full transition-colors", isDragOver ? "bg-primary/10" : "bg-muted")}>
                  <ImageIcon
                    className={cn("w-8 h-8 transition-colors", isDragOver ? "text-primary" : "text-muted-foreground")}
                  />
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-medium">
                    {isDragOver ? "Drop your image here" : "Click to upload or drag & drop"}
                  </p>
                  <p className="text-xs text-muted-foreground">PNG, JPG, GIF , WEBP up to 3MB</p>
                </div>
              </div>
              <input type="file" accept="image/*" onChange={handleFileInput} className="sr-only" />
            </label>
          </div>
        </FormControl>
        <FormMessage>{fieldState.error?.message}</FormMessage>
      </FormItem>
    )
  }


  const renderMultiMode = (field: any, fieldState: any) => {
    const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
      handleFiles(e.target.files, field.value, field.onChange)
    }

    const handleDrop = (e: React.DragEvent) => {
      e.preventDefault()
      setIsDragOver(false)
      handleFiles(e.dataTransfer.files, field.value, field.onChange)
    }

    const handleDragOver = (e: React.DragEvent) => {
      e.preventDefault()
      setIsDragOver(true)
    }

    const handleDragLeave = (e: React.DragEvent) => {
      e.preventDefault()
      setIsDragOver(false)
    }



    return (
      <FormItem>
        <FormLabel>{label}</FormLabel>
        <FormControl>
          <div className="space-y-4">
            {previewUrls.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {previewUrls.map((img, i) => (
                  <div key={i} className="relative group">
                    <div className="aspect-square rounded-lg overflow-hidden border-2 border-border shadow-sm">
                      <img
                        src={img || "/placeholder.svg"}
                        alt={`Upload ${i + 1}`}
                        className="w-full h-full object-cover transition-transform group-hover:scale-105"
                      />
                    </div>
                    <Button
                      type="button"
                      size="icon"
                      variant="destructive"
                      className="absolute -top-2 -right-2 w-6 h-6 rounded-full shadow-sm opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => removeImage(i, field.value, field.onChange)}
                    >
                      <X className="w-3 h-3" />
                    </Button>
                  </div>
                ))}
              </div>
            )}

            <label
              className={cn(
                "relative border-2 border-dashed rounded-lg p-8 text-center transition-all duration-200 cursor-pointer block",
                isDragOver
                  ? "border-primary bg-primary/5 scale-[1.02]"
                  : "border-border hover:border-primary/50 hover:bg-muted/50",
              )}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
            >
              <div className="flex flex-col items-center gap-4">
                <div className={cn("p-4 rounded-full transition-colors", isDragOver ? "bg-primary/10" : "bg-muted")}>
                  <ImageIcon
                    className={cn("w-8 h-8 transition-colors", isDragOver ? "text-primary" : "text-muted-foreground")}
                  />
                </div>

                <div className="space-y-2">
                  <p className="text-sm font-medium">
                    {isDragOver ? "Drop your images here" : "Click to upload or drag & drop images"}
                  </p>
                  <p className="text-xs text-muted-foreground">PNG, JPG, WEBP GIF up to 3MB each</p>
                </div>
              </div>

              <input type="file" multiple accept="image/*" onChange={handleFileInput} className="sr-only" />
            </label>
          </div>
        </FormControl>
        <FormMessage>{fieldState.error?.message}</FormMessage>
      </FormItem>
    )
  }

  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => {
        useEffect(() => {
          if (!field.value) return

          if (mode === "multi" && Array.isArray(field.value)) {
            setPreviewUrls(field.value)
          } else if (mode !== "multi" && typeof field.value === "string") {
            setPreviewUrls([field.value])
          }
        }, [field.value, mode])

        if (mode === "avatar") return renderAvatarMode(field, fieldState)
        if (mode === "single") return renderSingleMode(field, fieldState)
        if (mode === "multi") return renderMultiMode(field, fieldState)
        return null
      }}
    />
  )

}
