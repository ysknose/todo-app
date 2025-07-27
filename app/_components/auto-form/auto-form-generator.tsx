'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Form,
  FormControl,
  FormDescription,
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
import { valibotResolver } from '@hookform/resolvers/valibot';
import { Loader2, Wand2 } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import type { AutoFormGeneratorProps, FieldConfig } from './types';

// 汎用フォームジェネレーターコンポーネント
export function AutoFormGenerator<T extends Record<string, any>>({
  config,
  onSubmit,
  defaultValues,
}: AutoFormGeneratorProps<T>) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm({
    resolver: valibotResolver(config.schema),
    mode: 'onTouched' as const,
    reValidateMode: 'onChange' as const,
    defaultValues: defaultValues as any,
  });

  const handleSubmit = async (data: any) => {
    setIsSubmitting(true);
    try {
      await onSubmit(data as T);
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderField = (fieldName: keyof T, fieldConfig: FieldConfig) => {
    return (
      <FormField
        key={String(fieldName)}
        control={form.control}
        name={fieldName as any}
        render={({ field }) => (
          <FormItem>
            <FormLabel>
              {fieldConfig.label}
              {fieldConfig.required && ' *'}
            </FormLabel>
            <FormControl>
              {(() => {
                switch (fieldConfig.type) {
                  case 'text':
                    return (
                      <Input
                        placeholder={fieldConfig.placeholder}
                        {...field}
                      />
                    );
                  case 'email':
                    return (
                      <Input
                        type="email"
                        placeholder={fieldConfig.placeholder}
                        {...field}
                      />
                    );
                  case 'number':
                    return (
                      <Input
                        type="number"
                        placeholder={fieldConfig.placeholder}
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                    );
                  case 'textarea':
                    return (
                      <Textarea
                        placeholder={fieldConfig.placeholder}
                        {...field}
                      />
                    );
                  case 'select':
                    return (
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <SelectTrigger>
                          <SelectValue placeholder={fieldConfig.placeholder} />
                        </SelectTrigger>
                        <SelectContent>
                          {fieldConfig.options?.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    );
                  case 'checkbox':
                    return (
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                        <span className="text-sm">{fieldConfig.label}</span>
                      </div>
                    );
                  case 'radio':
                    return (
                      <div className="space-y-2">
                        {fieldConfig.options?.map((option) => (
                          <div key={option.value} className="flex items-center space-x-2">
                            <input
                              type="radio"
                              id={`${String(fieldName)}-${option.value}`}
                              value={option.value}
                              checked={field.value === option.value}
                              onChange={() => field.onChange(option.value)}
                              className="h-4 w-4"
                            />
                            <label
                              htmlFor={`${String(fieldName)}-${option.value}`}
                              className="text-sm"
                            >
                              {option.label}
                            </label>
                          </div>
                        ))}
                      </div>
                    );
                  default:
                    return <Input {...field} />;
                }
              })()}
            </FormControl>
            {fieldConfig.description && (
              <FormDescription>{fieldConfig.description}</FormDescription>
            )}
            <FormMessage />
          </FormItem>
        )}
      />
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Wand2 className="h-5 w-5" />
          {config.title}
        </CardTitle>
        {config.description && (
          <p className="text-sm text-gray-600">{config.description}</p>
        )}
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            {Object.entries(config.fields).map(([fieldName, fieldConfig]) =>
              renderField(fieldName as keyof T, fieldConfig)
            )}
            <Button type="submit" disabled={isSubmitting} className="w-full">
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  保存中...
                </>
              ) : (
                '保存'
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
