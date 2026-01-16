import { type KeyboardEvent, memo, useCallback, useState } from "react";

import { cn } from "@/shared/lib/utils";

import styles from "./MessageInput.module.scss";

export interface MessageInputProps {
  conversationId: string;
  className?: string;
}

export const MessageInput = memo(({ conversationId, className }: MessageInputProps) => {
  const [message, setMessage] = useState("");

  const handleSend = useCallback(() => {
    const trimmedMessage = message.trim();
    if (!trimmedMessage) return;

    // TODO: Implement send message functionality
    console.log("Send message:", { conversationId, content: trimmedMessage });

    setMessage("");
  }, [message, conversationId]);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        handleSend();
      }
    },
    [handleSend]
  );

  return (
    <div className={cn(styles.container, className)}>
      <textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Type a message..."
        className={styles.textarea}
        disabled={false}
        rows={1}
      />
      <button
        onClick={handleSend}
        disabled={!message.trim()}
        className={styles.sendButton}
        aria-label="Send message"
      >
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M22 2L11 13"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M22 2L15 22L11 13L2 9L22 2Z"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
    </div>
  );
});

MessageInput.displayName = "MessageInput";
