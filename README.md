# 🛍️ LuxiorMall - Premium Ecommerce PWA

A modern, TypeScript-based ecommerce Progressive Web App built with Next.js, featuring M-Pesa payments, Cloudinary media management, and Supabase backend.

## ✨ Features

### 🎯 Core Ecommerce
- **Product Management**: Browse, search, and filter products by category
- **Shopping Cart**: Persistent cart with guest and authenticated user support
- **Checkout**: Secure M-Pesa STK Push payment integration
- **Order Management**: Complete order lifecycle tracking
- **User Roles**: Customer, Seller, and Admin with role-based access control

### 🚀 PWA Features
- **Offline Support**: Service worker for offline cart and caching
- **Installable**: Add to home screen on mobile devices
- **Responsive Design**: Mobile-first approach with modern UI/UX
- **Fast Loading**: Optimized images and performance

### 💳 Payment Integration
- **M-Pesa Daraja API**: STK Push for mobile payments
- **Currency**: Kenyan Shillings (KES)
- **Secure Transactions**: Encrypted payment processing
- **Payment Status Tracking**: Real-time payment confirmation

### 🎨 Design System
- **LuxiorMall Branding**: Consistent color scheme and typography
- **Modern UI**: Clean, premium design with smooth animations
- **Accessibility**: WCAG compliant with keyboard navigation
- **Theme Support**: Light/Dark mode with system preference detection

### 🔒 Security & Performance
- **Row Level Security**: Supabase RLS policies
- **Type Safety**: Full TypeScript implementation
- **SEO Optimized**: Structured data, meta tags, and sitemap
- **Performance**: Optimized images, lazy loading, and caching

## 🛠️ Tech Stack

- **Frontend**: Next.js 14 (App Router) + TypeScript
- **Backend**: Next.js API Routes + Supabase
- **Database**: PostgreSQL with auto-generated TypeScript types
- **Authentication**: Supabase Auth with RLS
- **Storage**: Cloudinary for media management
- **Payments**: M-Pesa Daraja API
- **Styling**: Tailwind CSS with custom design system
- **State Management**: React Context + Custom Hooks
- **Deployment**: Vercel (recommended)

## 📋 Prerequisites

- Node.js 18+ and npm/yarn
- Supabase account and project
- Cloudinary account
- M-Pesa Daraja API credentials
- Vercel account (for deployment)

## 🚀 Quick Start

### 1. Clone Repository

```bash
git clone https://github.com/yourusername/luxiormall.git
cd luxiormall
```

### 2. Install Dependencies

```bash
npm install
# or
yarn install
```

### 3. Environment Setup

Copy the environment template and fill in your credentials:

```bash
cp env.example .env.local
```

Update `.env.local` with your actual values:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Cloudinary Configuration
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

# M-Pesa Daraja API Configuration
MPESA_CONSUMER_KEY=your_mpesa_consumer_key
MPESA_CONSUMER_SECRET=your_mpesa_consumer_secret
MPESA_PASSKEY=your_mpesa_passkey
MPESA_BUSINESS_SHORT_CODE=your_business_short_code
MPESA_ENVIRONMENT=sandbox

# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_WHATSAPP_NUMBER=+254700000000
NEXT_PUBLIC_WHATSAPP_MESSAGE=Hi! I'm interested in your products.
```

### 4. Database Setup

1. **Create Supabase Project**:
   - Go to [supabase.com](https://supabase.com)
   - Create a new project
   - Get your project URL and API keys

2. **Run Database Schema**:
   - Copy the SQL from `supabase/schema.sql`
   - Run it in your Supabase SQL editor
   - This creates all tables, indexes, and RLS policies

3. **Enable Row Level Security**:
   - The schema automatically enables RLS
   - Policies are created for secure data access

### 5. Cloudinary Setup

1. **Create Cloudinary Account**:
   - Go to [cloudinary.com](https://cloudinary.com)
   - Create a free account
   - Get your cloud name, API key, and secret

2. **Create Upload Preset**:
   - Go to Settings > Upload
   - Create an unsigned upload preset named `luxiormall_unsigned`
   - Set folder to `luxiormall`

### 6. M-Pesa Setup

1. **Daraja API Access**:
   - Contact Safaricom for API access
   - Get consumer key, secret, and passkey
   - Set business short code

2. **Environment Configuration**:
   - Use `sandbox` for testing
   - Switch to `production` for live deployment

### 7. Run Development Server

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🏗️ Project Structure

```
luxiormall/
├── app/                    # Next.js App Router
│   ├── (auth)/            # Authentication routes
│   ├── (dashboard)/       # Dashboard routes
│   ├── products/          # Product routes
│   ├── cart/              # Cart routes
│   ├── checkout/          # Checkout routes
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Homepage
├── components/             # React components
│   ├── common/            # Shared components
│   ├── forms/             # Form components
│   ├── home/              # Homepage components
│   ├── layout/            # Layout components
│   └── products/          # Product components
├── contexts/               # React contexts
│   ├── AuthContext.tsx    # Authentication context
│   ├── CartContext.tsx    # Shopping cart context
│   └── ThemeContext.tsx   # Theme management context
├── lib/                    # Utility libraries
│   ├── supabase.ts        # Supabase client
│   └── utils.ts           # Helper functions
├── services/               # API services
│   ├── mpesa.ts           # M-Pesa integration
│   └── cloudinary.ts      # Cloudinary integration
├── types/                  # TypeScript type definitions
│   ├── index.ts           # Main types
│   └── supabase.ts        # Database types
├── hooks/                  # Custom React hooks
├── public/                 # Static assets
│   ├── manifest.json      # PWA manifest
│   └── icons/             # App icons
└── supabase/               # Database schema
    └── schema.sql         # Complete database setup
```

## 🔧 Configuration

### Tailwind CSS

The project uses a custom Tailwind configuration with LuxiorMall brand colors:

```javascript
// tailwind.config.js
colors: {
  luxior: {
    black: '#000000',
    white: '#ffffff',
    peach: '#ffd2aa',
    orange: '#ffa555',
    'deep-orange': '#ff7900',
  }
}
```

### PWA Configuration

PWA features are configured in:

- `next.config.js` - PWA plugin configuration
- `public/manifest.json` - App manifest
- `app/layout.tsx` - PWA meta tags

### TypeScript

Strict TypeScript configuration with:

- Path aliases for clean imports
- Strict type checking
- Auto-generated database types

## 🚀 Deployment

### Vercel (Recommended)

1. **Connect Repository**:
   - Push code to GitHub
   - Connect repository to Vercel

2. **Environment Variables**:
   - Add all environment variables in Vercel dashboard
   - Set production URLs

3. **Deploy**:
   - Vercel automatically deploys on push
   - Custom domain configuration available

### Manual Deployment

```bash
# Build the application
npm run build

# Start production server
npm start
```

## 📱 PWA Features

### Installation

Users can install LuxiorMall as a mobile app:

- **iOS**: Safari → Share → Add to Home Screen
- **Android**: Chrome → Menu → Add to Home Screen

### Offline Support

- Service worker caches essential resources
- Offline cart functionality
- Progressive enhancement

## 🔒 Security Features

### Row Level Security (RLS)

Supabase RLS policies ensure:

- Users can only access their own data
- Products are publicly viewable
- Sellers can only manage their products
- Admins have full access

### Authentication

- Secure Supabase Auth integration
- JWT token management
- Role-based access control
- Session persistence

## 📊 Performance

### Optimization

- Image optimization with Cloudinary
- Lazy loading and code splitting
- Service worker caching
- Responsive images with multiple sizes

### Monitoring

- Core Web Vitals tracking
- Performance metrics
- Error monitoring (recommended: Sentry)

## 🧪 Testing

### Development

```bash
# Type checking
npm run type-check

# Linting
npm run lint

# Build check
npm run build
```

### Testing Stack (Recommended)

- **Unit Tests**: Jest + React Testing Library
- **E2E Tests**: Playwright or Cypress
- **API Tests**: Supertest

## 📈 Analytics & SEO

### SEO Features

- Structured data (JSON-LD)
- Meta tags and Open Graph
- Sitemap generation
- Robots.txt configuration

### Analytics (Recommended)

- Google Analytics 4
- Google Search Console
- Vercel Analytics

## 🔄 Database Management

### Schema Updates

1. **Development**:
   - Modify `supabase/schema.sql`
   - Test locally with Supabase CLI

2. **Production**:
   - Run migrations in Supabase dashboard
   - Test thoroughly before deployment

### Backup & Recovery

- Supabase provides automatic backups
- Point-in-time recovery available
- Export data via Supabase dashboard

## 🚨 Troubleshooting

### Common Issues

1. **Environment Variables**:
   - Ensure all required variables are set
   - Check for typos in API keys

2. **Database Connection**:
   - Verify Supabase URL and keys
   - Check RLS policies

3. **M-Pesa Integration**:
   - Verify API credentials
   - Check callback URLs
   - Test with sandbox first

4. **PWA Issues**:
   - Clear browser cache
   - Check manifest.json
   - Verify service worker registration

### Support

- Check [Supabase Docs](https://supabase.com/docs)
- Review [Next.js Documentation](https://nextjs.org/docs)
- Consult [M-Pesa Daraja API Docs](https://developer.safaricom.co.ke)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) - React framework
- [Supabase](https://supabase.com/) - Backend as a service
- [Cloudinary](https://cloudinary.com/) - Media management
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS
- [M-Pesa](https://www.safaricom.co.ke/) - Mobile payment platform

## 📞 Support

For support and questions:

- **Email**: support@luxiormall.com
- **WhatsApp**: +254700000000
- **Documentation**: [docs.luxiormall.com](https://docs.luxiormall.com)

---

**Built with ❤️ for the Kenyan ecommerce ecosystem**
# august
