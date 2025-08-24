import { supabase } from '@/lib/supabase';
import type { RealtimeChannel } from '@supabase/supabase-js';

export interface ChatRoom {
  id: string;
  customer_id: string;
  agent_id?: string;
  status: 'waiting' | 'active' | 'closed';
  priority: 'low' | 'normal' | 'high' | 'urgent';
  subject?: string;
  created_at: string;
  updated_at: string;
  closed_at?: string;
}

export interface ChatMessage {
  id: string;
  room_id: string;
  sender_id: string;
  message: string;
  message_type: 'text' | 'image' | 'file' | 'system';
  file_url?: string;
  is_read: boolean;
  created_at: string;
  sender?: {
    first_name: string;
    last_name: string;
    role: string;
  };
}

export interface AgentAvailability {
  id: string;
  user_id: string;
  is_available: boolean;
  status_message?: string;
  updated_at: string;
}

class ChatService {
  private channels: Map<string, RealtimeChannel> = new Map();

  // Get agent availability
  async getAgentAvailability(): Promise<AgentAvailability[]> {
    if (!supabase) {
      throw new Error('Supabase client not initialized');
    }

    const { data, error } = await supabase
      .from('agent_availability')
      .select('*')
      .eq('is_available', true);

    if (error) {
      throw error;
    }

    return data || [];
  }

  // Update agent availability
  async updateAgentAvailability(isAvailable: boolean, statusMessage?: string): Promise<void> {
    if (!supabase) {
      throw new Error('Supabase client not initialized');
    }

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      throw new Error('User not authenticated');
    }

    const { error } = await supabase
      .from('agent_availability')
      .upsert({
        user_id: user.id,
        is_available: isAvailable,
        status_message: statusMessage,
        updated_at: new Date().toISOString(),
      });

    if (error) {
      throw error;
    }
  }

  // Create a new chat room
  async createChatRoom(subject?: string, priority: 'low' | 'normal' | 'high' | 'urgent' = 'normal'): Promise<ChatRoom | null> {
    if (!supabase) return null;

    try {
      const { data, error } = await supabase
        .from('chat_rooms')
        .insert({
          subject,
          priority,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error creating chat room:', error);
      return null;
    }
  }

  // Get user's chat rooms
  async getUserChatRooms(userId: string): Promise<ChatRoom[]> {
    if (!supabase) return [];

    try {
      const { data, error } = await supabase
        .from('chat_rooms')
        .select('*')
        .or(`customer_id.eq.${userId},agent_id.eq.${userId}`)
        .order('updated_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching chat rooms:', error);
      return [];
    }
  }

  // Get messages for a chat room
  async getRoomMessages(roomId: string): Promise<ChatMessage[]> {
    if (!supabase) return [];

    try {
      const { data, error } = await supabase
        .from('chat_messages')
        .select(`
          *,
          sender:users!chat_messages_sender_id_fkey(first_name, last_name, role)
        `)
        .eq('room_id', roomId)
        .order('created_at', { ascending: true });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching messages:', error);
      return [];
    }
  }

  // Send a message
  async sendMessage(roomId: string, message: string, messageType: 'text' | 'image' | 'file' = 'text', fileUrl?: string): Promise<ChatMessage | null> {
    if (!supabase) return null;

    try {
      const { data, error } = await supabase
        .from('chat_messages')
        .insert({
          room_id: roomId,
          message,
          message_type: messageType,
          file_url: fileUrl,
        })
        .select(`
          *,
          sender:users!chat_messages_sender_id_fkey(first_name, last_name, role)
        `)
        .single();

      if (error) throw error;

      // Update room's updated_at timestamp
      await supabase
        .from('chat_rooms')
        .update({ updated_at: new Date().toISOString() })
        .eq('id', roomId);

      return data;
    } catch (error) {
      console.error('Error sending message:', error);
      return null;
    }
  }

  // Subscribe to real-time messages for a room
  subscribeToMessages(roomId: string, onMessage: (message: ChatMessage) => void): RealtimeChannel | null {
    if (!supabase) return null;

    const channelName = `room-${roomId}`;

    // Remove existing subscription if any
    if (this.channels.has(channelName)) {
      this.channels.get(channelName)?.unsubscribe();
    }

    const channel = supabase
      .channel(channelName)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'chat_messages',
          filter: `room_id=eq.${roomId}`,
        },
        async (payload) => {
          // Fetch the complete message with sender info
          if (!supabase) {
            console.warn('Supabase client not available for message subscription');
            return;
          }
          
          try {
            const { data } = await supabase
              .from('chat_messages')
              .select(`
                *,
                sender:users!chat_messages_sender_id_fkey(first_name, last_name, role)
              `)
              .eq('id', payload.new.id)
              .single();

            if (data) {
              onMessage(data);
            }
          } catch (error) {
            console.error('Error fetching message in subscription:', error);
          }
        }
      )
      .subscribe();

    this.channels.set(channelName, channel);
    return channel;
  }

  // Subscribe to room status changes
  subscribeToRoomUpdates(roomId: string, onUpdate: (room: ChatRoom) => void): RealtimeChannel | null {
    if (!supabase) return null;

    const channelName = `room-updates-${roomId}`;

    // Remove existing subscription if any
    if (this.channels.has(channelName)) {
      this.channels.get(channelName)?.unsubscribe();
    }

    const channel = supabase
      .channel(channelName)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'chat_rooms',
          filter: `id=eq.${roomId}`,
        },
        (payload) => {
          onUpdate(payload.new as ChatRoom);
        }
      )
      .subscribe();

    this.channels.set(channelName, channel);
    return channel;
  }

  // Get available agents
  async getAvailableAgents(): Promise<AgentAvailability[]> {
    if (!supabase) return [];

    try {
      const { data, error } = await supabase
        .from('agent_availability')
        .select(`
          *,
          agent:users!agent_availability_agent_id_fkey(first_name, last_name)
        `)
        .eq('is_available', true);

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching available agents:', error);
      return [];
    }
  }

  // Assign agent to chat room (for agents/admins)
  async assignAgentToRoom(roomId: string, agentId: string): Promise<boolean> {
    if (!supabase) return false;

    try {
      const { error } = await supabase
        .from('chat_rooms')
        .update({
          agent_id: agentId,
          status: 'active',
        })
        .eq('id', roomId);

      if (error) throw error;

      // Send system message
      await this.sendMessage(roomId, 'Agent has joined the chat', 'system');

      return true;
    } catch (error) {
      console.error('Error assigning agent:', error);
      return false;
    }
  }

  // Close chat room
  async closeChatRoom(roomId: string): Promise<boolean> {
    if (!supabase) return false;

    try {
      const { error } = await supabase
        .from('chat_rooms')
        .update({
          status: 'closed',
          closed_at: new Date().toISOString(),
        })
        .eq('id', roomId);

      if (error) throw error;

      // Send system message
      await this.sendMessage(roomId, 'Chat has been closed', 'system');

      return true;
    } catch (error) {
      console.error('Error closing chat room:', error);
      return false;
    }
  }

  // Unsubscribe from a channel
  unsubscribe(channelName: string): void {
    const channel = this.channels.get(channelName);
    if (channel) {
      channel.unsubscribe();
      this.channels.delete(channelName);
    }
  }

  // Unsubscribe from all channels
  unsubscribeAll(): void {
    this.channels.forEach((channel) => {
      channel.unsubscribe();
    });
    this.channels.clear();
  }

  // Mark messages as read
  async markMessagesAsRead(roomId: string, userId: string): Promise<void> {
    if (!supabase) return;

    try {
      await supabase
        .from('chat_messages')
        .update({ is_read: true })
        .eq('room_id', roomId)
        .neq('sender_id', userId)
        .eq('is_read', false);
    } catch (error) {
      console.error('Error marking messages as read:', error);
    }
  }
}

export const chatService = new ChatService();