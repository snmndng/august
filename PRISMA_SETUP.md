# 🚀 Prisma Setup Guide for LuxiorMall

## ✅ What's Already Done

- ✅ Prisma installed and initialized
- ✅ Database schema created (`prisma/schema.prisma`)
- ✅ Initial migration applied
- ✅ Seed file created (`prisma/seed.ts`)
- ✅ Prisma client utility created (`lib/prisma.ts`)

## 🔧 Next Steps

### 1. Set Up Environment Variables

Create a `.env` file in your project root:

```env
# Database URL for Prisma (REQUIRED)
DATABASE_URL="postgresql://postgres:[YOUR-PASSWORD]@db.[YOUR-PROJECT-REF].supabase.co:5432/postgres"

# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://[YOUR-PROJECT-REF].supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=[YOUR-ANON-KEY]
SUPABASE_SERVICE_ROLE_KEY=[YOUR-SERVICE-ROLE-KEY]

# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_WHATSAPP_NUMBER=+254797923313
NEXT_PUBLIC_WHATSAPP_MESSAGE=Hi! I'm interested in your products.
```

### 2. Get Your Supabase Database URL

1. Go to your Supabase dashboard
2. Navigate to Settings → Database
3. Copy the "Connection string" (URI format)
4. Replace `[YOUR-PASSWORD]` with your database password
5. Replace `[YOUR-PROJECT-REF]` with your project reference

### 3. Seed Your Database

Run the seed script to populate your database with sample data:

```bash
npm run db:seed
```

This will create:
- 8 categories (Shoes, Fashion, Laptops, Electronics, etc.)
- 5 sample products with images
- 1 seller user
- Product variants (sizes)

### 4. Test Your Setup

Start your development server:

```bash
npm run dev
```

Your app should now work properly with the database!

## 🛠️ Available Prisma Commands

```bash
# Database operations
npm run db:push        # Push schema changes to database
npm run db:migrate     # Create and apply migrations
npm run db:seed        # Seed database with sample data
npm run db:studio      # Open Prisma Studio (database GUI)

# Prisma CLI commands
npx prisma generate    # Generate Prisma client
npx prisma db pull     # Pull schema from existing database
npx prisma format      # Format schema file
npx prisma validate    # Validate schema
```

## 🔄 Database Schema Changes

When you need to modify the database structure:

1. **Edit** `prisma/schema.prisma`
2. **Create migration**: `npm run db:migrate`
3. **Apply migration**: Migration is applied automatically
4. **Regenerate client**: `npx prisma generate`

## 📊 Database Models

Your schema includes:

- **Users** - Customers, sellers, admins
- **Products** - Items for sale with variants
- **Categories** - Product organization
- **Orders** - Customer purchases
- **Cart** - Shopping cart items
- **Payments** - M-Pesa and cash payments
- **Shipping** - Delivery tracking
- **Reviews** - Product ratings and comments

## 🎯 Using Prisma in Your App

### Import the client:
```typescript
import { prisma } from '@/lib/prisma'
```

### Example queries:
```typescript
// Get all active products
const products = await prisma.product.findMany({
  where: { status: 'active' },
  include: { 
    category: true,
    images: true,
    variants: true 
  }
})

// Get product by slug
const product = await prisma.product.findUnique({
  where: { slug: 'premium-leather-sneakers' },
  include: { 
    category: true,
    images: true,
    variants: true,
    reviews: true
  }
})

// Create new user
const user = await prisma.user.create({
  data: {
    email: 'user@example.com',
    firstName: 'John',
    lastName: 'Doe',
    role: 'customer'
  }
})
```

## 🚨 Troubleshooting

### "Connection failed" errors?
- Check your `DATABASE_URL` in `.env`
- Verify Supabase database is running
- Check firewall/network settings

### "Table doesn't exist" errors?
- Run `npm run db:migrate` to apply migrations
- Check that migration was successful
- Verify schema matches your database

### "Prisma client not generated" errors?
- Run `npx prisma generate`
- Restart your development server

## 🎉 Benefits of Using Prisma

- **Type Safety** - Full TypeScript support
- **Auto-completion** - IDE intellisense for all queries
- **Migrations** - Version-controlled database changes
- **Relations** - Easy to query related data
- **Validation** - Built-in data validation
- **Performance** - Optimized queries and connection pooling

## 📚 Next Steps

1. **Customize products** - Add your own products and categories
2. **User authentication** - Integrate with Supabase Auth
3. **Payment integration** - Set up M-Pesa payments
4. **Image management** - Configure Cloudinary for product images
5. **Deploy** - Deploy to production with proper environment variables

Your LuxiorMall app is now powered by Prisma! 🚀
