# 🔐 Authentication System - Refactored & Enhanced

## Overview

The Saintlammy Foundation authentication system has been completely refactored with enhanced security, better type safety, and improved user experience. The system is built on Supabase Auth with custom role-based access control.

## 🚀 Key Features

### ✅ **Enhanced Type Safety**
- Comprehensive TypeScript interfaces for user metadata and permissions
- Strongly typed authentication functions with proper error handling
- Type-safe middleware with detailed error codes

### ✅ **Role-Based Access Control**
- **Admin**: Full system access (@saintlammyfoundation.org emails)
- **Moderator**: Limited admin functions
- **Custom Permissions**: Granular permission system

### ✅ **Security Enhancements**
- Email validation and sanitization
- Password strength requirements
- Rate limiting capabilities
- Protected API endpoints with detailed error codes
- Secure admin registration (restricted email domains)

### ✅ **Improved User Experience**
- Comprehensive signup/login pages with validation
- Password reset functionality
- Session refresh capabilities
- Detailed error messages and user feedback
- Responsive design with loading states

## 📁 File Structure

```
Authentication System/
├── contexts/
│   └── AuthContext.tsx          # Enhanced auth context with type safety
├── components/auth/
│   └── ProtectedRoute.tsx       # Advanced route protection with permissions
├── pages/admin/
│   ├── login.tsx               # Enhanced login page
│   ├── signup.tsx              # New admin registration page
│   ├── reset-password.tsx      # Password reset page
│   └── unauthorized.tsx        # Unauthorized access page
├── lib/
│   ├── authMiddleware.ts       # Enhanced API middleware
│   └── validation.ts           # Validation utilities
└── pages/api/auth/
    ├── test.ts                 # Authentication testing endpoint
    └── validate.ts             # Configuration validation
```

## 🔧 Configuration

### Environment Variables
```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key

# Optional: Enhanced security
ENCRYPTION_KEY=your-encryption-key
```

### Supabase Setup
1. **Enable Email Authentication** in Supabase Dashboard
2. **Configure Email Templates** (optional)
3. **Set up Row Level Security** on tables
4. **Create admin user** with @saintlammyfoundation.org email

## 🎯 Usage Examples

### Basic Authentication
```tsx
import { useAuth } from '@/contexts/AuthContext';

function MyComponent() {
  const { user, signIn, signOut, isAdmin } = useAuth();

  if (!user) {
    return <LoginForm />;
  }

  return (
    <div>
      <p>Welcome, {user.email}</p>
      {isAdmin && <AdminPanel />}
    </div>
  );
}
```

### Protected Routes
```tsx
import ProtectedRoute from '@/components/auth/ProtectedRoute';

function AdminPage() {
  return (
    <ProtectedRoute requireAdmin={true}>
      <AdminDashboard />
    </ProtectedRoute>
  );
}

// With custom permissions
function ModeratorPage() {
  return (
    <ProtectedRoute
      requireModerator={true}
      requiredPermissions={['content:write', 'users:read']}
    >
      <ModeratorPanel />
    </ProtectedRoute>
  );
}
```

### API Middleware
```typescript
import { withAuth } from '@/lib/authMiddleware';

async function handler(req: AuthenticatedRequest, res: NextApiResponse) {
  // req.user, req.isAdmin, req.hasPermission are available
  const { user, isAdmin } = req;

  if (!isAdmin) {
    return res.status(403).json({ error: 'Admin required' });
  }

  // Your API logic here
}

export default withAuth(handler, {
  requireAuth: true,
  requireAdmin: true,
  requiredPermissions: ['admin:write']
});
```

### Form Validation
```typescript
import { AuthValidator } from '@/lib/validation';

function SignupForm() {
  const handleSubmit = (formData) => {
    const { isValid, errors } = AuthValidator.validateSignupForm(formData);

    if (!isValid) {
      setErrors(errors);
      return;
    }

    // Proceed with signup
  };
}
```

## 🛡️ Security Features

### Password Requirements
- Minimum 8 characters
- Must contain uppercase, lowercase, and number
- Special characters recommended
- Real-time strength validation

### Email Restrictions
- Admin signup restricted to @saintlammyfoundation.org
- Email normalization and validation
- Duplicate prevention

### Session Management
- Automatic session refresh
- Secure logout with cleanup
- Session timeout handling

### API Protection
- JWT token validation
- Role-based endpoint access
- Rate limiting support
- Detailed error codes for debugging

## 🧪 Testing & Validation

### Test Authentication System
```bash
# Check configuration
curl http://localhost:3000/api/auth/validate

# Test protected endpoint (requires admin token)
curl -H "Authorization: Bearer your-jwt-token" \
     http://localhost:3000/api/auth/test
```

### Validation Endpoints
- **GET /api/auth/validate** - Check configuration
- **GET /api/auth/test** - Test authenticated endpoints
- **POST /api/auth/test** - Test Supabase integration

## 📊 User Roles & Permissions

### Admin Role
- Full system access
- User management
- System configuration
- All CRUD operations

### Moderator Role
- Content management
- User support
- Limited admin functions
- Custom permission sets

### Custom Permissions
```typescript
const permissions = [
  'content:read',
  'content:write',
  'users:read',
  'users:write',
  'donations:read',
  'donations:write',
  'analytics:read',
  'admin:read',
  'admin:write'
];
```

## 🔄 Migration from Old System

### Breaking Changes
1. **AuthContext API** - New methods and properties
2. **Middleware Parameters** - Enhanced options
3. **Protected Routes** - New prop structure

### Upgrade Steps
1. Update component imports
2. Replace old auth checks with new role system
3. Update API middleware usage
4. Test all authentication flows

## 🐛 Troubleshooting

### Common Issues

**1. Supabase Connection Failed**
```
Solution: Check NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY
```

**2. Admin Access Denied**
```
Solution: Ensure user email is @saintlammyfoundation.org or configured admin email
```

**3. Session Refresh Failed**
```
Solution: Check token expiry and refresh session manually
```

**4. TypeScript Errors**
```
Solution: Ensure proper type imports and interface usage
```

### Debug Mode
Set `NODE_ENV=development` for detailed authentication logs.

## 🔮 Future Enhancements

### Planned Features
- [ ] Two-factor authentication (2FA)
- [ ] Social media login integration
- [ ] Advanced audit logging
- [ ] Session management dashboard
- [ ] Bulk user management
- [ ] Advanced permission groups

### Performance Optimizations
- [ ] Redis-based rate limiting
- [ ] Session caching
- [ ] JWT refresh optimization
- [ ] Background user sync

## 📞 Support

### Testing Your Setup
1. Visit `/api/auth/validate` to check configuration
2. Try admin signup at `/admin/signup`
3. Test login at `/admin/login`
4. Access admin dashboard at `/admin`

### Getting Help
- **Configuration Issues**: Check environment variables
- **Access Issues**: Verify email domain restrictions
- **Technical Issues**: Check browser console and server logs

## ✅ System Status

### Current Status: **PRODUCTION READY** 🚀

- ✅ Type safety implemented
- ✅ Security enhancements complete
- ✅ User experience improved
- ✅ API protection active
- ✅ Testing endpoints available
- ✅ Documentation complete

### Integration Checklist
- [x] Supabase connection configured
- [x] Admin pages functional
- [x] Protected routes working
- [x] API middleware active
- [x] Validation system implemented
- [x] Error handling comprehensive
- [x] TypeScript compilation clean (auth-related)

The authentication system is now enterprise-ready with comprehensive security, excellent user experience, and maintainable code architecture.

---

**Built with ❤️ for Saintlammy Foundation**

*Securing access to help orphans, widows, and vulnerable communities across Nigeria.*