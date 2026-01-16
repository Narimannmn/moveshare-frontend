import { memo, useEffect, useRef } from "react";

import { cn } from "@/shared/lib/utils";

import { EmptyState, MessageBubble, useMessages } from "@/entities/Chat";

import styles from "./MessageThread.module.scss";

export interface MessageThreadProps {
  conversationId: string | null;
  className?: string;
}

const CURRENT_USER_ID = "1";

export const MessageThread = memo(({ conversationId, className }: MessageThreadProps) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { data: messages, isLoading, isError } = useMessages(conversationId);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    if (messages && messages.length > 0) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  if (!conversationId) {
    return (
      <div className={cn(styles.container, className)}>
        <EmptyState
          icon="💬"
          title="No conversation selected"
          message="Select a conversation to start messaging"
        />
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className={cn(styles.container, className)}>
        <EmptyState icon="⏳" title="Loading messages" message="Please wait..." />
      </div>
    );
  }

  if (isError) {
    return (
      <div className={cn(styles.container, className)}>
        <EmptyState icon="❌" title="Error loading messages" message="Please try again later" />
      </div>
    );
  }

  if (!messages || messages.length === 0) {
    return (
      <div className={cn(styles.container, className)}>
        <EmptyState
          icon="💭"
          title="No messages yet"
          message="Send a message to start the conversation"
        />
      </div>
    );
  }

  return (
    <div className={cn(styles.container, className)}>
      <div className={styles.messageList}>
        {messages.map((message) => (
          <MessageBubble
            key={message.id}
            message={message}
            isOwnMessage={message.senderId === CURRENT_USER_ID}
          />
        ))}
        <div ref={messagesEndRef} />
      </div>
    </div>
  );
});

MessageThread.displayName = "MessageThread";
