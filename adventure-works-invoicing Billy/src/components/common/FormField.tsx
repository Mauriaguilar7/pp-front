"use client"
import type { UseFormReturn, FieldPath, FieldValues } from "react-hook-form"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { cn } from "@/lib/utils"

interface BaseFieldProps<TFieldValues extends FieldValues> {
  form: UseFormReturn<TFieldValues>
  name: FieldPath<TFieldValues>
  label?: string
  description?: string
  required?: boolean
  className?: string
}

interface TextFieldProps<TFieldValues extends FieldValues> extends BaseFieldProps<TFieldValues> {
  type?: "text" | "email" | "password" | "number" | "tel" | "url"
  placeholder?: string
  disabled?: boolean
}

interface TextareaFieldProps<TFieldValues extends FieldValues> extends BaseFieldProps<TFieldValues> {
  placeholder?: string
  rows?: number
  disabled?: boolean
}

interface SelectFieldProps<TFieldValues extends FieldValues> extends BaseFieldProps<TFieldValues> {
  placeholder?: string
  options: { value: string; label: string }[]
  disabled?: boolean
}

interface CheckboxFieldProps<TFieldValues extends FieldValues> extends BaseFieldProps<TFieldValues> {
  disabled?: boolean
}

export function TextField<TFieldValues extends FieldValues>({
  form,
  name,
  label,
  description,
  required,
  type = "text",
  placeholder,
  disabled,
  className,
}: TextFieldProps<TFieldValues>) {
  const {
    register,
    formState: { errors },
  } = form

  const error = errors[name]

  return (
    <div className={cn("space-y-2", className)}>
      {label && (
        <Label htmlFor={name} className={required ? "after:content-['*'] after:text-destructive after:ml-1" : ""}>
          {label}
        </Label>
      )}
      <Input
        id={name}
        type={type}
        placeholder={placeholder}
        disabled={disabled}
        {...register(name, { valueAsNumber: type === "number" })}
        className={error ? "border-destructive" : ""}
      />
      {description && <p className="text-sm text-muted-foreground">{description}</p>}
      {error && <p className="text-sm text-destructive">{error.message as string}</p>}
    </div>
  )
}

export function TextareaField<TFieldValues extends FieldValues>({
  form,
  name,
  label,
  description,
  required,
  placeholder,
  rows = 3,
  disabled,
  className,
}: TextareaFieldProps<TFieldValues>) {
  const {
    register,
    formState: { errors },
  } = form

  const error = errors[name]

  return (
    <div className={cn("space-y-2", className)}>
      {label && (
        <Label htmlFor={name} className={required ? "after:content-['*'] after:text-destructive after:ml-1" : ""}>
          {label}
        </Label>
      )}
      <Textarea
        id={name}
        placeholder={placeholder}
        rows={rows}
        disabled={disabled}
        {...register(name)}
        className={error ? "border-destructive" : ""}
      />
      {description && <p className="text-sm text-muted-foreground">{description}</p>}
      {error && <p className="text-sm text-destructive">{error.message as string}</p>}
    </div>
  )
}

export function SelectField<TFieldValues extends FieldValues>({
  form,
  name,
  label,
  description,
  required,
  placeholder,
  options,
  disabled,
  className,
}: SelectFieldProps<TFieldValues>) {
  const {
    setValue,
    watch,
    formState: { errors },
  } = form

  const value = watch(name)
  const error = errors[name]

  return (
    <div className={cn("space-y-2", className)}>
      {label && (
        <Label htmlFor={name} className={required ? "after:content-['*'] after:text-destructive after:ml-1" : ""}>
          {label}
        </Label>
      )}
      <Select value={value || ""} onValueChange={(newValue) => setValue(name, newValue as any)} disabled={disabled}>
        <SelectTrigger className={error ? "border-destructive" : ""}>
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {description && <p className="text-sm text-muted-foreground">{description}</p>}
      {error && <p className="text-sm text-destructive">{error.message as string}</p>}
    </div>
  )
}

export function CheckboxField<TFieldValues extends FieldValues>({
  form,
  name,
  label,
  description,
  disabled,
  className,
}: CheckboxFieldProps<TFieldValues>) {
  const {
    setValue,
    watch,
    formState: { errors },
  } = form

  const value = watch(name)
  const error = errors[name]

  return (
    <div className={cn("space-y-2", className)}>
      <div className="flex items-center space-x-2">
        <Checkbox
          id={name}
          checked={value || false}
          onCheckedChange={(checked) => setValue(name, checked as any)}
          disabled={disabled}
        />
        {label && (
          <Label
            htmlFor={name}
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            {label}
          </Label>
        )}
      </div>
      {description && <p className="text-sm text-muted-foreground">{description}</p>}
      {error && <p className="text-sm text-destructive">{error.message as string}</p>}
    </div>
  )
}

export const FormField = {
  TextField,
  TextareaField,
  SelectField,
  CheckboxField,
}
