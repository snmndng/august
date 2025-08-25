
'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import ChatWindow from './ChatWindow';
import { chatService, type ChatRoom } from '@/lib/services/chat';
import { MessageCircle, X, Minimize2 } from 'lucide-react';

export default function ChatSidePanel() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [chatRoom, setChatRoom] = useState<ChatRoom | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  
  const { user } = useAuth();

  // Check for unread messages when user is authenticated
  useEffect(() => {
    if (!user || !isOpen || !chatRoom) {
      return;
    }

    const checkUnreadMessages = async () => {
      try {
        const messages = await chatService.getRoomMessages(chatRoom.id);
        const unread = messages.filter(msg => 
          !msg.is_read && msg.sender_id !== user.id
        ).length;
        setUnreadCount(unread);
      } catch (error) {
        console.error('Error checking unread messages:', error);
      }
    };

    checkUnreadMessages();
    
    // Check periodically for new messages
    const interval = setInterval(checkUnreadMessages, 30000);
    return () => clearInterval(interval);
  }, [user, isOpen, chatRoom]);

  const handleToggleChat = async () => {
    if (!user) {
      // Could redirect to login or show login modal
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
    if (!isOpen) {
      setIsMinimized(false);
    }
  };

  const handleCloseChat = () => {
    setIsOpen(false);
    setChatRoom(null);
    setUnreadCount(0);
  };

  const handleMinimize = () => {
    setIsMinimized(!isMinimized);
  };

  const handleRoomUpdate = (updatedRoom: ChatRoom) => {
    setChatRoom(updatedRoom);
  };

  // Don't show if user is not authenticated
  if (!user) {
    return null;
  }

  return (
    <>
      {/* Chat Toggle Button */}
      <button
        onClick={handleToggleChat}
        disabled={isCreating}
        className="fixed bottom-6 right-6 bg-luxior-orange hover:bg-luxior-deep-orange text-white p-4 rounded-full shadow-lg transition-all duration-300 z-40 group"
        aria-label="Toggle chat support"
      >
        {isCreating ? (
          <div className="animate-spin w-6 h-6 border-2 border-white border-t-transparent rounded-full"></div>
        ) : (
          <>
            <MessageCircle className="w-6 h-6 group-hover:scale-110 transition-transform" />
            {unreadCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </>
        )}
      </button>

      {/* Chat Side Panel */}
      {isOpen && (
        <div className={`fixed right-0 top-0 h-full w-96 bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out ${
          isMinimized ? 'translate-x-80' : 'translate-x-0'
        }`}>
          {/* Panel Header */}
          <div className="bg-luxior-orange text-white p-4 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <MessageCircle className="w-5 h-5" />
              <h3 className="font-semibold">Support Chat</h3>
              {chatRoom && (
                <span className={`px-2 py-1 rounded-full text-xs ${
                  chatRoom.status === 'active' ? 'bg-green-500' : 
                  chatRoom.status === 'waiting' ? 'bg-yellow-500' : 'bg-gray-500'
                }`}>
                  {chatRoom.status}
                </span>
              )}
            </div>
            
            <div className="flex items-center space-x-2">
              <button
                onClick={handleMinimize}
                className="text-white hover:text-gray-200 transition-colors p-1"
                title={isMinimized ? "Expand" : "Minimize"}
              >
                <Minimize2 className="w-4 h-4" />
              </button>
              <button
                onClick={handleCloseChat}
                className="text-white hover:text-gray-200 transition-colors p-1"
                title="Close chat"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Chat Content */}
          {!isMinimized && (
            <div className="h-full pb-16">
              {chatRoom ? (
                <div className="h-full">
                  <ChatWindow 
                    chatRoom={chatRoom}
                    onClose={handleCloseChat}
                    onRoomUpdate={handleRoomUpdate}
                    isInSidePanel={true}
                  />
                </div>
              ) : (
                <div className="flex items-center justify-center h-full text-center p-6">
                  <div>
                    <MessageCircle className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                    <h3 className="text-lg font-semibold text-gray-700 mb-2">
                      Welcome to Support
                    </h3>
                    <p className="text-gray-500 mb-4">
                      We're here to help! Start a conversation with our support team.
                    </p>
                    <button
                      onClick={handleToggleChat}
                      className="bg-luxior-orange text-white px-4 py-2 rounded-lg hover:bg-luxior-deep-orange transition-colors"
                    >
                      Start Chat
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Overlay for mobile */}
      {isOpen && !isMinimized && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={handleCloseChat}
        />
      )}
    </>
  );
}
