import { createClient } from '@supabase/supabase-js';
import { Database } from '@/types/supabase';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Check if we're in a browser environment and have the required variables
const isClient = typeof window !== 'undefined';
const hasEnvVars = supabaseUrl && supabaseAnonKey;

if (isClient && !hasEnvVars) {
  console.warn('Missing Supabase environment variables');
}

// Create Supabase client with TypeScript types
export const supabase = hasEnvVars 
  ? createClient<Database>(supabaseUrl, supabaseAnonKey, {
      auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true,
      },
      realtime: {
        params: {
          eventsPerSecond: 10,
        },
      },
    })
  : null;

// Helper function to get user session
export const getCurrentUser = async () => {
  if (!supabase) {
    console.warn('Supabase client not initialized - missing environment variables');
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

    if (error) throw error;
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
export type { Database } from '@/types/supabase';
export type { AppUser, UserRole } from '@/types';
