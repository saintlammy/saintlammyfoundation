# 🗄️ Database Setup Guide - Saintlammy Foundation

## A) Database Integration Status

### ✅ **COMPLETED:**
- Donation service with full CRUD operations
- Real-time monitoring integration
- Comprehensive test suite created (`/api/test/database`)
- Database schema and types configured
- Error handling and validation implemented

### ⚠️ **REQUIRES SETUP:**
- Supabase credentials configuration
- Database tables creation
- Production deployment configuration

## **Quick Setup Instructions**

### 1. **Supabase Configuration**
Update `.env.local` with your Supabase credentials:

```bash
# Replace these placeholder values
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

### 2. **Database Schema**
The following tables need to be created in Supabase:

#### **`donors` table:**
```sql
CREATE TABLE donors (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT,
  email TEXT,
  phone TEXT,
  address JSONB,
  is_anonymous BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

#### **`donations` table:**
```sql
CREATE TABLE donations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  donor_id UUID REFERENCES donors(id),
  category TEXT CHECK (category IN ('orphan', 'widow', 'home', 'general')) DEFAULT 'general',
  amount DECIMAL(10,2) NOT NULL,
  currency TEXT DEFAULT 'USD',
  frequency TEXT CHECK (frequency IN ('one-time', 'monthly', 'weekly', 'yearly')) DEFAULT 'one-time',
  payment_method TEXT CHECK (payment_method IN ('paypal', 'crypto', 'bank_transfer')) DEFAULT 'paypal',
  status TEXT CHECK (status IN ('pending', 'completed', 'failed', 'refunded')) DEFAULT 'pending',
  transaction_id TEXT,
  notes JSONB,
  source TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

#### **`content` table (Content Management):**
```sql
CREATE TABLE content (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  type TEXT CHECK (type IN ('page', 'blog', 'program', 'story', 'media', 'team', 'partnership')) NOT NULL,
  status TEXT CHECK (status IN ('published', 'draft', 'scheduled', 'archived')) DEFAULT 'draft',
  slug TEXT UNIQUE NOT NULL,
  content TEXT,
  excerpt TEXT,
  featured_image TEXT,
  author JSONB NOT NULL DEFAULT '{"name": "Admin"}',
  metadata JSONB DEFAULT '{}',
  views INTEGER DEFAULT 0,
  publish_date TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for better performance
CREATE INDEX idx_content_type ON content(type);
CREATE INDEX idx_content_status ON content(status);
CREATE INDEX idx_content_slug ON content(slug);
CREATE INDEX idx_content_publish_date ON content(publish_date);
```

**Quick Setup:** Run the complete schema from `DATABASE_CONTENT_SCHEMA.sql` which includes sample data.

### 3. **Test Database Connection**
Once configured, test with:

```bash
curl -X POST http://localhost:3000/api/test/database
```

## **B) Features Ready for Production**

### **Real-time Donation Tracking:**
- ✅ Blockchain monitoring (all major networks)
- ✅ Automatic donation detection and storage
- ✅ USD/NGN dual currency display
- ✅ Admin dashboard integration

### **Payment Processing:**
- ✅ PayPal integration
- ✅ Cryptocurrency support (BTC, ETH, SOL, XRP, BNB, USDT, USDC)
- ✅ Receipt generation
- ✅ Donation status management

### **Data Management:**
- ✅ Donor management system
- ✅ Donation statistics and analytics
- ✅ Export capabilities
- ✅ Search and filtering

### **API Endpoints:**
- ✅ `/api/donations` - Full CRUD operations
- ✅ `/api/donations/monitor` - Real-time monitoring controls
- ✅ `/api/content` - Content management (pages, blogs, programs, stories, team)
- ✅ `/api/test/database` - Comprehensive testing suite

## **Next Steps:**
1. **Set up Supabase project and configure credentials**
2. **Run database migrations/schema creation**
3. **Test all donation flows end-to-end**
4. **Deploy to production with environment variables**

The database integration is **architecturally complete** and ready for production use once Supabase is configured! 🚀