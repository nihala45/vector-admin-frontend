import { useFormContext, Controller } from "react-hook-form"
import {
  FormItem,
  FormControl,
  FormLabel,
  FormMessage,
} from "@repo/ui/components/form"
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@repo/ui/components/select"
import { Input } from "@repo/ui/components/input"
import { Search, X } from "lucide-react"
import { useState, useMemo, useRef, useEffect } from "react"

type SelectInputProps = {
  name: string
  label: string
  placeholder?: string
  options: { label: string; value: string }[]
  disabled?: boolean
}

export const SelectInput = ({
  name,
  label,
  placeholder,
  options,
  disabled = false,
}: SelectInputProps) => {
  const { control } = useFormContext()
  const [searchTerm, setSearchTerm] = useState("")
  const [isOpen, setIsOpen] = useState(false)
  const searchInputRef = useRef<HTMLInputElement>(null)

  const filteredOptions = useMemo(() => {
    if (!searchTerm) return options
    return options.filter(
      (option) =>
        option.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
        option.value.toLowerCase().includes(searchTerm.toLowerCase())
    )
  }, [options, searchTerm])

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value)
  }

  const clearSearch = () => {
    setSearchTerm("")
    searchInputRef.current?.focus()
  }

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => searchInputRef.current?.focus(), 100)
    } else {
      setSearchTerm("")
    }
  }, [isOpen])

  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <Select
              value={field.value ?? ""} // <-- FIXED
              onValueChange={(value) => field.onChange(value)} // ensure proper binding
              onOpenChange={(open) => !disabled && setIsOpen(open)}
              disabled={disabled}
            >
              <SelectTrigger
                className={`w-full py-6 ${fieldState.error ? "border-red-500 focus:ring-red-500" : ""
                  }`}
              >
                <SelectValue placeholder={placeholder} />
              </SelectTrigger>

              <SelectContent className="w-[700px] max-h-[400px] overflow-auto">
                {/* Search bar */}
                <div className="sticky top-0 z-10 bg-background p-2 border-b space-y-2">
                  <div className="relative">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      ref={searchInputRef}
                      placeholder="Search..."
                      value={searchTerm}
                      onChange={handleSearchChange}
                      className="w-full pl-8 pr-8"
                      onClick={(e) => e.stopPropagation()}
                      onKeyDown={(e) => {
                        if (e.key === "Escape") e.stopPropagation()
                      }}
                    />
                    {searchTerm && (
                      <button
                        type="button"
                        onClick={clearSearch}
                        className="absolute right-2 top-2.5 h-4 w-4 text-muted-foreground hover:text-foreground"
                      >
                        <X />
                      </button>
                    )}
                  </div>
                </div>

                {/* Options */}
                <div className="max-h-[200px] overflow-auto">
                  {filteredOptions.length > 0 ? (
                    filteredOptions.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value} className="py-2">
                        {opt.label}
                      </SelectItem>
                    ))
                  ) : (
                    <div className="p-4 text-center text-muted-foreground">
                      No options found
                    </div>
                  )}
                </div>
              </SelectContent>
            </Select>
          </FormControl>

          <FormMessage>{fieldState.error?.message}</FormMessage>
        </FormItem>
      )}
    />
  )
}
