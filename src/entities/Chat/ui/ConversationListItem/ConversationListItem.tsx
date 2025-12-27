import { memo, useMemo } from "react";
import { cn } from "@/shared/lib/utils";
import type { Conversation } from "../../schemas";
import { UserAvatar } from "../UserAvatar/UserAvatar";
import styles from "./ConversationListItem.module.scss";

export interface ConversationListItemProps {
  conversation: Conversation;
  isSelected: boolean;
  currentUserId: string;
  onClick: (id: string) => void;
  className?: string;
}

export const ConversationListItem = memo(
  ({
    conversation,
    isSelected,
    currentUserId,
    onClick,
    className,
  }: ConversationListItemProps) => {
    const otherUser = useMemo(() => {
      return conversation.participants.find((p) => p.id !== currentUserId);
    }, [conversation.participants, currentUserId]);

    const formatTimestamp = (dateString: string) => {
      const date = new Date(dateString);
      const now = new Date();
      const diff = now.getTime() - date.getTime();

      if (diff < 60000) return "Just now";
      if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
      if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;

      const yesterday = new Date(now);
      yesterday.setDate(yesterday.getDate() - 1);
      if (date.toDateString() === yesterday.toDateString()) return "Yesterday";

      return date.toLocaleDateString();
    };

    if (!otherUser) return null;

    return (
      <div
        className={cn(
          styles.item,
          isSelected && styles.selected,
          className
        )}
        onClick={() => onClick(conversation.id)}
        role="button"
        tabIndex={0}
        aria-label={`Conversation with ${otherUser.name}`}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            onClick(conversation.id);
          }
        }}
      >
        <UserAvatar
          name={otherUser.name}
          avatar={otherUser.avatar}
          isOnline={otherUser.isOnline}
          size="md"
        />

        <div className={styles.content}>
          <div className={styles.header}>
            <span className={styles.name}>{otherUser.name}</span>
            {conversation.lastMessage && (
              <span className={styles.timestamp}>
                {formatTimestamp(conversation.lastMessage.createdAt)}
              </span>
            )}
          </div>

          <div className={styles.footer}>
            {conversation.lastMessage && (
              <span className={styles.lastMessage}>
                {conversation.lastMessage.content}
              </span>
            )}
            {conversation.unreadCount > 0 && (
              <span className={styles.unreadBadge}>
                {conversation.unreadCount}
              </span>
            )}
          </div>
        </div>
      </div>
    );
  }
);

ConversationListItem.displayName = "ConversationListItem";
