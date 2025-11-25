"use client"

import * as React from "react"
import { Controller, useFormContext } from "react-hook-form"
import { ChevronsUpDown, Check, X } from "lucide-react"
import { cn } from "@repo/ui/lib/utils"
import { Button } from "@repo/ui/components/button"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@repo/ui/components/popover"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@repo/ui/components/command"
import { Badge } from "@repo/ui/components/badge"

type Option = {
  label: string
  value: string
}

interface MultiSelectProps {
  name: string
  label?: string
  options: Option[]
  placeholder?: string
  className?: string
}

export function MultiSelect({
  name,
  label,
  options,
  placeholder = "Select options...",
  className,
}: MultiSelectProps) {
  const { control } = useFormContext()
  const [open, setOpen] = React.useState(false)

  return (
    <div className="flex flex-col space-y-1">
      {label && (
        <label className="text-sm font-medium text-gray-700">{label}</label>
      )}
      <Controller
        name={name}
        control={control}
        defaultValue={[]}
        render={({ field }) => {
          const toggleOption = (val: string) => {
            if (field.value?.includes(val)) {
              field.onChange(field.value.filter((v: string) => v !== val))
            } else {
              field.onChange([...(field.value || []), val])
            }
          }

          const removeOption = (val: string, e: React.MouseEvent) => {
            e.stopPropagation()
            field.onChange(field.value.filter((v: string) => v !== val))
          }

          const selectedOptions = options.filter(opt => field.value?.includes(opt.value))

          return (
            <div className="space-y-2 ">
              <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    className={cn(
                      "w-full justify-between",
                      !field.value?.length && "text-muted-foreground",
                      className
                    )}
                  >
                    <span className="truncate">
                      {field.value?.length
                        ? `${field.value.length} selected`
                        : placeholder}
                    </span>
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[600px] p-0">
                  <Command>
                    <CommandInput placeholder="Search..." />
                    <CommandList>
                      <CommandEmpty>No results found.</CommandEmpty>
                      <CommandGroup>
                        {options.map((opt) => (
                          <CommandItem
                            key={opt.value}
                            onSelect={() => toggleOption(opt.value)}
                          >
                            <Check
                              className={cn(
                                "mr-2 h-4 w-4",
                                field.value?.includes(opt.value)
                                  ? "opacity-100"
                                  : "opacity-0"
                              )}
                            />
                            {opt.label}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>

              {selectedOptions.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {selectedOptions.map((opt) => (
                    <Badge
                      key={opt.value}
                      variant="secondary"
                      className="flex items-center gap-1 px-2 py-1"
                    >
                      {opt.label}
                      <X
                        className="h-3 w-3 cursor-pointer hover:opacity-70"
                        onClick={(e) => removeOption(opt.value, e)}
                      />
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          )
        }}
      />
    </div>
  )
}