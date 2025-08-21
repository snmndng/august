# LuxiorMall Setup Guide

## 🚀 Quick Start

Your app is currently showing as HTML-only because the Supabase database isn't connected. Follow these steps to get everything working:

## 1. Environment Setup

Create a `.env.local` file in your project root:

```bash
# Create the file
touch .env.local
```

Add your Supabase credentials:

```env
# Supabase Configuration (REQUIRED)
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here

# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_WHATSAPP_NUMBER=+254797923313
NEXT_PUBLIC_WHATSAPP_MESSAGE=Hi! I'm interested in your products.

# Optional - for full functionality
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

## 2. Get Supabase Credentials

1. Go to [supabase.com](https://supabase.com) and sign in
2. Create a new project or select existing one
3. Go to Settings → API
4. Copy:
   - Project URL → `NEXT_PUBLIC_SUPABASE_URL`
   - anon/public key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - service_role key → `SUPABASE_SERVICE_ROLE_KEY`

## 3. Set Up Database

1. In your Supabase dashboard, go to SQL Editor
2. Copy the contents of `supabase/schema.sql`
3. Paste and run the SQL to create all tables
4. Copy the contents of `supabase/sample-data.sql`
5. Paste and run to add sample products

## 4. Create a Test User

1. Go to Authentication → Users in Supabase
2. Create a new user with email/password
3. Go to SQL Editor and run:

```sql
-- Update the user role to seller
UPDATE public.users 
SET role = 'seller' 
WHERE email = 'your-test-email@example.com';
```

## 5. Test Your App

1. Stop your current server (Ctrl+C)
2. Restart with: `npm run dev`
3. Your app should now show products and work properly!

## 🔧 Troubleshooting

### App shows as HTML only?
- Check that `.env.local` exists and has correct Supabase credentials
- Verify database tables were created successfully
- Check browser console for errors

### "Table not found" errors?
- Make sure you ran `supabase/schema.sql` in Supabase SQL Editor
- Verify the SQL executed without errors

### Products not showing?
- Check that sample data was inserted
- Verify products have `status = 'active'`
- Check that categories exist

## 📁 File Structure

```
luxiorMall/
├── app/                    # Next.js app directory
├── components/            # React components
├── contexts/             # React contexts (Auth, Cart)
├── lib/                  # Utility functions
├── supabase/             # Database schema and sample data
│   ├── schema.sql       # Main database schema
│   └── sample-data.sql  # Sample products and data
├── types/                # TypeScript type definitions
└── .env.local           # Environment variables (create this)
```

## 🎯 Next Steps

After setup:
1. Customize products and categories
2. Add real images (replace Cloudinary URLs)
3. Set up M-Pesa payment integration
4. Configure email notifications
5. Deploy to production

## 📞 Need Help?

If you encounter issues:
1. Check the browser console for errors
2. Verify all environment variables are set
3. Ensure database schema was applied correctly
4. Check Supabase logs for database errors

Your app should work perfectly once the database is connected! 🎉
