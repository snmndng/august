
import { NextRequest } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { UserRole } from '@/types';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

// Create service role client for server-side operations
const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

export interface AuthUser {
  id: string;
  email: string;
  role: UserRole;
}

/**
 * Get authenticated user from request
 */
export async function getAuthUser(request: NextRequest): Promise<AuthUser | null> {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return null;
    }

    const token = authHeader.substring(7);
    
    // Verify the JWT token
    const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(token);
    
    if (authError || !user) {
      return null;
    }

    // Get user profile with role
    const { data: profile, error: profileError } = await supabaseAdmin
      .from('users')
      .select('role')
      .eq('id', user.id)
      .single();

    if (profileError || !profile) {
      return null;
    }

    return {
      id: user.id,
      email: user.email!,
      role: profile.role as UserRole
    };
  } catch (error) {
    console.error('Error getting auth user:', error);
    return null;
  }
}

/**
 * Require authentication middleware
 */
export async function requireAuth(request: NextRequest): Promise<AuthUser | Response> {
  const user = await getAuthUser(request);
  
  if (!user) {
    return new Response(
      JSON.stringify({ error: 'Authentication required' }),
      { status: 401, headers: { 'Content-Type': 'application/json' } }
    );
  }

  return user;
}

/**
 * Require specific role middleware
 */
export async function requireRole(request: NextRequest, requiredRole: UserRole): Promise<AuthUser | Response> {
  const userOrResponse = await requireAuth(request);
  
  if (userOrResponse instanceof Response) {
    return userOrResponse;
  }

  const user = userOrResponse as AuthUser;

  // Admin can access everything
  if (user.role === 'admin') {
    return user;
  }

  // Check specific role
  if (user.role !== requiredRole) {
    return new Response(
      JSON.stringify({ error: `${requiredRole} role required` }),
      { status: 403, headers: { 'Content-Type': 'application/json' } }
    );
  }

  return user;
}

/**
 * Require admin role middleware
 */
export async function requireAdmin(request: NextRequest): Promise<AuthUser | Response> {
  return requireRole(request, 'admin');
}

/**
 * Require seller or admin role middleware
 */
export async function requireSeller(request: NextRequest): Promise<AuthUser | Response> {
  const userOrResponse = await requireAuth(request);
  
  if (userOrResponse instanceof Response) {
    return userOrResponse;
  }

  const user = userOrResponse as AuthUser;

  if (user.role !== 'seller' && user.role !== 'admin') {
    return new Response(
      JSON.stringify({ error: 'Seller or admin role required' }),
      { status: 403, headers: { 'Content-Type': 'application/json' } }
    );
  }

  return user;
}
