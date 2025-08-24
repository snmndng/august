'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { UserRole } from '@/types';
import type { Database } from '@/types/supabase';
import { supabase, getCurrentUser, getUserProfile } from '@/lib/supabase';
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
          if (event === 'SIGNED_IN' && session?.user) {
            await loadUserProfile(session.user.id);
          } else if (event === 'SIGNED_OUT') {
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
      const profile = await getUserProfile(userId);
      if (profile) {
        setUser(profile);
        setUserRole(profile.role);
      }
    } catch (error) {
      console.error('Error loading user profile:', error);
    }
  };

  // Sign in user
  const signIn = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    if (!supabase) {
      return { success: false, error: 'Supabase client not initialized' };
    }

    try {
      setIsLoading(true);
      
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
          // Use setTimeout to ensure state updates complete before redirect
          setTimeout(() => {
            router.push('/dashboard');
          }, 100);
          return { success: true };
        } catch (profileError) {
          console.error('Profile loading error:', profileError);
          // Still consider sign-in successful even if profile loading fails
          setTimeout(() => {
            router.push('/dashboard');
          }, 100);
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
    } finally {
      setIsLoading(false);
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
      setIsLoading(true);
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            first_name: firstName,
            last_name: lastName,
            phone,
          },
        },
      });

      if (error) {
        throw error;
      }

      if (data.user) {
        // Create user profile in database
        const { error: profileError } = await supabase
          .from('users')
          .insert({
            id: data.user.id,
            email: data.user.email!,
            first_name: firstName,
            last_name: lastName,
            phone: phone || null,
            role: 'customer',
            is_verified: false,
          });

        if (profileError) {
          console.error('Error creating user profile:', profileError);
          // Still return success as user was created in auth
        }

        // Load user profile and redirect to dashboard
        await loadUserProfile(data.user.id);
        router.push('/dashboard');

        return { success: true };
      }

      return { success: false, error: 'Sign up failed' };
    } catch (error) {
      console.error('Sign up error:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Sign up failed' 
      };
    } finally {
      setIsLoading(false);
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