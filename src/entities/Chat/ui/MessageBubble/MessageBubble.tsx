import { memo } from "react";

import { Check } from "lucide-react";

import { cn } from "@/shared/lib/utils";

import type { Message } from "../../schemas";
import { Avatar } from "@/shared/ui";
import styles from "./MessageBubble.module.scss";

export interface MessageBubbleProps {
  message: Message;
  isOwnMessage: boolean;
  senderName?: string;
  senderAvatar?: string | null;
  className?: string;
}

const ReadReceipt = memo(({ isRead }: { isRead: boolean }) => (
  <span className={styles.readReceipt}>
    <Check className={cn("size-3.5", isRead ? "text-white" : "text-white/50")} strokeWidth={2.5} />
    {isRead && (
      <Check className="size-3.5 -ml-2 text-white" strokeWidth={2.5} />
    )}
  </span>
));

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
            <Avatar
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
            {isOwnMessage && <ReadReceipt isRead={message.isRead} />}
          </div>
        </div>
      </div>
    );
  }
);

MessageBubble.displayName = "MessageBubble";
