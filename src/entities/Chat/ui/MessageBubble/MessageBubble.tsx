import { memo } from "react";

import { cn } from "@/shared/lib/utils";

import type { Message } from "../../schemas";
import styles from "./MessageBubble.module.scss";

export interface MessageBubbleProps {
  message: Message;
  isOwnMessage: boolean;
  senderName?: string;
  className?: string;
}

export const MessageBubble = memo(
  ({ message, isOwnMessage, senderName, className }: MessageBubbleProps) => {
    const formatTime = (dateString: string) => {
      const date = new Date(dateString);
      return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    };

    return (
      <div className={cn(styles.wrapper, isOwnMessage ? styles.own : styles.other, className)}>
        <div className={cn(styles.bubble, isOwnMessage ? styles.ownBubble : styles.otherBubble)}>
          {!isOwnMessage && senderName && <div className={styles.senderName}>{senderName}</div>}
          <div className={styles.content}>{message.content}</div>
          <div className={styles.footer}>
            <span className={styles.time}>{formatTime(message.createdAt)}</span>
            {isOwnMessage && (
              <span className={styles.readStatus}>{message.isRead ? "✓✓" : "✓"}</span>
            )}
          </div>
        </div>
      </div>
    );
  }
);

MessageBubble.displayName = "MessageBubble";
