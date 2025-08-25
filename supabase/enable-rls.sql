
-- Enable RLS on all tables
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_addresses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_variants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cart_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wishlist ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.shipping ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.returns ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.stock_notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_audit_log ENABLE ROW LEVEL SECURITY;

-- Helper function to get user role
CREATE OR REPLACE FUNCTION public.get_user_role(user_uuid uuid)
RETURNS text
LANGUAGE sql
SECURITY DEFINER
AS $$
  SELECT role FROM public.users WHERE id = user_uuid::text;
$$;

-- Helper function to check if user is admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.users 
    WHERE id = auth.uid()::text 
    AND role = 'admin'
  );
$$;

-- Helper function to check if user is seller
CREATE OR REPLACE FUNCTION public.is_seller()
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.users 
    WHERE id = auth.uid()::text 
    AND role IN ('seller', 'admin')
  );
$$;

-- Public read policies for product catalog
CREATE POLICY "Allow public read access to categories" ON public.categories
    FOR SELECT USING (true);

CREATE POLICY "Allow public read access to products" ON public.products
    FOR SELECT USING (status = 'active');

CREATE POLICY "Allow public read access to product_images" ON public.product_images
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.products 
            WHERE products.id = product_images.product_id 
            AND products.status = 'active'
        )
    );

CREATE POLICY "Allow public read access to product_variants" ON public.product_variants
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.products 
            WHERE products.id = product_variants.product_id 
            AND products.status = 'active'
        )
    );

CREATE POLICY "Allow public read access to approved reviews" ON public.product_reviews
    FOR SELECT USING (is_approved = true);

-- User management policies
CREATE POLICY "Users can view their own profile" ON public.users
    FOR SELECT USING (auth.uid()::text = id);

CREATE POLICY "Users can update their own profile" ON public.users
    FOR UPDATE USING (auth.uid()::text = id);

CREATE POLICY "Admins can view all users" ON public.users
    FOR SELECT USING (is_admin());

CREATE POLICY "Admins can update user roles" ON public.users
    FOR UPDATE USING (is_admin());

-- Address policies
CREATE POLICY "Users can manage their own addresses" ON public.user_addresses
    FOR ALL USING (auth.uid()::text = user_id);

-- Category management (admin only)
CREATE POLICY "Admins can manage categories" ON public.categories
    FOR ALL USING (is_admin());

-- Product management policies
CREATE POLICY "Sellers can view all their products" ON public.products
    FOR SELECT USING (
        auth.uid()::text = seller_id OR 
        is_admin() OR 
        status = 'active'
    );

CREATE POLICY "Sellers can create products" ON public.products
    FOR INSERT WITH CHECK (
        auth.uid()::text = seller_id AND 
        is_seller()
    );

CREATE POLICY "Sellers can update their own products" ON public.products
    FOR UPDATE USING (
        auth.uid()::text = seller_id OR 
        is_admin()
    );

CREATE POLICY "Admins can delete any product" ON public.products
    FOR DELETE USING (is_admin());

-- Product images policies
CREATE POLICY "Sellers can manage their product images" ON public.product_images
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.products 
            WHERE products.id = product_images.product_id 
            AND (products.seller_id = auth.uid()::text OR is_admin())
        )
    );

-- Product variants policies
CREATE POLICY "Sellers can manage their product variants" ON public.product_variants
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.products 
            WHERE products.id = product_variants.product_id 
            AND (products.seller_id = auth.uid()::text OR is_admin())
        )
    );

-- Cart and wishlist policies
CREATE POLICY "Users can manage their own cart items" ON public.cart_items
    FOR ALL USING (auth.uid()::text = user_id);

CREATE POLICY "Users can manage their own wishlist" ON public.wishlist
    FOR ALL USING (auth.uid()::text = user_id);

-- Order policies
CREATE POLICY "Users can view their own orders" ON public.orders
    FOR SELECT USING (
        auth.uid()::text = user_id OR 
        auth.uid()::text = seller_id OR 
        is_admin()
    );

CREATE POLICY "Users can create orders" ON public.orders
    FOR INSERT WITH CHECK (auth.uid()::text = user_id);

CREATE POLICY "Sellers and admins can update orders" ON public.orders
    FOR UPDATE USING (
        auth.uid()::text = seller_id OR 
        is_admin()
    );

-- Order items policies
CREATE POLICY "Users can view order items for their orders" ON public.order_items
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.orders 
            WHERE orders.id = order_items.order_id 
            AND (orders.user_id = auth.uid()::text OR orders.seller_id = auth.uid()::text OR is_admin())
        )
    );

CREATE POLICY "System can create order items" ON public.order_items
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.orders 
            WHERE orders.id = order_items.order_id 
            AND orders.user_id = auth.uid()::text
        )
    );

-- Payment policies
CREATE POLICY "Users can view payments for their orders" ON public.payments
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.orders 
            WHERE orders.id = payments.order_id 
            AND (orders.user_id = auth.uid()::text OR orders.seller_id = auth.uid()::text OR is_admin())
        )
    );

CREATE POLICY "Users can create payments for their orders" ON public.payments
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.orders 
            WHERE orders.id = payments.order_id 
            AND orders.user_id = auth.uid()::text
        )
    );

-- Shipping policies
CREATE POLICY "Users can view shipping for their orders" ON public.shipping
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.orders 
            WHERE orders.id = shipping.order_id 
            AND (orders.user_id = auth.uid()::text OR orders.seller_id = auth.uid()::text OR is_admin())
        )
    );

CREATE POLICY "Sellers and admins can manage shipping" ON public.shipping
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.orders 
            WHERE orders.id = shipping.order_id 
            AND (orders.seller_id = auth.uid()::text OR is_admin())
        )
    );

-- Returns policies
CREATE POLICY "Users can manage their own returns" ON public.returns
    FOR ALL USING (
        auth.uid()::text = user_id OR 
        is_admin()
    );

-- Stock notifications policies
CREATE POLICY "Users can manage their own stock notifications" ON public.stock_notifications
    FOR ALL USING (auth.uid()::text = user_id);

-- Product reviews policies
CREATE POLICY "Users can create reviews" ON public.product_reviews
    FOR INSERT WITH CHECK (auth.uid()::text = user_id);

CREATE POLICY "Users can view and update their own reviews" ON public.product_reviews
    FOR ALL USING (
        auth.uid()::text = user_id OR 
        is_admin()
    );

-- Admin audit log policies
CREATE POLICY "Admins can manage audit log" ON public.admin_audit_log
    FOR ALL USING (is_admin());
