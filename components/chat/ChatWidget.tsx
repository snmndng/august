
'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { chatService, type ChatRoom } from '@/lib/services/chat';
import ChatWindow from './ChatWindow';
import { MessageCircle, X } from 'lucide-react';

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [hasUnread, setHasUnread] = useState(false);
  const [isAgentAvailable, setIsAgentAvailable] = useState(false);
  const { user, isAuthenticated } = useAuth();

  useEffect(() => {
    // Check for agent availability
    const checkAgentAvailability = async () => {
      try {
        const availability = await chatService.getAgentAvailability();
        setIsAgentAvailable(availability.length > 0);
      } catch (error) {
        console.error('Error checking agent availability:', error);
        setIsAgentAvailable(false);
      }
    };

    checkAgentAvailability();
    const interval = setInterval(checkAgentAvailability, 60000); // Check every minute

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (isAuthenticated && user) {
      // Check for unread messages
      const checkUnreadMessages = async () => {
        try {
          const rooms = await chatService.getUserChatRooms(user.id);
          const hasUnreadMessages = rooms.some(room => room.has_unread_messages);
          setHasUnread(hasUnreadMessages);
        } catch (error) {
          console.error('Error checking unread messages:', error);
        }
      };

      checkUnreadMessages();
      const interval = setInterval(checkUnreadMessages, 30000); // Check every 30 seconds

      return () => clearInterval(interval);
    }
  }, [isAuthenticated, user]);

  const toggleChat = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      setHasUnread(false);
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {/* Chat Window */}
      {isOpen && (
        <div className="mb-4 w-80 h-96 bg-white rounded-lg shadow-xl border border-gray-200 overflow-hidden">
          <ChatWindow onClose={() => setIsOpen(false)} />
        </div>
      )}

      {/* Chat Button */}
      <button
        onClick={toggleChat}
        className={`
          relative flex items-center justify-center w-14 h-14 rounded-full shadow-lg transition-all duration-300 hover:scale-110
          ${isAgentAvailable 
            ? 'bg-green-500 hover:bg-green-600' 
            : 'bg-luxior-orange hover:bg-luxior-deep-orange'
          }
        `}
        aria-label={isOpen ? 'Close chat' : 'Open chat'}
      >
        {isOpen ? (
          <X className="w-6 h-6 text-white" />
        ) : (
          <MessageCircle className="w-6 h-6 text-white" />
        )}

        {/* Unread messages indicator */}
        {hasUnread && !isOpen && (
          <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center">
            <div className="w-2 h-2 bg-white rounded-full"></div>
          </div>
        )}

        {/* Agent availability indicator */}
        <div className={`
          absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white
          ${isAgentAvailable ? 'bg-green-400' : 'bg-gray-400'}
        `}></div>
      </button>

      {/* Tooltip */}
      {!isOpen && (
        <div className="absolute bottom-16 right-0 bg-gray-800 text-white text-sm px-3 py-1 rounded-lg opacity-0 hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap">
          {isAgentAvailable ? 'Chat with us - We\'re online!' : 'Leave us a message'}
        </div>
      )}
    </div>
  );
}
