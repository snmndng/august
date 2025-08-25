
-- Add preorder support columns to products table
ALTER TABLE public.products 
ADD COLUMN allow_preorder BOOLEAN DEFAULT false,
ADD COLUMN preorder_limit INTEGER,
ADD COLUMN estimated_restock_date TIMESTAMP;

-- Update RLS policies to allow reading preorder fields
DROP POLICY IF EXISTS "Allow public read access to products" ON public.products;
CREATE POLICY "Allow public read access to products" ON public.products
    FOR SELECT USING (true);

-- Add some sample preorder products for testing
UPDATE public.products 
SET 
    allow_preorder = true,
    preorder_limit = 50,
    estimated_restock_date = CURRENT_DATE + INTERVAL '2 weeks'
WHERE stock_quantity = 0 AND id IN (
    SELECT id FROM public.products WHERE stock_quantity = 0 LIMIT 3
);

-- Add comment for documentation
COMMENT ON COLUMN public.products.allow_preorder IS 'Whether customers can preorder this product when out of stock';
COMMENT ON COLUMN public.products.preorder_limit IS 'Maximum number of preorders allowed (null = unlimited)';
COMMENT ON COLUMN public.products.estimated_restock_date IS 'Expected date when product will be back in stock';
