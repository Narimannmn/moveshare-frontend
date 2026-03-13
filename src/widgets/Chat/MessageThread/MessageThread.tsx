import { memo, useEffect, useMemo, useRef } from "react";

import { useNavigate } from "@tanstack/react-router";

import { CircleX, Loader2, MessageCircleOff, MessageSquare } from "lucide-react";

import { cn } from "@/shared/lib/utils";
import { getJwtSubject } from "@/shared/utils/jwt/getJwtSubject";

import { useAuthStore } from "@/entities/Auth/model/store/authStore";
import { EmptyState, MessageBubble, useConversations, useMessages } from "@/entities/Chat";

import styles from "./MessageThread.module.scss";

export interface MessageThreadProps {
  conversationId: string | null;
  className?: string;
}

const BackArrowIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M15 18L9 12L15 6"
      stroke="#202224"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);


export const MessageThread = memo(({ conversationId, className }: MessageThreadProps) => {
  const navigate = useNavigate();
  const accessToken = useAuthStore((state) => state.accessToken);
  const currentUserId = useMemo(() => getJwtSubject(accessToken) ?? "", [accessToken]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { data: messages, isLoading, isError } = useMessages(conversationId);
  const { data: conversations } = useConversations();

  const conversation = useMemo(() => {
    return conversations?.find((c) => c.id === conversationId) ?? null;
  }, [conversations, conversationId]);

  const otherUser = useMemo(() => {
    if (!conversation) return null;
    if (!currentUserId) return conversation.participants[0] ?? null;

    return (
      conversation.participants.find((participant) => participant.id !== currentUserId) ?? null
    );
  }, [conversation, currentUserId]);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    if (messages && messages.length > 0) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const handleBack = () => {
    navigate({ to: "/chat" });
  };

  if (!conversationId) {
    return (
      <div className={cn(styles.container, className)}>
        <EmptyState
          icon={<MessageCircleOff />}
          title="No conversation selected"
          message="Select a conversation to start messaging"
        />
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className={cn(styles.container, className)}>
        <EmptyState
          icon={<Loader2 className="animate-spin" />}
          title="Loading messages"
          message="Please wait..."
        />
      </div>
    );
  }

  if (isError) {
    return (
      <div className={cn(styles.container, className)}>
        <EmptyState
          icon={<CircleX />}
          title="Error loading messages"
          message="Please try again later"
        />
      </div>
    );
  }

  if (!messages || messages.length === 0) {
    return (
      <div className={cn(styles.container, className)}>
        <div className={styles.chatHeader}>
          <button className={styles.backButton} onClick={handleBack} aria-label="Back">
            <BackArrowIcon />
          </button>
          <div className={styles.avatar}>
            {(otherUser?.name ?? "C").charAt(0).toUpperCase()}
          </div>
          <span className={styles.chatName}>{otherUser?.name ?? "Chat"}</span>
        </div>
        <EmptyState
          icon={<MessageSquare />}
          title="No messages yet"
          message="Send a message to start the conversation"
        />
      </div>
    );
  }

  return (
    <div className={cn(styles.container, className)}>
      <div className={styles.chatHeader}>
        <button className={styles.backButton} onClick={handleBack} aria-label="Back">
          <BackArrowIcon />
        </button>
        <div className={styles.avatar}>
          {(otherUser?.name ?? "C").charAt(0).toUpperCase()}
        </div>
        <span className={styles.chatName}>{otherUser?.name ?? "Chat"}</span>
      </div>

      <div className={styles.messageList}>
        {messages.map((message) => (
          <MessageBubble
            key={message.id}
            message={message}
            isOwnMessage={currentUserId ? message.senderId === currentUserId : false}
            senderName={otherUser?.name}
            senderAvatar={otherUser?.avatar}
          />
        ))}
        <div ref={messagesEndRef} />
      </div>
    </div>
  );
});

MessageThread.displayName = "MessageThread";
