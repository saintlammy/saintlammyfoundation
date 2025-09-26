# Input Validation and Sanitization Implementation

## Overview
This document outlines the comprehensive input validation and sanitization system implemented for the Saintlammy Foundation application to enhance security and data integrity.

## Files Created/Modified

### Core Validation Library
- **`lib/validation.ts`** - Base validation utilities with Zod schemas, HTML sanitization, SQL injection prevention, and rate limiting
- **`lib/schemas.ts`** - Comprehensive form validation schemas for all application forms

### API Routes Enhanced
- **`pages/api/payments/crypto.ts`** - Added CryptoDonationSchema validation and input sanitization
- **`pages/api/payments/verify.ts`** - Added PayPal verification request validation
- **`pages/api/contact.ts`** - Created new contact form API with validation
- **`pages/api/volunteer.ts`** - Created new volunteer application API with validation

### Client-Side Hooks
- **`hooks/useValidation.ts`** - React hooks for form validation with real-time feedback
- **`hooks/useFormValidation.ts`** - Advanced form validation hook with debouncing and field-level validation

### Error Handling Components
- **`components/ErrorBoundary.tsx`** - Enhanced error boundary with specialized error boundaries for different app sections

## Key Features Implemented

### 1. Input Validation
- **Type-safe validation** using Zod schemas
- **Email validation** with sanitization and length limits
- **Phone number validation** with international format support
- **URL validation** for external links
- **Cryptocurrency address validation** with format checking
- **Amount validation** with min/max limits
- **String length validation** with customizable limits
- **Enum validation** for predefined choices

### 2. Input Sanitization
- **HTML sanitization** to prevent XSS attacks
- **SQL injection prevention** with dangerous character removal
- **Trim whitespace** from all string inputs
- **Email normalization** (lowercase conversion)
- **Special character escaping** for safe HTML output

### 3. Rate Limiting
- **Memory-based rate limiting** with configurable windows
- **Automatic cleanup** of expired entries
- **Per-identifier tracking** (IP address, user ID, etc.)
- **Configurable request limits** and time windows

### 4. Client-Side Validation Hooks
- **Real-time validation** with debouncing
- **Field-level validation** for individual form fields
- **Form-level validation** for complete form submission
- **Error state management** with detailed error messages
- **Validation state tracking** (pending, valid, invalid)

### 5. Error Boundaries
- **Page-level error boundaries** for route protection
- **Form-level error boundaries** for form-specific errors
- **Component-level error boundaries** for isolated component failures
- **Custom fallback UI** for different error types
- **Error reporting integration** ready for services like Sentry

## Security Enhancements

### XSS Prevention
- All user input is sanitized using `sanitizeHtml()` function
- HTML entities are properly escaped
- Script tags and dangerous attributes are removed

### SQL Injection Prevention
- `sanitizeSqlInput()` function removes dangerous SQL characters
- SQL comments and commands are filtered out
- Input parameterization is enforced

### CSRF Protection
- Form validation includes token verification
- Request origin validation
- Method restriction enforcement

### Rate Limiting
- Prevents brute force attacks
- Configurable request limits per time window
- Memory-efficient implementation with cleanup

## API Validation Examples

### Crypto Donation API
```typescript
// Input validation with schema
const validation = validateInput(CryptoDonationSchema)(req.body);
if (!validation.success) {
  return res.status(400).json({
    error: 'Invalid input data',
    details: validation.errors
  });
}

// Input sanitization
const sanitizedData = {
  ...donationData,
  donorName: donationData.donorName ? sanitizeHtml(donationData.donorName) : undefined,
  donorEmail: donationData.donorEmail ? sanitizeHtml(donationData.donorEmail) : undefined,
  message: donationData.message ? sanitizeHtml(donationData.message) : undefined
};
```

### Contact Form API
```typescript
// Validate using ContactFormSchema
const validation = validateInput(ContactFormSchema)(req.body);

// Sanitize all string inputs
const sanitizedData = {
  ...contactData,
  name: sanitizeHtml(contactData.name),
  email: sanitizeHtml(contactData.email),
  subject: sanitizeHtml(contactData.subject),
  message: sanitizeHtml(contactData.message)
};
```

## React Hook Usage Examples

### Basic Form Validation
```typescript
const form = useFormValidation(ContactFormSchema, {
  validateOnChange: true,
  validateOnBlur: true,
  debounceMs: 300
});

// Use in component
const handleSubmit = form.handleSubmit(async (data) => {
  // Submit validated and sanitized data
  await submitContactForm(data);
});
```

### Field-Level Validation
```typescript
const emailField = useFormField(form, 'email');

// In JSX
<input
  value={emailField.value}
  onChange={(e) => emailField.onChange(e.target.value)}
  onBlur={emailField.onBlur}
  className={emailField.hasError ? 'error' : ''}
/>
{emailField.error && <span className="error">{emailField.error}</span>}
```

## Error Boundary Usage

### Page-Level Protection
```typescript
<PageErrorBoundary>
  <YourPageComponent />
</PageErrorBoundary>
```

### Form-Level Protection
```typescript
<FormErrorBoundary>
  <YourFormComponent />
</FormErrorBoundary>
```

### Component-Level Protection
```typescript
<ComponentErrorBoundary componentName="DonationModal">
  <DonationModal />
</ComponentErrorBoundary>
```

## Configuration

### Environment Variables
- Validation schemas automatically load from environment configuration
- Rate limiting settings can be configured per environment
- Error reporting endpoints can be environment-specific

### Customization
- All validation schemas are modular and can be extended
- Sanitization functions can be customized for specific needs
- Error boundaries can be styled to match application theme

## Benefits

1. **Enhanced Security** - Protection against XSS, SQL injection, and other common attacks
2. **Data Integrity** - Ensures all data meets application requirements before processing
3. **User Experience** - Real-time validation feedback with clear error messages
4. **Developer Experience** - Type-safe validation with excellent TypeScript support
5. **Performance** - Efficient validation with debouncing and memoization
6. **Maintainability** - Centralized validation logic with reusable components
7. **Error Resilience** - Graceful error handling with recovery options

## Testing

All validation functions and hooks are designed to be easily testable:
- Unit tests for individual validation functions
- Integration tests for API endpoints
- Component tests for validation hooks
- End-to-end tests for complete form workflows

## Future Enhancements

1. **Server-side rate limiting** with Redis or database storage
2. **Advanced CAPTCHA integration** for additional bot protection
3. **Content Security Policy (CSP)** headers for additional XSS protection
4. **Input sanitization middleware** for automatic request processing
5. **Validation schema versioning** for API evolution
6. **Performance monitoring** for validation bottlenecks
7. **Advanced error reporting** integration with services like Sentry or LogRocket