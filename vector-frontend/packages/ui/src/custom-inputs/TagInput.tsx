"use client"

import { useState, type KeyboardEvent } from "react"
import { useController, type Control } from "react-hook-form"
import { X } from "lucide-react"

interface TagInputProps {
  name: string
  label?: string
  placeholder?: string
  control?: Control<any>
}

export function TagInput({ name, label, placeholder, control }: TagInputProps) {
  const [inputValue, setInputValue] = useState("")

  const {
    field: { value = [], onChange },
    fieldState: { error },
  } = useController({
    name,
    control,
    defaultValue: [],
  })

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault()
      addTag()
    } else if (e.key === "Backspace" && inputValue === "" && value.length > 0) {
      // Remove last tag when backspace is pressed on empty input
      const newTags = [...value]
      newTags.pop()
      onChange(newTags)
    }
  }

  const addTag = () => {
    const trimmedValue = inputValue.trim()
    if (trimmedValue && !value.includes(trimmedValue)) {
      onChange([...value, trimmedValue])
      setInputValue("")
    }
  }

  const removeTag = (tagToRemove: string) => {
    onChange(value.filter((tag: string) => tag !== tagToRemove))
  }

  return (
    <div className="space-y-2">
      {label && <label className="block text-sm font-medium text-gray-700">{label}</label>}

      <div className="min-h-[42px] w-full rounded-md border border-gray-300 bg-white px-3 py-2 focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500">
        <div className="flex flex-wrap gap-2">
          {/* Render existing tags */}
          {value.map((tag: string, index: number) => (
            <span
              key={index}
              className="inline-flex items-center gap-1 rounded-full bg-blue-100 px-2 py-1 text-sm text-blue-800"
            >
              {tag}
              <button
                type="button"
                onClick={() => removeTag(tag)}
                className="hover:bg-blue-200 rounded-full p-0.5 transition-colors"
              >
                <X size={12} />
              </button>
            </span>
          ))}

          {/* Input for new tags */}
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            onBlur={addTag}
            placeholder={value.length === 0 ? placeholder : ""}
            className="flex-1 min-w-[120px] border-none outline-none bg-transparent text-sm placeholder-gray-400"
          />
        </div>
      </div>

      {error && <p className="text-sm text-red-500">{error.message}</p>}

      <p className="text-xs text-gray-500">Press Enter or comma to add tags. Click × to remove.</p>
    </div>
  )
}