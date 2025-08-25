
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

-- Public read policies for product catalog
CREATE POLICY "Allow public read access to categories" ON public.categories
    FOR SELECT USING (true);

CREATE POLICY "Allow public read access to products" ON public.products
    FOR SELECT USING (true);

CREATE POLICY "Allow public read access to product_images" ON public.product_images
    FOR SELECT USING (true);

CREATE POLICY "Allow public read access to product_variants" ON public.product_variants
    FOR SELECT USING (true);

CREATE POLICY "Allow public read access to product_reviews" ON public.product_reviews
    FOR SELECT USING (is_approved = true);

-- User-specific policies
CREATE POLICY "Users can view their own data" ON public.users
    FOR SELECT USING (auth.uid() = id::uuid);

CREATE POLICY "Users can update their own data" ON public.users
    FOR UPDATE USING (auth.uid() = id::uuid);

CREATE POLICY "Users can view their own addresses" ON public.user_addresses
    FOR ALL USING (auth.uid() = user_id::uuid);

CREATE POLICY "Users can manage their own cart items" ON public.cart_items
    FOR ALL USING (auth.uid() = user_id::uuid);

CREATE POLICY "Users can manage their own wishlist" ON public.wishlist
    FOR ALL USING (auth.uid() = user_id::uuid);

CREATE POLICY "Users can view their own orders" ON public.orders
    FOR SELECT USING (auth.uid() = user_id::uuid);

CREATE POLICY "Users can view their own order items" ON public.order_items
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.orders 
            WHERE orders.id = order_items.order_id 
            AND orders.user_id::uuid = auth.uid()
        )
    );

CREATE POLICY "Users can view their own payments" ON public.payments
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.orders 
            WHERE orders.id = payments.order_id 
            AND orders.user_id::uuid = auth.uid()
        )
    );

CREATE POLICY "Users can view their own shipping" ON public.shipping
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.orders 
            WHERE orders.id = shipping.order_id 
            AND orders.user_id::uuid = auth.uid()
        )
    );

CREATE POLICY "Users can manage their own returns" ON public.returns
    FOR ALL USING (auth.uid() = user_id::uuid);

CREATE POLICY "Users can manage their own stock notifications" ON public.stock_notifications
    FOR ALL USING (auth.uid() = user_id::uuid);

CREATE POLICY "Users can create product reviews" ON public.product_reviews
    FOR INSERT WITH CHECK (auth.uid() = user_id::uuid);

CREATE POLICY "Users can view and update their own reviews" ON public.product_reviews
    FOR ALL USING (auth.uid() = user_id::uuid);

-- Admin policies (you'll need to implement role-based access)
-- For now, allowing service role access to admin_audit_log
CREATE POLICY "Service role can manage audit log" ON public.admin_audit_log
    FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');

-- Allow authenticated users to create orders, payments, shipping
CREATE POLICY "Authenticated users can create orders" ON public.orders
    FOR INSERT WITH CHECK (auth.uid() = user_id::uuid);

CREATE POLICY "Authenticated users can create order items" ON public.order_items
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.orders 
            WHERE orders.id = order_items.order_id 
            AND orders.user_id::uuid = auth.uid()
        )
    );

CREATE POLICY "Authenticated users can create payments" ON public.payments
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.orders 
            WHERE orders.id = payments.order_id 
            AND orders.user_id::uuid = auth.uid()
        )
    );

CREATE POLICY "Authenticated users can create shipping" ON public.shipping
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.orders 
            WHERE orders.id = shipping.order_id 
            AND orders.user_id::uuid = auth.uid()
        )
    );
