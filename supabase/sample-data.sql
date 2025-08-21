-- Insert sample products (after running the main schema.sql)
-- Make sure to replace the seller_id with an actual user ID from your auth.users table

-- First, create a sample seller user (you'll need to do this through Supabase Auth first)
-- Then use that user's ID in the seller_id field below

-- Sample products for different categories
INSERT INTO public.products (seller_id, category_id, name, slug, description, short_description, price, compare_price, stock_quantity, status, is_featured, is_bestseller, tags) VALUES
-- Shoes category
(
    (SELECT id FROM public.users WHERE role = 'seller' LIMIT 1), -- Replace with actual seller ID
    (SELECT id FROM public.categories WHERE slug = 'shoes'),
    'Premium Leather Sneakers',
    'premium-leather-sneakers',
    'High-quality leather sneakers with comfortable cushioning and stylish design. Perfect for casual and semi-formal occasions.',
    'Premium leather sneakers with comfort and style',
    89.99,
    129.99,
    50,
    'active',
    true,
    true,
    ARRAY['leather', 'sneakers', 'comfortable', 'stylish']
),
(
    (SELECT id FROM public.users WHERE role = 'seller' LIMIT 1),
    (SELECT id FROM public.categories WHERE slug = 'shoes'),
    'Running Shoes Pro',
    'running-shoes-pro',
    'Professional running shoes with advanced cushioning technology and breathable mesh upper.',
    'Professional running shoes for athletes',
    149.99,
    199.99,
    30,
    'active',
    false,
    true,
    ARRAY['running', 'athletic', 'breathable', 'cushioned']
),

-- Fashion category
(
    (SELECT id FROM public.users WHERE role = 'seller' LIMIT 1),
    (SELECT id FROM public.categories WHERE slug = 'fashion'),
    'Classic Denim Jacket',
    'classic-denim-jacket',
    'Timeless denim jacket with modern fit and durable construction. Perfect for layering in any season.',
    'Classic denim jacket with modern fit',
    79.99,
    99.99,
    25,
    'active',
    true,
    false,
    ARRAY['denim', 'jacket', 'classic', 'versatile']
),

-- Laptops category
(
    (SELECT id FROM public.users WHERE role = 'seller' LIMIT 1),
    (SELECT id FROM public.categories WHERE slug = 'laptops'),
    'Gaming Laptop Pro',
    'gaming-laptop-pro',
    'High-performance gaming laptop with RTX graphics, fast processor, and premium display for ultimate gaming experience.',
    'High-performance gaming laptop with RTX graphics',
    1299.99,
    1599.99,
    15,
    'active',
    true,
    true,
    ARRAY['gaming', 'laptop', 'RTX', 'high-performance']
),

-- Electronics category
(
    (SELECT id FROM public.users WHERE role = 'seller' LIMIT 1),
    (SELECT id FROM public.categories WHERE slug = 'electronics'),
    'Wireless Bluetooth Headphones',
    'wireless-bluetooth-headphones',
    'Premium wireless headphones with noise cancellation, long battery life, and crystal clear sound quality.',
    'Premium wireless headphones with noise cancellation',
    199.99,
    249.99,
    40,
    'active',
    false,
    true,
    ARRAY['wireless', 'bluetooth', 'noise-cancellation', 'premium']
);

-- Insert product images
INSERT INTO public.product_images (product_id, image_url, alt_text, is_primary, sort_order) VALUES
-- Images for Premium Leather Sneakers
(
    (SELECT id FROM public.products WHERE slug = 'premium-leather-sneakers'),
    'https://res.cloudinary.com/your-cloud-name/image/upload/v1/shoes/leather-sneakers-1.jpg',
    'Premium Leather Sneakers - Front View',
    true,
    1
),
(
    (SELECT id FROM public.products WHERE slug = 'premium-leather-sneakers'),
    'https://res.cloudinary.com/your-cloud-name/image/upload/v1/shoes/leather-sneakers-2.jpg',
    'Premium Leather Sneakers - Side View',
    false,
    2
),

-- Images for Running Shoes Pro
(
    (SELECT id FROM public.products WHERE slug = 'running-shoes-pro'),
    'https://res.cloudinary.com/your-cloud-name/image/upload/v1/shoes/running-shoes-1.jpg',
    'Running Shoes Pro - Front View',
    true,
    1
),

-- Images for Classic Denim Jacket
(
    (SELECT id FROM public.products WHERE slug = 'classic-denim-jacket'),
    'https://res.cloudinary.com/your-cloud-name/image/upload/v1/fashion/denim-jacket-1.jpg',
    'Classic Denim Jacket - Front View',
    true,
    1
),

-- Images for Gaming Laptop Pro
(
    (SELECT id FROM public.products WHERE slug = 'gaming-laptop-pro'),
    'https://res.cloudinary.com/your-cloud-name/image/upload/v1/laptops/gaming-laptop-1.jpg',
    'Gaming Laptop Pro - Front View',
    true,
    1
),

-- Images for Wireless Bluetooth Headphones
(
    (SELECT id FROM public.products WHERE slug = 'wireless-bluetooth-headphones'),
    'https://res.cloudinary.com/your-cloud-name/image/upload/v1/electronics/headphones-1.jpg',
    'Wireless Bluetooth Headphones - Front View',
    true,
    1
);
