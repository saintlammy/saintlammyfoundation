import { useState, useCallback, useEffect } from 'react';
import { z } from 'zod';
import { useValidation } from './useValidation';

interface FormValidationConfig {
  validateOnChange?: boolean;
  validateOnBlur?: boolean;
  debounceMs?: number;
}

interface UseFormValidationReturn<T> {
  formData: Partial<T>;
  errors: Record<string, string>;
  isValid: boolean;
  isSubmitting: boolean;
  setValue: (field: keyof T, value: any) => void;
  setValues: (values: Partial<T>) => void;
  validateField: (field: keyof T) => boolean;
  validateForm: () => boolean;
  clearErrors: () => void;
  clearField: (field: keyof T) => void;
  handleSubmit: (onSubmit: (data: T) => void | Promise<void>) => (e?: React.FormEvent) => Promise<void>;
  reset: () => void;
}

export function useFormValidation<T extends Record<string, any>>(
  schema: z.ZodSchema<T>,
  config: FormValidationConfig = {}
): UseFormValidationReturn<T> {
  const {
    validateOnChange = false,
    validateOnBlur = true,
    debounceMs = 300
  } = config;

  const [formData, setFormData] = useState<Partial<T>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touchedFields, setTouchedFields] = useState<Set<keyof T>>(new Set());
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [debounceTimeout, setDebounceTimeout] = useState<NodeJS.Timeout | null>(null);

  const { validationState, validate } = useValidation(schema);

  const validateField = useCallback((field: keyof T): boolean => {
    try {
      const fieldSchema = (schema as any).shape?.[field];
      if (fieldSchema && formData[field] !== undefined) {
        fieldSchema.parse(formData[field]);
        setErrors(prev => {
          const { [field as string]: removed, ...rest } = prev;
          return rest;
        });
        return true;
      }
      return true;
    } catch (err) {
      if (err instanceof z.ZodError) {
        setErrors(prev => ({
          ...prev,
          [field as string]: err.errors[0]?.message || 'Invalid value'
        }));
      }
      return false;
    }
  }, [schema, formData]);

  const validateForm = useCallback((): boolean => {
    const isValid = validate(formData);

    if (!isValid) {
      const fieldErrors: Record<string, string> = {};
      validationState.errors.forEach(error => {
        const [field, message] = error.split(': ');
        if (field && message) {
          fieldErrors[field] = message;
        }
      });
      setErrors(fieldErrors);
    } else {
      setErrors({});
    }

    return isValid;
  }, [formData, validate, validationState.errors]);

  const setValue = useCallback((field: keyof T, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setTouchedFields(prev => new Set([...Array.from(prev), field]));

    if (validateOnChange || touchedFields.has(field)) {
      if (debounceMs > 0) {
        if (debounceTimeout) clearTimeout(debounceTimeout);

        const timeout = setTimeout(() => {
          validateField(field);
        }, debounceMs);

        setDebounceTimeout(timeout);
      } else {
        validateField(field);
      }
    }
  }, [validateOnChange, validateField, touchedFields, debounceMs, debounceTimeout]);

  const setValues = useCallback((values: Partial<T>) => {
    setFormData(prev => ({ ...prev, ...values }));
    Object.keys(values).forEach(key => {
      setTouchedFields(prev => new Set([...Array.from(prev), key as keyof T]));
    });
  }, []);

  const clearErrors = useCallback(() => {
    setErrors({});
  }, []);

  const clearField = useCallback((field: keyof T) => {
    setFormData(prev => {
      const newData = { ...prev };
      delete newData[field];
      return newData;
    });
    setErrors(prev => {
      const { [field as string]: removed, ...rest } = prev;
      return rest;
    });
    setTouchedFields(prev => {
      const newSet = new Set(Array.from(prev));
      newSet.delete(field);
      return newSet;
    });
  }, []);

  const handleSubmit = useCallback((onSubmit: (data: T) => void | Promise<void>) => {
    return async (e?: React.FormEvent) => {
      if (e) e.preventDefault();

      setIsSubmitting(true);

      try {
        const isValid = validateForm();

        if (isValid && validationState.data) {
          await onSubmit(validationState.data);
        }
      } catch (error) {
        console.error('Form submission error:', error);
      } finally {
        setIsSubmitting(false);
      }
    };
  }, [validateForm, validationState.data]);

  const reset = useCallback(() => {
    setFormData({});
    setErrors({});
    setTouchedFields(new Set());
    setIsSubmitting(false);
  }, []);

  // Validate field on blur if configured
  const handleBlur = useCallback((field: keyof T) => {
    if (validateOnBlur) {
      setTouchedFields(prev => new Set([...Array.from(prev), field]));
      validateField(field);
    }
  }, [validateOnBlur, validateField]);

  // Cleanup debounce timeout on unmount
  useEffect(() => {
    return () => {
      if (debounceTimeout) clearTimeout(debounceTimeout);
    };
  }, [debounceTimeout]);

  const isValid = Object.keys(errors).length === 0 && validationState.isValid;

  return {
    formData,
    errors,
    isValid,
    isSubmitting,
    setValue,
    setValues,
    validateField,
    validateForm,
    clearErrors,
    clearField,
    handleSubmit,
    reset
  };
}

// Helper hook for creating input handlers
export function useFormField<T extends Record<string, any>>(
  form: UseFormValidationReturn<T>,
  fieldName: keyof T
) {
  return {
    value: form.formData[fieldName] || '',
    error: form.errors[fieldName as string],
    onChange: (value: any) => form.setValue(fieldName, value),
    onBlur: () => form.validateField(fieldName),
    hasError: !!form.errors[fieldName as string]
  };
}