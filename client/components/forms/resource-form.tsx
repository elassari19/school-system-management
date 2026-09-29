'use client';

import React from 'react';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  ControllerRenderProps,
  DefaultValues,
  FieldPath,
  FieldValues,
  useForm,
} from 'react-hook-form';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import useIntlTranslations from '@/hooks/use-intl-translations';

export type ResourceFieldType = 'text' | 'number' | 'tel' | 'email' | 'date' | 'select' | 'textarea';

/** Value used by optional `select` fields — radix-ui select rejects empty values. */
export const NO_SELECTION = 'none';

export interface ResourceFieldOption {
  value: string;
  label: string;
}

export interface ResourceField<T extends FieldValues> {
  name: FieldPath<T>;
  label: string;
  type?: ResourceFieldType;
  options?: ResourceFieldOption[];
  placeholder?: string;
  className?: string;
}

interface IProps<T extends FieldValues> {
  schema: Parameters<typeof zodResolver>[0];
  fields: ResourceField<T>[];
  defaultValues: DefaultValues<T>;
  submitLabel: string;
  onSubmit: (values: T) => void | Promise<void>;
  className?: string;
}

const ResourceForm = <T extends FieldValues>({
  schema,
  fields,
  defaultValues,
  submitLabel,
  onSubmit,
  className,
}: IProps<T>) => {
  const { g } = useIntlTranslations();

  const form = useForm<T>({
    resolver: zodResolver(schema),
    defaultValues,
  });

  const { isSubmitting } = form.formState;

  const renderControl = (
    field: ResourceField<T>,
    props: ControllerRenderProps<T, FieldPath<T>>
  ) => {
    const common = {
      className: 'bg-white',
      onBlur: props.onBlur,
      ref: props.ref,
    };

    switch (field.type) {
      case 'select':
        return (
          <Select value={String(props.value ?? '')} onValueChange={props.onChange}>
            <SelectTrigger {...common}>
              <SelectValue placeholder={field.placeholder ?? field.label} />
            </SelectTrigger>
            <SelectContent>
              {field.options?.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );
      case 'textarea':
        return (
          <Textarea
            {...common}
            value={String(props.value ?? '')}
            onChange={(event) => props.onChange(event.target.value)}
          />
        );
      default:
        return (
          <Input
            {...common}
            type={field.type ?? 'text'}
            value={String(props.value ?? '')}
            onChange={(event) => props.onChange(event.target.value)}
          />
        );
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className={cn('grid gap-4', className)}>
        {fields.map((field) => (
          <FormField
            key={field.name}
            control={form.control}
            name={field.name}
            render={({ field: props }) => (
              <FormItem className={field.className}>
                <FormLabel>{field.label}</FormLabel>
                <FormControl>{renderControl(field, props)}</FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        ))}

        <div className="sticky bottom-0 right-0 bg-primary pt-4 flex gap-8 items-center justify-between">
          <Button type="submit" disabled={isSubmitting} isLoading={isSubmitting}>
            {submitLabel}
          </Button>
          <DialogPrimitive.Close asChild>
            <Button type="button" disabled={isSubmitting}>
              {g('Cancel')}
            </Button>
          </DialogPrimitive.Close>
        </div>
      </form>
    </Form>
  );
};

export default ResourceForm;
