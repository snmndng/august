'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { UserRole } from '@/types';
import type { Database } from '@/types/supabase';
import { supabase, getCurrentUser, getUserProfile } from '@/lib/supabase';
import { syncUserFromAuth } from '@/lib/utils/userSync';
import { useRouter } from 'next/navigation';

type AppUser = Database['public']['Tables']['users']['Row'];

interface AuthContextType {
  user: AppUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  userRole: UserRole | null;
  signIn: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signUp: (email: string, password: string, firstName: string, lastName: string, phone?: string) => Promise<{ success: boolean; error?: string }>;
  signOut: () => Promise<void>;
  updateProfile: (updates: Partial<AppUser>) => Promise<{ success: boolean; error?: string }>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps): JSX.Element {
  const [user, setUser] = useState<AppUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [userRole, setUserRole] = useState<UserRole | null>(null);
  const router = useRouter();

  // Initialize auth state
  useEffect(() => {
    const initializeAuth = async (): Promise<void> => {
      if (!supabase) {
        console.warn('Supabase client not initialized - missing environment variables');
        setIsLoading(false);
        return;
      }

      try {
        // Get current session
        const { data: { session }, error } = await supabase.auth.getSession();

        if (error) {
          console.error('Error getting session:', error);
          setIsLoading(false);
          return;
        }

        if (session?.user) {
          await loadUserProfile(session.user.id);
        }

        setIsLoading(false);
      } catch (error) {
        console.error('Error initializing auth:', error);
        setIsLoading(false);
      }
    };

    initializeAuth();

    // Listen for auth changes
    if (supabase) {
      const { data: { subscription } } = supabase.auth.onAuthStateChange(
        async (event, session) => {
          console.log('Auth state changed:', event, session?.user?.id);
          if (event === 'SIGNED_IN' && session?.user) {
            console.log('User signed in, loading profile...');
            await loadUserProfile(session.user.id);
          } else if (event === 'SIGNED_OUT') {
            console.log('User signed out');
            setUser(null);
            setUserRole(null);
          }
        }
      );

      return () => subscription.unsubscribe();
    }

    // Return empty cleanup function when supabase is null
    return () => {};
  }, []);

  // Load user profile from database
  const loadUserProfile = async (userId: string): Promise<void> => {
    try {
      console.log('Loading profile for user:', userId);
      const profile = await getUserProfile(userId);
      if (profile) {
        console.log('Profile loaded successfully:', profile);
        setUser(profile);
        setUserRole(profile.role);
      } else {
        console.warn('No profile found for user:', userId);
        // Create a basic profile from auth user if none exists
        try {
          const { data: { user: authUser } } = await supabase?.auth.getUser() || { data: { user: null } };
          if (authUser && authUser.id === userId) {
            const basicProfile = {
              id: authUser.id,
              email: authUser.email!,
              first_name: authUser.user_metadata?.first_name || authUser.email?.split('@')[0] || 'User',
              last_name: authUser.user_metadata?.last_name || '',
              phone: authUser.user_metadata?.phone || null,
              role: 'customer' as const,
              is_verified: false,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
            };
            console.log('Using basic profile:', basicProfile);
            setUser(basicProfile);
            setUserRole(basicProfile.role);
          } else {
            setUser(null);
            setUserRole(null);
          }
        } catch (fallbackError) {
          console.error('Fallback profile creation failed:', fallbackError);
          setUser(null);
          setUserRole(null);
        }
      }
    } catch (error) {
      console.error('Error loading user profile:', error);
      setUser(null);
      setUserRole(null);
    }
  };

  // Sign in user
  const signIn = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    if (!supabase) {
      return { success: false, error: 'Supabase client not initialized' };
    }

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error('Supabase auth error:', error);
        return {
          success: false,
          error: error.message || 'Authentication failed'
        };
      }

      if (data.user) {
        try {
          await loadUserProfile(data.user.id);
          return { success: true };
        } catch (profileError) {
          console.error('Profile loading error:', profileError);
          // Still consider sign-in successful even if profile loading fails
          return { success: true };
        }
      }

      return { success: false, error: 'Authentication failed - no user data received' };
    } catch (error) {
      console.error('Sign in error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Sign in failed'
      };
    }
  };

  // Sign up user
  const signUp = async (
    email: string,
    password: string,
    firstName: string,
    lastName: string,
    phone?: string
  ): Promise<{ success: boolean; error?: string }> => {
    if (!supabase) {
      return { success: false, error: 'Supabase client not initialized' };
    }

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            first_name: firstName,
            last_name: lastName,
            phone: phone,
          }
        }
      });

      if (error) {
        console.error('Supabase auth error:', error);
        return {
          success: false,
          error: error.message || 'Registration failed'
        };
      }

      if (data.user) {
        // Sync user profile to users table
        try {
          const syncResult = await syncUserFromAuth(data.user);
          if (!syncResult.success) {
            console.warn('Profile sync warning:', syncResult.error);
          }

          // Load the user profile
          await loadUserProfile(data.user.id);
          return { success: true };
        } catch (profileError) {
          console.error('Profile sync error:', profileError);
          // Still consider registration successful as auth user was created
          return { success: true };
        }
      }

      return { success: false, error: 'Registration failed - no user data received' };
    } catch (error) {
      console.error('Sign up error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Registration failed'
      };
    }
  };

  // Sign out user
  const signOut = async (): Promise<void> => {
    if (!supabase) {
      console.warn('Supabase client not initialized - cannot sign out');
      return;
    }

    try {
      setIsLoading(true);

      const { error } = await supabase.auth.signOut();

      if (error) {
        throw error;
      }

      setUser(null);
      setUserRole(null);
      router.push('/');
    } catch (error) {
      console.error('Sign out error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Update user profile
  const updateProfile = async (updates: Partial<AppUser>): Promise<{ success: boolean; error?: string }> => {
    if (!supabase) {
      return { success: false, error: 'Supabase client not initialized' };
    }

    try {
      if (!user) {
        return { success: false, error: 'No user logged in' };
      }

      const { error } = await supabase
        .from('users')
        .update(updates)
        .eq('id', user.id);

      if (error) {
        throw error;
      }

      // Refresh user data
      await refreshUser();

      return { success: true };
    } catch (error) {
      console.error('Update profile error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to update profile'
      };
    }
  };

  // Refresh user data
  const refreshUser = async (): Promise<void> => {
    try {
      const currentUser = await getCurrentUser();
      if (currentUser) {
        await loadUserProfile(currentUser.id);
      }
    } catch (error) {
      console.error('Error refreshing user:', error);
    }
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    userRole,
    signIn,
    signUp,
    signOut,
    updateProfile,
    refreshUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

// Custom hook to use auth context
export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

// Helper hooks for specific auth states
export function useIsAuthenticated(): boolean {
  const { isAuthenticated } = useAuth();
  return isAuthenticated;
}

export function useUser(): AppUser | null {
  const { user } = useAuth();
  return user;
}

export function useUserRole(): UserRole | null {
  const { userRole } = useAuth();
  return userRole;
}

export function useIsAdmin(): boolean {
  const { userRole } = useAuth();
  return userRole === 'admin';
}

export function useIsSeller(): boolean {
  const { userRole } = useAuth();
  return userRole === 'seller';
}

export function useIsCustomer(): boolean {
  const { userRole } = useAuth();
  return userRole === 'customer';
}