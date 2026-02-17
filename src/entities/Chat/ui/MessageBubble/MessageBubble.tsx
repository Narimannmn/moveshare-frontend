import { memo } from "react";

import { cn } from "@/shared/lib/utils";

import type { Message } from "../../schemas";
import { UserAvatar } from "../UserAvatar/UserAvatar";
import styles from "./MessageBubble.module.scss";

export interface MessageBubbleProps {
  message: Message;
  isOwnMessage: boolean;
  senderName?: string;
  senderAvatar?: string | null;
  className?: string;
}

const MoreVerticalIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="6" r="1.5" fill="currentColor" />
    <circle cx="12" cy="12" r="1.5" fill="currentColor" />
    <circle cx="12" cy="18" r="1.5" fill="currentColor" />
  </svg>
);

export const MessageBubble = memo(
  ({ message, isOwnMessage, senderName, senderAvatar, className }: MessageBubbleProps) => {
    const formatTime = (dateString: string) => {
      const date = new Date(dateString);
      return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    };

    return (
      <div className={cn(styles.wrapper, isOwnMessage ? styles.own : styles.other, className)}>
        {!isOwnMessage && (
          <div className={styles.avatar}>
            <UserAvatar
              name={senderName || "User"}
              avatar={senderAvatar}
              size="md"
            />
          </div>
        )}
        <div className={cn(styles.bubble, isOwnMessage ? styles.ownBubble : styles.otherBubble)}>
          <div className={styles.content}>{message.content}</div>
          <div className={styles.footer}>
            <span className={styles.time}>{formatTime(message.createdAt)}</span>
            <button className={styles.moreButton} aria-label="More options">
              <MoreVerticalIcon />
            </button>
          </div>
        </div>
      </div>
    );
  }
);

MessageBubble.displayName = "MessageBubble";
