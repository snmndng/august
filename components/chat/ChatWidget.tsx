
'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { chatService, type ChatRoom } from '@/lib/services/chat';
import ChatWindow from './ChatWindow';

interface ChatWidgetProps {
  className?: string;
}

export default function ChatWidget({ className = '' }: ChatWidgetProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [chatRooms, setChatRooms] = useState<ChatRoom[]>([]);
  const [activeChatRoom, setActiveChatRoom] = useState<ChatRoom | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  
  const { user, isAuthenticated } = useAuth();

  // Load user's chat rooms
  useEffect(() => {
    if (isAuthenticated && user) {
      loadChatRooms();
    }
  }, [isAuthenticated, user]);

  const loadChatRooms = async () => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      const rooms = await chatService.getUserChatRooms(user.id);
      setChatRooms(rooms);
      
      // Set active room to the most recent open room
      const activeRoom = rooms.find(room => room.status !== 'closed') || rooms[0];
      if (activeRoom) {
        setActiveChatRoom(activeRoom);
      }
    } catch (error) {
      console.error('Error loading chat rooms:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const startNewChat = async () => {
    if (!isAuthenticated) {
      // Redirect to login
      window.location.href = '/auth/login';
      return;
    }

    setIsLoading(true);
    try {
      const newRoom = await chatService.createChatRoom('General Support');
      if (newRoom) {
        setChatRooms(prev => [newRoom, ...prev]);
        setActiveChatRoom(newRoom);
        setIsOpen(true);
      }
    } catch (error) {
      console.error('Error creating chat room:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className={`fixed bottom-4 right-4 z-50 ${className}`}>
        <button
          onClick={() => window.location.href = '/auth/login'}
          className="bg-luxior-orange hover:bg-luxior-deep-orange text-white p-4 rounded-full shadow-lg transition-all duration-300 hover:scale-105 flex items-center space-x-2"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
          <span className="hidden sm:block">Chat Support</span>
        </button>
      </div>
    );
  }

  return (
    <div className={`fixed bottom-4 right-4 z-50 ${className}`}>
      {/* Chat Button */}
      {!isOpen && (
        <button
          onClick={activeChatRoom ? () => setIsOpen(true) : startNewChat}
          disabled={isLoading}
          className="bg-luxior-orange hover:bg-luxior-deep-orange text-white p-4 rounded-full shadow-lg transition-all duration-300 hover:scale-105 flex items-center space-x-2 relative"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
          <span className="hidden sm:block">
            {isLoading ? 'Starting...' : activeChatRoom ? 'Chat Support' : 'Start Chat'}
          </span>
          
          {/* Unread badge */}
          {unreadCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-6 w-6 flex items-center justify-center">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </button>
      )}

      {/* Chat Window */}
      {isOpen && activeChatRoom && (
        <ChatWindow
          chatRoom={activeChatRoom}
          onClose={() => setIsOpen(false)}
          onRoomUpdate={(updatedRoom) => {
            setActiveChatRoom(updatedRoom);
            setChatRooms(prev => 
              prev.map(room => room.id === updatedRoom.id ? updatedRoom : room)
            );
          }}
        />
      )}
    </div>
  );
}
