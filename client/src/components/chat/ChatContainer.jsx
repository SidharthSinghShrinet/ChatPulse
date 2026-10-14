import React, { useEffect, useRef } from 'react';
import ChatHeader from './ChatHeader';
import MessageBubble from './MessageBubble';
import MessageInput from './MessageInput';
import DateSeparator from './DateSeparator';
import { isSameDay } from '../../utils/date';
import { MessageSquareDashed } from 'lucide-react';

const ChatContainer = ({
  selectedUser = null,
  currentUser = null,
  isOnline = false,
  isTyping = false,
  messages = [],
  messageText = '',
  onMessageChange = () => {},
  onSendMessage = () => {},
  onBack = () => {},
  isSending = false,
}) => {
  const messagesEndRef = useRef(null);

  // Auto scroll to bottom when messages or typing update
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  return (
    <div className="flex-1 h-full flex flex-col bg-slate-100/60 dark:bg-slate-950 overflow-hidden transition-colors duration-200">
      {/* Chat Top Header */}
      <ChatHeader
        selectedUser={selectedUser}
        isOnline={isOnline}
        isTyping={isTyping}
        onBack={onBack}
      />

      {/* Messages Scrollable Area */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-2">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-500">
            <div className="w-14 h-14 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-center mb-3 shadow-xs">
              <MessageSquareDashed size={24} className="text-indigo-500 dark:text-indigo-400" />
            </div>
            <p className="text-sm font-semibold text-slate-800 dark:text-slate-300">No messages yet</p>
            <p className="text-xs text-slate-500 mt-1 max-w-xs">
              Say hello to {selectedUser?.fullname} to start the conversation!
            </p>
          </div>
        ) : (
          messages.map((msg, index) => {
            const isOutgoing = msg.senderId === currentUser?._id;
            const prevMsg = index > 0 ? messages[index - 1] : null;
            const showDateSeparator = !prevMsg || !isSameDay(prevMsg.createdAt, msg.createdAt);

            return (
              <React.Fragment key={msg._id || index}>
                {showDateSeparator && <DateSeparator date={msg.createdAt} />}
                <MessageBubble
                  message={msg.message}
                  createdAt={msg.createdAt}
                  isOutgoing={isOutgoing}
                  status={msg.status || 'sent'}
                />
              </React.Fragment>
            );
          })
        )}

        {/* Live Typing Bubble in Chat (Three Bouncing Dots) */}
        {isTyping && (
          <div className="flex justify-start mb-3 animate-fade-in">
            <div className="bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/50 rounded-2xl rounded-bl-xs px-4 py-3 shadow-xs dark:shadow-slate-950/40 flex items-center gap-1.5">
              <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce [animation-delay:-0.3s]" />
              <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce [animation-delay:-0.15s]" />
              <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" />
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Bottom Message Input Box */}
      <MessageInput
        value={messageText}
        onChange={onMessageChange}
        onSubmit={onSendMessage}
        disabled={isSending}
        placeholder={`Message ${selectedUser?.fullname || 'user'}...`}
      />
    </div>
  );
};

export default ChatContainer;
