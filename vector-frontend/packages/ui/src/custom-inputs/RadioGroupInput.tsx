import { useFormContext, Controller } from "react-hook-form"
import { FormItem, FormControl, FormLabel, FormMessage } from "@repo/ui/components/form"
import { RadioGroup, RadioGroupItem } from "@repo/ui/components/radio-group"

type RadioGroupInputProps = {
  name: string
  label: string
  options: { label: string; value: string }[]
}

export const RadioGroupInput = ({ name, label, options }: RadioGroupInputProps) => {
  const { control } = useFormContext()

  return (
    <Controller
      control={control}
      name={name}
      render={({ field ,fieldState}) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <RadioGroup className="flex gap-10" value={field.value} onValueChange={field.onChange}>
              {options.map(opt => (
                <div key={opt.value} className="flex items-center space-x-2">
                  <RadioGroupItem value={opt.value} />
                  <label>{opt.label}</label>
                </div>
              ))}
            </RadioGroup>
          </FormControl>
          <FormMessage>{fieldState.error?.message}</FormMessage>
        </FormItem>
      )}
    />
  )
}
