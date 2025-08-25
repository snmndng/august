
import { supabase } from '@/lib/supabase';
import { UserRole, AppUser } from '@/types';

export class RoleService {
  /**
   * Check if current user has specific role
   */
  static async hasRole(role: UserRole): Promise<boolean> {
    try {
      if (!supabase) return false;

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return false;

      const { data: profile } = await supabase
        .from('users')
        .select('role')
        .eq('id', user.id)
        .single();

      return profile?.role === role;
    } catch (error) {
      console.error('Error checking role:', error);
      return false;
    }
  }

  /**
   * Check if current user is admin
   */
  static async isAdmin(): Promise<boolean> {
    return this.hasRole('admin');
  }

  /**
   * Check if current user is seller or admin
   */
  static async isSeller(): Promise<boolean> {
    try {
      if (!supabase) return false;

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return false;

      const { data: profile } = await supabase
        .from('users')
        .select('role')
        .eq('id', user.id)
        .single();

      return profile?.role === 'seller' || profile?.role === 'admin';
    } catch (error) {
      console.error('Error checking seller role:', error);
      return false;
    }
  }

  /**
   * Get user role
   */
  static async getUserRole(userId?: string): Promise<UserRole | null> {
    try {
      if (!supabase) return null;

      let targetUserId = userId;
      if (!targetUserId) {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return null;
        targetUserId = user.id;
      }

      const { data: profile } = await supabase
        .from('users')
        .select('role')
        .eq('id', targetUserId)
        .single();

      return profile?.role || null;
    } catch (error) {
      console.error('Error getting user role:', error);
      return null;
    }
  }

  /**
   * Update user role (admin only)
   */
  static async updateUserRole(userId: string, newRole: UserRole): Promise<{ success: boolean; error?: string }> {
    try {
      if (!supabase) {
        return { success: false, error: 'Supabase not initialized' };
      }

      // Check if current user is admin
      const isCurrentUserAdmin = await this.isAdmin();
      if (!isCurrentUserAdmin) {
        return { success: false, error: 'Unauthorized: Only admins can update user roles' };
      }

      const { error } = await supabase
        .from('users')
        .update({ role: newRole, updated_at: new Date().toISOString() })
        .eq('id', userId);

      if (error) throw error;

      return { success: true };
    } catch (error) {
      console.error('Error updating user role:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to update user role'
      };
    }
  }

  /**
   * Get all users with their roles (admin only)
   */
  static async getAllUsers(): Promise<AppUser[]> {
    try {
      if (!supabase) return [];

      // Check if current user is admin
      const isCurrentUserAdmin = await this.isAdmin();
      if (!isCurrentUserAdmin) {
        throw new Error('Unauthorized: Only admins can view all users');
      }

      const { data, error } = await supabase
        .from('users')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      return data || [];
    } catch (error) {
      console.error('Error fetching all users:', error);
      return [];
    }
  }

  /**
   * Check if user can manage product
   */
  static async canManageProduct(productId: string): Promise<boolean> {
    try {
      if (!supabase) return false;

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return false;

      // Check if user is admin
      const isCurrentUserAdmin = await this.isAdmin();
      if (isCurrentUserAdmin) return true;

      // Check if user is the seller of this product
      const { data: product } = await supabase
        .from('products')
        .select('seller_id')
        .eq('id', productId)
        .single();

      return product?.seller_id === user.id;
    } catch (error) {
      console.error('Error checking product management permission:', error);
      return false;
    }
  }

  /**
   * Check if user can manage order
   */
  static async canManageOrder(orderId: string): Promise<boolean> {
    try {
      if (!supabase) return false;

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return false;

      // Check if user is admin
      const isCurrentUserAdmin = await this.isAdmin();
      if (isCurrentUserAdmin) return true;

      // Check if user is the seller or customer of this order
      const { data: order } = await supabase
        .from('orders')
        .select('user_id, seller_id')
        .eq('id', orderId)
        .single();

      return order?.user_id === user.id || order?.seller_id === user.id;
    } catch (error) {
      console.error('Error checking order management permission:', error);
      return false;
    }
  }
}
