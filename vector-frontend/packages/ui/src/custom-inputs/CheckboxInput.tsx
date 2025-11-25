import { useFormContext, Controller } from "react-hook-form"
import { FormItem, FormControl, FormLabel, FormMessage } from "@repo/ui/components/form"
import { Checkbox } from "@repo/ui/components/checkbox"

type CheckboxInputProps = {
  name: string
  label: string
}

export const CheckboxInput = ({ name, label }: CheckboxInputProps) => {
  const { control } = useFormContext()

  return (
    <Controller
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className="flex items-center space-x-2">
          <FormControl>
            <Checkbox checked={field.value} onCheckedChange={field.onChange} />
          </FormControl>
          <FormLabel>{label}</FormLabel>
          <FormMessage />
        </FormItem>
      )}
    />
  )
}
