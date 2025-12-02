/**
 * ChatPanel Component
 * Real-time collaboration chat for tasks
 */

'use client';

import { useState } from 'react';

interface MessageProps {
  id: string;
  senderId: string;
  content: string;
  createdAt: string;
}

interface ChatPanelProps {
  taskId: string;
  messages?: MessageProps[];
  onSendMessage?: (message: string) => void;
}

export default function ChatPanel({
  taskId,
  messages = [],
  onSendMessage,
}: ChatPanelProps) {
  const [messageText, setMessageText] = useState('');

  const handleSend = () => {
    if (messageText.trim()) {
      onSendMessage?.(messageText);
      setMessageText('');
    }
  };

  return (
    <div className="flex flex-col h-full bg-white dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-700">
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.length === 0 ? (
          <p className="text-sm text-zinc-500 dark:text-zinc-400 text-center py-8">
            No messages yet. Start the conversation!
          </p>
        ) : (
          messages.map((msg) => (
            <div
              key={msg.id}
              className="bg-zinc-50 dark:bg-zinc-800 rounded-md p-3"
            >
              <p className="text-xs font-medium text-zinc-600 dark:text-zinc-400">
                User {msg.senderId}
              </p>
              <p className="text-sm text-zinc-900 dark:text-white mt-1">
                {msg.content}
              </p>
              <p className="text-xs text-zinc-500 dark:text-zinc-500 mt-1">
                {new Date(msg.createdAt).toLocaleTimeString()}
              </p>
            </div>
          ))
        )}
      </div>

      <div className="border-t border-zinc-200 dark:border-zinc-700 p-4">
        <div className="flex gap-2">
          <input
            type="text"
            value={messageText}
            onChange={(e) => setMessageText(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Type a message..."
            className="flex-1 px-3 py-2 border border-zinc-300 dark:border-zinc-600 rounded-md bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-emerald-600"
          />
          <button
            onClick={handleSend}
            className="px-4 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-500 transition text-sm font-medium"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}
