
'use client';

import { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { chatService, type ChatRoom, type ChatMessage } from '@/lib/services/chat';

interface ChatWindowProps {
  chatRoom: ChatRoom;
  onClose: () => void;
  onRoomUpdate: (room: ChatRoom) => void;
  isInSidePanel?: boolean;
}

export default function ChatWindow({ chatRoom, onClose, onRoomUpdate, isInSidePanel = false }: ChatWindowProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSending, setIsSending] = useState(false);
  
  const { user } = useAuth();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Load messages when room changes
  useEffect(() => {
    loadMessages();
  }, [chatRoom.id]);

  // Subscribe to real-time messages
  useEffect(() => {
    const channel = chatService.subscribeToMessages(chatRoom.id, (message) => {
      setMessages(prev => [...prev, message]);
      
      // Mark messages as read if not from current user
      if (message.sender_id !== user?.id) {
        chatService.markMessagesAsRead(chatRoom.id, user?.id || '');
      }
    });

    // Subscribe to room updates
    const roomChannel = chatService.subscribeToRoomUpdates(chatRoom.id, (updatedRoom) => {
      onRoomUpdate(updatedRoom);
    });

    return () => {
      if (channel) channel.unsubscribe();
      if (roomChannel) roomChannel.unsubscribe();
    };
  }, [chatRoom.id, user?.id, onRoomUpdate]);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const loadMessages = async () => {
    setIsLoading(true);
    try {
      const roomMessages = await chatService.getRoomMessages(chatRoom.id);
      setMessages(roomMessages);
      
      // Mark messages as read
      if (user) {
        await chatService.markMessagesAsRead(chatRoom.id, user.id);
      }
    } catch (error) {
      console.error('Error loading messages:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || isSending) return;

    setIsSending(true);
    try {
      const message = await chatService.sendMessage(chatRoom.id, newMessage.trim());
      if (message) {
        setNewMessage('');
      }
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setIsSending(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'waiting': return 'text-yellow-600';
      case 'active': return 'text-green-600';
      case 'closed': return 'text-gray-600';
      default: return 'text-gray-600';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'waiting': return 'Waiting for agent';
      case 'active': return 'Active chat';
      case 'closed': return 'Chat closed';
      default: return status;
    }
  };

  return (
    <div className={`bg-white flex flex-col overflow-hidden ${
      isInSidePanel ? 'h-full' : 'rounded-lg shadow-xl w-96 h-96'
    }`}>
      {/* Header - only show if not in side panel */}
      {!isInSidePanel && (
        <div className="bg-luxior-orange text-white p-4 flex items-center justify-between">
          <div>
            <h3 className="font-semibold">Chat Support</h3>
            <p className={`text-sm ${getStatusColor(chatRoom.status)} text-white opacity-90`}>
              {getStatusText(chatRoom.status)}
            </p>
          </div>
          
          <button
            onClick={onClose}
            className="text-white hover:text-gray-200 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {isLoading ? (
          <div className="flex justify-center items-center h-full">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-luxior-orange"></div>
          </div>
        ) : messages.length === 0 ? (
          <div className="text-center text-gray-500 mt-8">
            <p>Welcome to LuxiorMall support!</p>
            <p className="text-sm mt-2">Send a message to get started.</p>
          </div>
        ) : (
          messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.sender_id === user?.id ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-xs lg:max-w-md px-3 py-2 rounded-lg ${
                  message.message_type === 'system'
                    ? 'bg-gray-100 text-gray-600 text-sm italic mx-auto'
                    : message.sender_id === user?.id
                    ? 'bg-luxior-orange text-white'
                    : 'bg-gray-100 text-gray-800'
                }`}
              >
                {message.message_type !== 'system' && message.sender_id !== user?.id && (
                  <div className="text-xs text-gray-500 mb-1">
                    {message.sender?.first_name} {message.sender?.last_name}
                  </div>
                )}
                
                <p className="break-words">{message.message}</p>
                
                <div className={`text-xs mt-1 ${
                  message.sender_id === user?.id ? 'text-white opacity-75' : 'text-gray-500'
                }`}>
                  {formatTime(message.created_at)}
                </div>
              </div>
            </div>
          ))
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      {chatRoom.status !== 'closed' && (
        <div className="border-t p-4">
          <div className="flex space-x-2">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your message..."
              className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-luxior-orange focus:border-transparent"
              disabled={isSending}
            />
            <button
              onClick={handleSendMessage}
              disabled={!newMessage.trim() || isSending}
              className="bg-luxior-orange text-white px-4 py-2 rounded-lg hover:bg-luxior-deep-orange transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSending ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
