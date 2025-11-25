// @repo/ui/custom-inputs/TextInput.js (or .tsx)
import { useState, ReactNode, useRef, forwardRef } from "react";
import { useFormContext, Controller } from "react-hook-form";
import {
  FormItem,
  FormControl,
  FormLabel,
  FormMessage,
} from "@repo/ui/components/form";
import { Input } from "@repo/ui/components/input";
import { Textarea } from "@repo/ui/components/textarea";
import { Eye, EyeOff } from "lucide-react";

type TextInputProps = {
  name: string;
  label: string;
  placeholder?: string;
  type?: "text" | "email" | "password" | "number" | "textarea" | "time" | "date";
  icon?: ReactNode;
  rows?: number;
  disabled?: boolean;     // ← ADD THIS
  readOnly?: boolean;     // ← ADD THIS
};

export const TextInput = forwardRef<HTMLInputElement, TextInputProps>(
  (
    {
      name,
      label,
      placeholder,
      type = "text",
      icon,
      rows = 3,
      disabled = false,
      readOnly = false,
    },
    ref
  ) => {
    const { control } = useFormContext();
    const [showPassword, setShowPassword] = useState(false);
    const inputRef = useRef<HTMLInputElement | null>(null);

    const isPassword = type === "password";
    const finalType = isPassword ? (showPassword ? "text" : "password") : type;

    const handleClick = () => {
      if ((type === "time" || type === "date") && inputRef.current) {
        inputRef.current.showPicker?.();
      }
    };

    return (
      <Controller
        control={control}
        name={name}
        render={({ field, fieldState }) => (
          <FormItem>
            <FormLabel>{label}</FormLabel>
            <FormControl>
              <div className="relative" onClick={handleClick}>
                {type === "textarea" ? (
                  <Textarea
                    placeholder={placeholder}
                    rows={rows}
                    {...field}
                    disabled={disabled}
                    readOnly={readOnly}
                    className={`pl-${icon ? "10" : "3"} ${disabled ? "bg-gray-100 cursor-not-allowed" : ""}`}
                  />
                ) : (
                  <Input
                    {...field}
                    ref={(el) => {
                      field.ref(el);
                      inputRef.current = el;
                      if (typeof ref === "function") ref(el);
                      else if (ref) ref.current = el;
                    }}
                    placeholder={placeholder}
                    type={finalType}
                    disabled={disabled}      // ← FORWARD
                    readOnly={readOnly}      // ← FORWARD
                    className={`h-12 pl-${icon ? "10" : "3"} ${
                      isPassword ? "pr-10" : ""
                    } ${disabled ? "bg-gray-100 cursor-not-allowed" : ""}`}
                    onChange={(e) =>
                      field.onChange(type === "number" ? e.target.valueAsNumber : e.target.value)
                    }
                  />
                )}

                {/* Left icon */}
                {icon && !disabled && (
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
                    {icon}
                  </span>
                )}

                {/* Password toggle */}
                {isPassword && !disabled && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowPassword(!showPassword);
                    }}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                )}
              </div>
            </FormControl>
            <FormMessage>{fieldState.error?.message}</FormMessage>
          </FormItem>
        )}
      />
    );
  }
);

TextInput.displayName = "TextInput";