"use client"

import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@repo/ui/components/form"
import { useFormContext } from "react-hook-form"
import { useState } from "react"
import { Button } from "../components/button"
import { X } from "lucide-react"

export function ImageUploadInput({ name, label }) {
  const { control } = useFormContext()
  const [preview, setPreview] = useState("")

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <div>
              {preview && (
                <div className="relative w-32 h-32 mb-3">
                  <img
                    src={preview}
                    className="w-full h-full object-cover rounded-md border"
                  />
                  <Button
                    type="button"
                    className="absolute -top-2 -right-2 w-6 h-6 rounded-full p-0"
                    variant="destructive"
                    onClick={() => {
                      setPreview("")
                      field.onChange(undefined)
                    }}
                  >
                    <X className="w-3 h-3" />
                  </Button>
                </div>
              )}

              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0]
                  if (!file) return

                  setPreview(URL.createObjectURL(file))
                  field.onChange(file) // RETURN FILE (not base64)
                }}
              />
            </div>
          </FormControl>

          <FormMessage />
        </FormItem>
      )}
    />
  )
}
