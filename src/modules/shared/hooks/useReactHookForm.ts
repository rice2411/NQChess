import { useForm, UseFormProps, UseFormReturn } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

interface UseFormOptions<T extends z.ZodType> {
  schema: T;
  defaultValues?: UseFormProps<z.infer<T>>["defaultValues"];
  mode?: UseFormProps<z.infer<T>>["mode"];
}

export function useFormWithSchema<T extends z.ZodType>({
  schema,
  defaultValues,
  mode = "onChange",
}: UseFormOptions<T>): UseFormReturn<z.infer<T>> {
  return useForm<z.infer<T>>({
    resolver: zodResolver(schema),
    defaultValues,
    mode,
  });
}
