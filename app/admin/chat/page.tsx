'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { chatService, type ChatRoom, type ChatMessage } from '@/lib/services/chat';
import { useRouter } from 'next/navigation';

export default function AdminChatPage() {
  const [chatRooms, setChatRooms] = useState<ChatRoom[]>([]);
  const [selectedRoom, setSelectedRoom] = useState<ChatRoom | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isAvailable, setIsAvailable] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);

  const { user, userRole } = useAuth();
  const router = useRouter();

  // Check if user has access
  useEffect(() => {
    if (!user || !['admin', 'seller'].includes(userRole || '')) {
      router.push('/dashboard');
      return;
    }
  }, [user, userRole, router]);

  useEffect(() => {
    if (user && ['admin', 'seller'].includes(userRole || '')) {
      loadData();

      // Set up real-time subscriptions for new rooms
      // This could be enhanced with more sophisticated real-time updates
      const interval = setInterval(loadChatRooms, 30000); // Refresh every 30 seconds

      return () => clearInterval(interval);
    }
  }, [user, userRole]);

  useEffect(() => {
    if (selectedRoom) {
      loadMessages();

      // Subscribe to new messages
      const channel = chatService.subscribeToMessages(selectedRoom.id, (message) => {
        setMessages(prev => [...prev, message]);
      });

      return () => channel?.unsubscribe();
    }
  }, [selectedRoom]);

  const loadData = async () => {
    setIsLoading(true);
    await loadChatRooms();
    setIsLoading(false);
  };

  const loadChatRooms = async () => {
    if (!user) return;

    try {
      const rooms = await chatService.getUserChatRooms(user.id);
      setChatRooms(rooms);
    } catch (error) {
      console.error('Error loading chat rooms:', error);
    }
  };

  const loadMessages = async () => {
    if (!selectedRoom) return;

    try {
      const roomMessages = await chatService.getRoomMessages(selectedRoom.id);
      setMessages(roomMessages);
    } catch (error) {
      console.error('Error loading messages:', error);
    }
  };



  const handleSendMessage = async () => {
    if (!selectedRoom || !newMessage.trim() || isSending) return;

    setIsSending(true);
    try {
      await chatService.sendMessage(selectedRoom.id, newMessage.trim());
      setNewMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setIsSending(false);
    }
  };

  const handleAssignToSelf = async (roomId: string) => {
    if (!user) return;

    try {
      await chatService.assignAgentToRoom(roomId, user.id);
      await loadChatRooms();
    } catch (error) {
      console.error('Error assigning room:', error);
    }
  };

  const handleCloseRoom = async (roomId: string) => {
    try {
      await chatService.closeChatRoom(roomId);
      await loadChatRooms();
      if (selectedRoom?.id === roomId) {
        setSelectedRoom(null);
      }
    } catch (error) {
      console.error('Error closing room:', error);
    }
  };

  const updateAvailability = async () => {
    try {
      await chatService.updateAgentAvailability(isAvailable, statusMessage);
    } catch (error) {
      console.error('Error updating availability:', error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'waiting': return 'bg-yellow-100 text-yellow-800';
      case 'active': return 'bg-green-100 text-green-800';
      case 'closed': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  if (!user || !['admin', 'seller'].includes(userRole || '')) {
    return null;
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-luxior-orange"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Header */}
          <div className="bg-luxior-orange text-white p-6">
            <h1 className="text-2xl font-bold">Chat Support Dashboard</h1>
            <p className="text-luxior-orange-light">Manage customer support conversations</p>
          </div>

          <div className="flex h-96">
            {/* Sidebar - Chat Rooms List */}
            <div className="w-1/3 border-r border-gray-200 overflow-y-auto">
              {/* Agent Status */}
              <div className="p-4 border-b border-gray-200 bg-gray-50">
                <h3 className="font-semibold mb-2">Your Status</h3>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={isAvailable}
                      onChange={(e) => setIsAvailable(e.target.checked)}
                      className="mr-2"
                    />
                    Available for chat
                  </label>
                  <input
                    type="text"
                    value={statusMessage}
                    onChange={(e) => setStatusMessage(e.target.value)}
                    placeholder="Status message (optional)"
                    className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                  />
                  <button
                    onClick={updateAvailability}
                    className="w-full bg-luxior-orange text-white py-1 rounded text-sm hover:bg-luxior-deep-orange"
                  >
                    Update Status
                  </button>
                </div>
              </div>

              {/* Chat Rooms */}
              <div className="p-4">
                <h3 className="font-semibold mb-4">Chat Rooms ({chatRooms.length})</h3>
                <div className="space-y-2">
                  {chatRooms.map((room) => (
                    <div
                      key={room.id}
                      onClick={() => setSelectedRoom(room)}
                      className={`p-3 rounded-lg cursor-pointer transition-colors ${
                        selectedRoom?.id === room.id
                          ? 'bg-luxior-orange text-white'
                          : 'bg-gray-100 hover:bg-gray-200'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="font-medium">
                          {room.subject || 'General Support'}
                        </div>
                        <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(room.status)}`}>
                          {room.status}
                        </span>
                      </div>
                      <div className="text-sm opacity-75 mt-1">
                        {formatTime(room.updated_at)}
                      </div>

                      {/* Action buttons */}
                      {room.status === 'waiting' && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleAssignToSelf(room.id);
                          }}
                          className="mt-2 bg-green-600 text-white px-2 py-1 rounded text-xs hover:bg-green-700"
                        >
                          Assign to me
                        </button>
                      )}

                      {room.status === 'active' && room.agent_id === user?.id && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleCloseRoom(room.id);
                          }}
                          className="mt-2 bg-red-600 text-white px-2 py-1 rounded text-xs hover:bg-red-700"
                        >
                          Close Chat
                        </button>
                      )}
                    </div>
                  ))}

                  {chatRooms.length === 0 && (
                    <div className="text-center text-gray-500 py-8">
                      No chat rooms yet
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Main Chat Area */}
            <div className="flex-1 flex flex-col">
              {selectedRoom ? (
                <>
                  {/* Chat Header */}
                  <div className="p-4 border-b border-gray-200 bg-gray-50">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold">
                          {selectedRoom.subject || 'General Support'}
                        </h3>
                        <p className="text-sm text-gray-600">
                          Status: {selectedRoom.status}
                        </p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-sm ${getStatusColor(selectedRoom.status)}`}>
                        {selectedRoom.status}
                      </span>
                    </div>
                  </div>

                  {/* Messages */}
                  <div className="flex-1 overflow-y-auto p-4 space-y-3">
                    {messages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex ${message.sender_id === user?.id ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-xs lg:max-w-md px-3 py-2 rounded-lg ${
                            message.message_type === 'system'
                              ? 'bg-blue-100 text-blue-800 text-sm italic mx-auto'
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
                    ))}
                  </div>

                  {/* Message Input */}
                  {selectedRoom.status === 'active' && selectedRoom.agent_id === user?.id && (
                    <div className="border-t p-4">
                      <div className="flex space-x-2">
                        <input
                          type="text"
                          value={newMessage}
                          onChange={(e) => setNewMessage(e.target.value)}
                          onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                          placeholder="Type your message..."
                          className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-luxior-orange"
                          disabled={isSending}
                        />
                        <button
                          onClick={handleSendMessage}
                          disabled={!newMessage.trim() || isSending}
                          className="bg-luxior-orange text-white px-4 py-2 rounded-lg hover:bg-luxior-deep-orange transition-colors disabled:opacity-50"
                        >
                          Send
                        </button>
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <div className="flex-1 flex items-center justify-center text-gray-500">
                  <div className="text-center">
                    <svg className="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                    <p>Select a chat room to start messaging</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}