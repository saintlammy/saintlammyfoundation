import { useState, useCallback } from 'react';
import { z } from 'zod';
import { validateInput } from '@/lib/validation';

interface ValidationState<T> {
  data: T | null;
  errors: string[];
  isValid: boolean;
  isValidating: boolean;
}

interface UseValidationReturn<T> {
  validationState: ValidationState<T>;
  validate: (data: unknown) => boolean;
  clearErrors: () => void;
  setData: (data: T) => void;
}

export function useValidation<T>(schema: z.ZodSchema<T>): UseValidationReturn<T> {
  const [validationState, setValidationState] = useState<ValidationState<T>>({
    data: null,
    errors: [],
    isValid: false,
    isValidating: false
  });

  const validate = useCallback((data: unknown): boolean => {
    setValidationState(prev => ({ ...prev, isValidating: true }));

    const result = validateInput(schema)(data);

    setValidationState({
      data: result.success ? result.data : null,
      errors: result.success ? [] : result.errors,
      isValid: result.success,
      isValidating: false
    });

    return result.success;
  }, [schema]);

  const clearErrors = useCallback(() => {
    setValidationState(prev => ({
      ...prev,
      errors: []
    }));
  }, []);

  const setData = useCallback((data: T) => {
    setValidationState(prev => ({
      ...prev,
      data,
      isValid: true,
      errors: []
    }));
  }, []);

  return {
    validationState,
    validate,
    clearErrors,
    setData
  };
}

// Field-level validation hook for individual form fields
interface UseFieldValidationReturn {
  error: string | null;
  isValid: boolean;
  validate: (value: unknown) => boolean;
  clearError: () => void;
}

export function useFieldValidation(schema: z.ZodSchema): UseFieldValidationReturn {
  const [error, setError] = useState<string | null>(null);
  const [isValid, setIsValid] = useState(false);

  const validate = useCallback((value: unknown): boolean => {
    try {
      schema.parse(value);
      setError(null);
      setIsValid(true);
      return true;
    } catch (err) {
      if (err instanceof z.ZodError) {
        setError(err.errors[0]?.message || 'Invalid value');
      } else {
        setError('Validation failed');
      }
      setIsValid(false);
      return false;
    }
  }, [schema]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    error,
    isValid,
    validate,
    clearError
  };
}

// Real-time validation hook with debouncing
export function useRealtimeValidation<T>(
  schema: z.ZodSchema<T>,
  debounceMs: number = 300
): UseValidationReturn<T> & { validateField: (fieldName: string, value: unknown) => boolean } {
  const baseValidation = useValidation(schema);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const validateField = useCallback((fieldName: string, value: unknown): boolean => {
    try {
      // Create a partial schema for the specific field if it exists
      const fieldSchema = (schema as any).shape?.[fieldName];
      if (fieldSchema) {
        fieldSchema.parse(value);
        setFieldErrors(prev => {
          const { [fieldName]: removed, ...rest } = prev;
          return rest;
        });
        return true;
      }
      return true;
    } catch (err) {
      if (err instanceof z.ZodError) {
        setFieldErrors(prev => ({
          ...prev,
          [fieldName]: err.errors[0]?.message || 'Invalid value'
        }));
      }
      return false;
    }
  }, [schema]);

  return {
    ...baseValidation,
    validationState: {
      ...baseValidation.validationState,
      errors: [
        ...baseValidation.validationState.errors,
        ...Object.values(fieldErrors)
      ]
    },
    validateField
  };
}