
import { supabase } from '@/lib/supabase';

export interface UserSyncData {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  phone?: string;
}

/**
 * Ensures a user profile exists in the users table
 * This function can be called after successful authentication
 */
export const ensureUserProfile = async (userData: UserSyncData): Promise<{ success: boolean; error?: string }> => {
  try {
    // First, check if profile exists
    const { data: existingProfile, error: selectError } = await supabase
      .from('users')
      .select('id')
      .eq('id', userData.id)
      .single();

    // If profile exists, update it
    if (existingProfile && !selectError) {
      const { error: updateError } = await supabase
        .from('users')
        .update({
          email: userData.email,
          first_name: userData.first_name,
          last_name: userData.last_name,
          phone: userData.phone || null,
          updated_at: new Date().toISOString()
        })
        .eq('id', userData.id);

      if (updateError) {
        console.error('Error updating user profile:', updateError);
        return { success: false, error: updateError.message };
      }
      
      return { success: true };
    }

    // If profile doesn't exist, create it
    const { error: insertError } = await supabase
      .from('users')
      .insert({
        id: userData.id,
        email: userData.email,
        first_name: userData.first_name,
        last_name: userData.last_name,
        phone: userData.phone || null,
        role: 'customer',
        is_verified: false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      });

    if (insertError) {
      console.error('Error creating user profile:', insertError);
      return { success: false, error: insertError.message };
    }

    return { success: true };
  } catch (error) {
    console.error('Error ensuring user profile:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    };
  }
};

/**
 * Syncs user metadata from auth.users to public.users table
 */
export const syncUserFromAuth = async (authUser: any): Promise<{ success: boolean; error?: string }> => {
  const userData: UserSyncData = {
    id: authUser.id,
    email: authUser.email,
    first_name: authUser.user_metadata?.first_name || authUser.email?.split('@')[0] || 'User',
    last_name: authUser.user_metadata?.last_name || '',
    phone: authUser.user_metadata?.phone || undefined
  };

  return ensureUserProfile(userData);
};
