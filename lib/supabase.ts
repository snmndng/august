import { createClient } from '@supabase/supabase-js';

// Validate required environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Check if URL is valid
const isValidUrl = (url: string | undefined): boolean => {
  if (!url) return false;
  try {
    new URL(url);
    return url.includes('supabase.co') && 
           !url.includes('your_supabase_project_url_here') &&
           !url.includes('placeholder');
  } catch {
    return false;
  }
};

const hasValidEnvVars = supabaseUrl && 
  supabaseAnonKey && 
  isValidUrl(supabaseUrl) &&
  !supabaseAnonKey.includes('your_actual');

if (!hasValidEnvVars) {
  console.warn('Missing or invalid Supabase environment variables. Using demo mode.');
}

// Create Supabase client
export const supabase = supabaseUrl && supabaseAnonKey 
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      },
    })
  : null;

// Log configuration status
if (typeof window === 'undefined') {
  // Server-side logging
  if (!supabaseUrl || !supabaseAnonKey) {
    console.warn('Supabase configuration incomplete:', {
      hasUrl: !!supabaseUrl,
      hasKey: !!supabaseAnonKey,
    });
  } else {
    console.log('Supabase client initialized successfully');
  }
}

// Helper function to get user session
export const getCurrentUser = async () => {
  if (!supabase) {
    console.warn('Supabase client not initialized - missing or invalid environment variables');
    return null;
  }

  try {
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error) throw error;
    return user;
  } catch (error) {
    console.error('Error getting current user:', error);
    return null;
  }
};

// Helper function to get user profile
export const getUserProfile = async (userId: string) => {
  if (!supabase) {
    console.warn('Supabase client not initialized - cannot get user profile');
    return null;
  }

  try {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) {
      // Handle specific error cases
      if (error.code === 'PGRST116') {
        console.warn('User profile not found for userId:', userId);
        // Attempt to create a basic profile from auth user data
        try {
          const { data: { user } } = await supabase.auth.getUser();
          if (user && user.id === userId) {
            const { data: newProfile, error: createError } = await supabase
              .from('users')
              .insert({
                id: user.id,
                email: user.email!,
                first_name: user.user_metadata?.first_name || user.email?.split('@')[0] || 'User',
                last_name: user.user_metadata?.last_name || '',
                phone: user.user_metadata?.phone || null,
                role: 'customer',
                is_verified: false,
              })
              .select()
              .single();
            
            if (createError) {
              console.error('Error creating user profile:', createError.message || createError);
              // Return a minimal profile even if DB insert fails
              return {
                id: user.id,
                email: user.email!,
                first_name: user.user_metadata?.first_name || user.email?.split('@')[0] || 'User',
                last_name: user.user_metadata?.last_name || '',
                phone: user.user_metadata?.phone || null,
                role: 'customer' as const,
                is_verified: false,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
              };
            }
            return newProfile;
          }
        } catch (createError) {
          console.error('Failed to create user profile:', createError);
        }
        return null;
      }
      console.error('Supabase error getting user profile:', error);
      throw error;
    }
    return data;
  } catch (error) {
    console.error('Error getting user profile:', error);
    return null;
  }
};

// Helper function to check if user is admin
export const isAdmin = async (userId: string): Promise<boolean> => {
  try {
    const profile = await getUserProfile(userId);
    return profile?.role === 'admin';
  } catch (error) {
    console.error('Error checking admin status:', error);
    return false;
  }
};

// Helper function to check if user is seller
export const isSeller = async (userId: string): Promise<boolean> => {
  try {
    const profile = await getUserProfile(userId);
    return profile?.role === 'seller';
  } catch (error) {
    console.error('Error checking seller status:', error);
    return false;
  }
};

// Helper function to get user role
export const getUserRole = async (userId: string): Promise<string | null> => {
  try {
    const profile = await getUserProfile(userId);
    return profile?.role || null;
  } catch (error) {
    console.error('Error getting user role:', error);
    return null;
  }
};

// Export types for use in components
export type { AppUser, UserRole } from '@/types';