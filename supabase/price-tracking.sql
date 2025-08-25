
-- Price tracking tables
CREATE TABLE public.price_history (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    product_id UUID REFERENCES public.products(id) ON DELETE CASCADE NOT NULL,
    old_price DECIMAL(10,2),
    new_price DECIMAL(10,2) NOT NULL,
    change_percentage DECIMAL(5,2),
    change_amount DECIMAL(10,2),
    reason TEXT, -- 'manual_update', 'promotion', 'market_change', etc.
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE public.price_alerts (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    product_id UUID REFERENCES public.products(id) ON DELETE CASCADE NOT NULL,
    email TEXT NOT NULL,
    target_price DECIMAL(10,2) NOT NULL,
    current_price DECIMAL(10,2) NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    notified_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_price_history_product ON public.price_history(product_id);
CREATE INDEX idx_price_history_created ON public.price_history(created_at);
CREATE INDEX idx_price_alerts_product ON public.price_alerts(product_id);
CREATE INDEX idx_price_alerts_active ON public.price_alerts(is_active);
CREATE INDEX idx_price_alerts_target ON public.price_alerts(target_price);

-- Function to automatically track price changes
CREATE OR REPLACE FUNCTION track_price_changes()
RETURNS TRIGGER AS $$
BEGIN
    -- Only track if price actually changed
    IF OLD.price IS DISTINCT FROM NEW.price THEN
        INSERT INTO public.price_history (
            product_id,
            old_price,
            new_price,
            change_percentage,
            change_amount,
            reason
        ) VALUES (
            NEW.id,
            OLD.price,
            NEW.price,
            CASE 
                WHEN OLD.price > 0 THEN ((NEW.price - OLD.price) / OLD.price) * 100
                ELSE 0
            END,
            NEW.price - OLD.price,
            'manual_update'
        );
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for automatic price tracking
CREATE TRIGGER price_change_trigger
    AFTER UPDATE ON public.products
    FOR EACH ROW
    EXECUTE FUNCTION track_price_changes();

-- RLS policies for price tracking
ALTER TABLE public.price_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.price_alerts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Price history is publicly viewable" ON public.price_history
    FOR SELECT USING (true);

CREATE POLICY "Users can view their own price alerts" ON public.price_alerts
    FOR SELECT USING (auth.uid() = user_id OR email = auth.email());

CREATE POLICY "Users can create price alerts" ON public.price_alerts
    FOR INSERT WITH CHECK (auth.uid() = user_id OR auth.uid() IS NULL);

CREATE POLICY "Users can update their own price alerts" ON public.price_alerts
    FOR UPDATE USING (auth.uid() = user_id OR email = auth.email());

CREATE POLICY "Users can delete their own price alerts" ON public.price_alerts
    FOR DELETE USING (auth.uid() = user_id OR email = auth.email());
