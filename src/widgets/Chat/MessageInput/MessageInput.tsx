import { memo, useCallback, useState, KeyboardEvent } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { cn } from "@/shared/lib/utils";
import { sendMessage, chatKeys } from "@/entities/Chat";
import styles from "./MessageInput.module.scss";

export interface MessageInputProps {
  conversationId: string;
  className?: string;
}

const CURRENT_USER_ID = "1";

export const MessageInput = memo(
  ({ conversationId, className }: MessageInputProps) => {
    const [message, setMessage] = useState("");
    const queryClient = useQueryClient();

    const { mutate: sendMsg, isPending } = useMutation({
      mutationFn: sendMessage,
      onSettled: () => {
        queryClient.invalidateQueries({
          queryKey: chatKeys.messageList(conversationId),
        });
        queryClient.invalidateQueries({
          queryKey: chatKeys.conversations(),
        });
      },
    });

    const handleSend = useCallback(() => {
      const trimmedMessage = message.trim();
      if (!trimmedMessage || isPending) return;

      sendMsg({
        conversationId,
        senderId: CURRENT_USER_ID,
        content: trimmedMessage,
      });

      setMessage("");
    }, [message, conversationId, sendMsg, isPending]);

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
          disabled={isPending}
          rows={1}
        />
        <button
          onClick={handleSend}
          disabled={!message.trim() || isPending}
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
  }
);

MessageInput.displayName = "MessageInput";
