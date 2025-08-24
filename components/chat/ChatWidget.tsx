
'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import ChatWindow from './ChatWindow';
import { chatService, type ChatRoom } from '@/lib/services/chat';

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [chatRoom, setChatRoom] = useState<ChatRoom | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  
  const { user } = useAuth();

  const handleOpenChat = async () => {
    if (!user) {
      // Redirect to login or show login modal
      return;
    }

    if (!isOpen) {
      setIsCreating(true);
      try {
        // Check if user has an existing active chat room
        const existingRooms = await chatService.getUserChatRooms(user.id);
        const activeRoom = existingRooms.find(room => room.status !== 'closed');
        
        if (activeRoom) {
          setChatRoom(activeRoom);
        } else {
          // Create a new chat room
          const newRoom = await chatService.createChatRoom('General Support');
          if (newRoom) {
            setChatRoom(newRoom);
          }
        }
      } catch (error) {
        console.error('Error opening chat:', error);
      } finally {
        setIsCreating(false);
      }
    }
    
    setIsOpen(!isOpen);
  };

  const handleCloseChat = () => {
    setIsOpen(false);
  };

  const handleRoomUpdate = (updatedRoom: ChatRoom) => {
    setChatRoom(updatedRoom);
  };

  return (
    <>
      {/* Chat Button */}
      <button
        onClick={handleOpenChat}
        disabled={isCreating}
        className="fixed bottom-6 right-6 bg-luxior-orange hover:bg-luxior-deep-orange text-white p-4 rounded-full shadow-lg transition-all duration-300 z-50 group"
        aria-label="Open chat support"
      >
        {isCreating ? (
          <div className="animate-spin w-6 h-6 border-2 border-white border-t-transparent rounded-full"></div>
        ) : (
          <svg 
            className="w-6 h-6 group-hover:scale-110 transition-transform" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" 
            />
          </svg>
        )}
      </button>

      {/* Chat Window */}
      {isOpen && chatRoom && (
        <div className="fixed bottom-24 right-6 z-50">
          <ChatWindow 
            chatRoom={chatRoom}
            onClose={handleCloseChat}
            onRoomUpdate={handleRoomUpdate}
          />
        </div>
      )}
    </>
  );
}
