import { type KeyboardEvent, memo, useCallback, useState } from "react";

import { useSendMessage } from "@/entities/Chat";

import { cn } from "@/shared/lib/utils";

import styles from "./MessageInput.module.scss";

export interface MessageInputProps {
  conversationId: string;
  className?: string;
}

export const MessageInput = memo(({ conversationId, className }: MessageInputProps) => {
  const [message, setMessage] = useState("");
  const sendMessageMutation = useSendMessage();

  const handleSend = useCallback(() => {
    const trimmedMessage = message.trim();
    if (!trimmedMessage) return;

    sendMessageMutation
      .mutateAsync({ conversationId, content: trimmedMessage })
      .then(() => setMessage(""))
      .catch((error) => {
        console.error("Failed to send message:", error);
      });
  }, [message, conversationId, sendMessageMutation]);

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
        placeholder="Write message"
        className={styles.textarea}
        disabled={sendMessageMutation.isPending}
        rows={1}
      />
      <button
        onClick={handleSend}
        disabled={!message.trim() || sendMessageMutation.isPending}
        className={styles.sendButton}
        aria-label="Send message"
      >
        Send
      </button>
    </div>
  );
});

MessageInput.displayName = "MessageInput";
