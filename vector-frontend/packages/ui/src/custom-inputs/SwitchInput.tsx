import { useFormContext, Controller } from "react-hook-form"
import { FormItem, FormControl, FormLabel, FormMessage } from "@repo/ui/components/form"
import { Switch } from "@repo/ui/components/switch"

type SwitchInputProps = {
  name: string
  label: string
}

export const SwitchInput = ({ name, label }: SwitchInputProps) => {
  const { control } = useFormContext()

  return (
    <Controller
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className="flex items-center justify-start gap-10">
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <Switch checked={field.value} onCheckedChange={field.onChange} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  )
}
