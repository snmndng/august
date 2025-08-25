
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { RoleService } from '@/lib/services/roles';
import { UserRole } from '@/types';

export function useRole() {
  const { user, userRole } = useAuth();
  
  return {
    user,
    role: userRole,
    isAdmin: userRole === 'admin',
    isSeller: userRole === 'seller' || userRole === 'admin',
    isCustomer: userRole === 'customer',
    hasRole: (role: UserRole) => userRole === role || userRole === 'admin',
  };
}

export function useRoleCheck() {
  const [isChecking, setIsChecking] = useState(false);

  const checkRole = async (role: UserRole): Promise<boolean> => {
    setIsChecking(true);
    try {
      const hasRole = await RoleService.hasRole(role);
      return hasRole;
    } catch (error) {
      console.error('Role check failed:', error);
      return false;
    } finally {
      setIsChecking(false);
    }
  };

  const checkAdmin = async (): Promise<boolean> => {
    return checkRole('admin');
  };

  const checkSeller = async (): Promise<boolean> => {
    setIsChecking(true);
    try {
      const isSeller = await RoleService.isSeller();
      return isSeller;
    } catch (error) {
      console.error('Seller check failed:', error);
      return false;
    } finally {
      setIsChecking(false);
    }
  };

  return {
    checkRole,
    checkAdmin,
    checkSeller,
    isChecking,
  };
}

export function usePermissions() {
  const { userRole } = useAuth();
  const [permissions, setPermissions] = useState({
    canManageUsers: false,
    canManageProducts: false,
    canManageOrders: false,
    canViewAnalytics: false,
    canManageCategories: false,
  });

  useEffect(() => {
    const updatePermissions = () => {
      const isAdmin = userRole === 'admin';
      const isSeller = userRole === 'seller' || userRole === 'admin';

      setPermissions({
        canManageUsers: isAdmin,
        canManageProducts: isSeller,
        canManageOrders: isSeller,
        canViewAnalytics: isSeller,
        canManageCategories: isAdmin,
      });
    };

    updatePermissions();
  }, [userRole]);

  return permissions;
}
