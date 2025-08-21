// ============================================================================
// DATABASE TYPES (Supabase auto-generated types)
// ============================================================================

import type { Database } from './supabase';

export type UserRole = 'customer' | 'seller' | 'admin';
export type OrderStatus = 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'refunded';
export type PaymentStatus = 'pending' | 'completed' | 'failed' | 'refunded';
export type PaymentMethod = 'mpesa' | 'cash_on_delivery';
export type ProductStatus = 'draft' | 'active' | 'inactive' | 'rejected';
export type ShippingStatus = 'pending' | 'in_transit' | 'delivered' | 'returned';
export type MediaType = 'image' | 'video';

// User types - using Database types from Supabase
export type AppUser = Database['public']['Tables']['users']['Row'];

export interface UserAddress {
  id: string;
  user_id: string;
  address_line_1: string;
  address_line_2?: string;
  city: string;
  state: string;
  postal_code?: string;
  country: string;
  is_default: boolean;
  created_at: string;
  updated_at: string;
}

// Category types
export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  image_url?: string;
  parent_id?: string;
  is_active: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

// Product types - simplified for components
export interface Product {
  id: string;
  seller_id: string;
  category_id?: string | null;
  name: string;
  slug: string;
  description?: string | null;
  short_description?: string | null;
  price: number;
  compare_price?: number | null;
  cost_price?: number | null;
  stock_quantity: number;
  low_stock_threshold: number;
  sku?: string | null;
  barcode?: string | null;
  weight_kg?: number | null;
  dimensions_cm?: string | null;
  status: 'draft' | 'active' | 'inactive' | 'rejected';
  is_featured: boolean;
  is_bestseller: boolean;
  meta_title?: string | null;
  meta_description?: string | null;
  tags?: string[] | null;
  created_at: string;
  updated_at: string;
}

// Database types for internal use
export interface ProductImage {
  id: string;
  product_id: string;
  image_url: string;
  alt_text?: string;
  is_primary: boolean;
  sort_order: number;
  created_at: string;
}

export interface ProductVariant {
  id: string;
  product_id: string;
  name: string;
  value: string;
  price_adjustment: number;
  stock_quantity: number;
  sku?: string;
  created_at: string;
}

export interface CartItem {
  id: string;
  user_id: string;
  product_id: string;
  variant_id?: string;
  quantity: number;
  created_at: string;
  updated_at: string;
}

// Payment types
export interface Payment {
  id: string;
  order_id: string;
  amount: number;
  currency: string;
  method: PaymentMethod;
  status: PaymentStatus;
  transaction_id?: string;
  mpesa_phone?: string;
  mpesa_reference?: string;
  gateway_response?: Record<string, any>;
  created_at: string;
  updated_at: string;
}

// Shipping types
export interface Shipping {
  id: string;
  order_id: string;
  address_id?: string;
  tracking_number?: string;
  carrier?: string;
  status: ShippingStatus;
  estimated_delivery?: string;
  actual_delivery?: string;
  shipping_cost: number;
  created_at: string;
  updated_at: string;
}

// Other types
export interface StockNotification {
  id: string;
  user_id: string;
  product_id: string;
  email: string;
  is_notified: boolean;
  created_at: string;
}

export interface ProductReview {
  id: string;
  product_id: string;
  user_id: string;
  order_id?: string;
  rating: number;
  title?: string;
  comment?: string;
  is_verified_purchase: boolean;
  is_approved: boolean;
  created_at: string;
  updated_at: string;
}

export interface WishlistItem {
  id: string;
  user_id: string;
  product_id: string;
  created_at: string;
}

// ============================================================================
// API TYPES
// ============================================================================

// M-Pesa API types
export interface MpesaPaymentRequest {
  phone: string;
  amount: number;
  reference: string;
  description: string;
}

export interface MpesaSTKPushRequest {
  BusinessShortCode: string;
  Password: string;
  Timestamp: string;
  TransactionType: string;
  Amount: number;
  PartyA: string;
  PartyB: string;
  PhoneNumber: string;
  CallBackURL: string;
  AccountReference: string;
  TransactionDesc: string;
}

export interface MpesaSTKPushResponse {
  MerchantRequestID: string;
  CheckoutRequestID: string;
  ResponseCode: string;
  ResponseDescription: string;
  CustomerMessage: string;
}

export interface MpesaCallback {
  Body: {
    stkCallback: {
      MerchantRequestID: string;
      CheckoutRequestID: string;
      ResultCode: number;
      ResultDesc: string;
      CallbackMetadata?: {
        Item: Array<{
          Name: string;
          Value: string | number;
        }>;
      };
    };
  };
}

// API Response types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// ============================================================================
// COMPONENT PROPS TYPES
// ============================================================================

export interface ProductCardProps {
  product: Product & {
    images?: ProductImage[];
    category?: Category;
    seller?: Pick<AppUser, 'id' | 'first_name' | 'last_name'>;
  };
  showActions?: boolean;
  onAddToCart?: (productId: string, quantity: number) => void;
  onAddToWishlist?: (productId: string) => void;
}

export interface CategoryCardProps {
  category: Category;
  productCount?: number;
  onClick?: () => void;
}

export interface CartItemProps {
  item: CartItem & {
    product: Product & { images?: ProductImage[] };
    variant?: ProductVariant;
  };
  onUpdateQuantity: (itemId: string, quantity: number) => void;
  onRemove: (itemId: string) => void;
}

export interface CheckoutFormProps {
  onSubmit: (data: CheckoutFormData) => void;
  isLoading?: boolean;
  cartTotal: number;
}

export interface CheckoutFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: {
    line1: string;
    line2?: string;
    city: string;
    state: string;
    postalCode?: string;
  };
  paymentMethod: PaymentMethod;
}

// ============================================================================
// STATE MANAGEMENT TYPES
// ============================================================================

export interface CartState {
  items: CartItem[];
  total: number;
  itemCount: number;
  isLoading: boolean;
}

export interface UserState {
  user: AppUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface AppState {
  cart: CartState;
  user: UserState;
  notifications: Notification[];
}

export interface Notification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
  duration?: number;
}

// ============================================================================
// FORM TYPES
// ============================================================================

export interface LoginFormData {
  email: string;
  password: string;
}

export interface RegisterFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  password: string;
  confirmPassword: string;
}

export interface ProductFormData {
  name: string;
  description: string;
  shortDescription: string;
  price: number;
  comparePrice?: number;
  categoryId: string;
  stockQuantity: number;
  sku?: string;
  tags?: string[];
  metaTitle?: string;
  metaDescription?: string;
}

// ============================================================================
// UTILITY TYPES
// ============================================================================

export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

export type RequireFields<T, K extends keyof T> = T & Required<Pick<T, K>>;

export type OptionalFields<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

export type WithId<T> = T & { id: string };

export type WithTimestamps<T> = T & {
  created_at: string;
  updated_at: string;
};

// ============================================================================
// ENVIRONMENT TYPES
// ============================================================================

export interface Environment {
  NEXT_PUBLIC_SUPABASE_URL: string;
  NEXT_PUBLIC_SUPABASE_ANON_KEY: string;
  SUPABASE_SERVICE_ROLE_KEY: string;
  NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME: string;
  CLOUDINARY_API_KEY: string;
  CLOUDINARY_API_SECRET: string;
  MPESA_CONSUMER_KEY: string;
  MPESA_CONSUMER_SECRET: string;
  MPESA_PASSKEY: string;
  MPESA_BUSINESS_SHORT_CODE: string;
  MPESA_ENVIRONMENT: 'sandbox' | 'production';
  NEXT_PUBLIC_APP_URL: string;
  NEXT_PUBLIC_WHATSAPP_NUMBER: string;
  NEXT_PUBLIC_WHATSAPP_MESSAGE: string;
}

// ============================================================================
// SEO TYPES
// ============================================================================

export interface SEOData {
  title: string;
  description: string;
  keywords?: string[];
  image?: string;
  url?: string;
  type?: 'website' | 'product' | 'category';
}

export interface ProductSEOData extends SEOData {
  type: 'product';
  price: number;
  currency: string;
  availability: 'in_stock' | 'out_of_stock' | 'preorder';
  brand?: string;
  category?: string;
}

// ============================================================================
// PWA TYPES
// ============================================================================

export interface PWAInstallPrompt {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export interface ServiceWorkerMessage {
  type: string;
  payload?: any;
}

// ============================================================================
// WHATSAPP TYPES
// ============================================================================

export interface WhatsAppMessage {
  phone: string;
  message: string;
  productId?: string;
  productName?: string;
}


