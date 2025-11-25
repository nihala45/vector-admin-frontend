"use client"

import { useState } from "react"
import { useController } from "react-hook-form"
import { ChevronDown, ChevronRight, Check } from "lucide-react"
import { cn } from "../lib/utils.js"
import { Label } from "@radix-ui/react-context-menu"
import { Popover, PopoverContent, PopoverTrigger } from "../components/popover.js"
import { Button } from "../components/button.js"

export interface TreeOption {
  value: string
  label: string
  children?: TreeOption[]
}

interface TreeSelectInputProps {
  name: string
  label: string
  options: TreeOption[]
  placeholder?: string
  control: any
  onChange?: (value: string) => void // Added optional onChange prop
}

function TreeNode({
  option,
  selectedValue,
  onSelect,
  level = 0,
}: {
  option: TreeOption
  selectedValue: string | undefined
  onSelect: (value: string) => void
  level?: number
}) {
  const [isExpanded, setIsExpanded] = useState(false)
  const hasChildren = option.children && option.children.length > 0
  const isSelected = selectedValue === option.value

  return (
    <div>
      <div
        className={cn(
          "flex items-center gap-2 px-2 py-1.5 text-sm cursor-pointer hover:bg-accent rounded-sm",
          isSelected && "bg-accent text-accent-foreground",
        )}
        style={{ paddingLeft: `${level * 16 + 8}px` }}
        onClick={() => {
          if (hasChildren) {
            setIsExpanded(!isExpanded)
          } else {
            onSelect(option.value)
          }
        }}
      >
        {hasChildren ? (
          isExpanded ? (
            <ChevronDown className="h-4 w-4 text-muted-foreground" />
          ) : (
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
          )
        ) : (
          <div className="w-4" />
        )}

        <span className="flex-1">{option.label}</span>

        {isSelected && <Check className="h-4 w-4" />}
      </div>

      {hasChildren && isExpanded && (
        <div>
          {option.children!.map((child) => (
            <TreeNode
              key={child.value}
              option={child}
              selectedValue={selectedValue}
              onSelect={onSelect}
              level={level + 1}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export function TreeSelectInput({
  name,
  label,
  options,
  placeholder = "Select an option...",
  control,
  onChange, // Destructure the onChange prop
}: TreeSelectInputProps) {
  const [open, setOpen] = useState(false)
  const { field, fieldState } = useController({ name, control })

  const findOptionByValue = (options: TreeOption[], value: string): TreeOption | null => {
    for (const option of options) {
      if (option.value === value) return option
      if (option.children) {
        const found = findOptionByValue(option.children, value)
        if (found) return found
      }
    }
    return null
  }

  const selectedOption = field.value ? findOptionByValue(options, field.value) : null

  const handleSelect = (value: string) => {
    field.onChange(value)
    // Call the external onChange callback if provided
    if (onChange) {
      onChange(value)
    }
    setOpen(false)
  }

  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between bg-transparent"
          >
            {selectedOption ? selectedOption.label : placeholder}
            <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0" align="start">
          <div className="max-h-60 overflow-auto p-1">
            {options.map((option) => (
              <TreeNode key={option.value} option={option} selectedValue={field.value} onSelect={handleSelect} />
            ))}
          </div>
        </PopoverContent>
      </Popover>
      {fieldState.error && <p className="text-sm text-red-500">{fieldState.error.message}</p>}
    </div>
  )
}