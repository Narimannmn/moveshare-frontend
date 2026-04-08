import { memo, useMemo } from "react";

import { cn } from "@/shared/lib/utils";
import { Avatar } from "@/shared/ui";

import type { Conversation } from "../../schemas";

export interface ConversationListItemProps {
  conversation: Conversation;
  isSelected?: boolean;
  currentUserId?: string;
  onClick?: (id: string) => void;
  className?: string;
}

const formatRelativeTime = (dateString: string): string => {
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

export const ConversationListItem = memo(
  ({ conversation, isSelected = false, currentUserId, onClick, className }: ConversationListItemProps) => {
    const otherUser = useMemo(() => {
      if (!currentUserId) {
        return conversation.participants[0];
      }
      return conversation.participants.find((p) => p.id !== currentUserId);
    }, [conversation.participants, currentUserId]);

    if (!otherUser) return null;

    return (
      <button
        type="button"
        className={cn(
          "flex w-full items-center gap-3 rounded-lg px-2 py-3 text-left transition-colors",
          isSelected ? "bg-[#E6F2FF]" : "hover:bg-gray-50",
          className
        )}
        onClick={() => onClick?.(conversation.id)}
        aria-label={`Conversation with ${otherUser.name}`}
      >
        <Avatar
          name={otherUser.name}
          avatar={otherUser.avatar}
          isOnline={otherUser.isOnline}
          size="md"
        />

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <span className="text-sm font-semibold text-[#202224] truncate">
              {otherUser.name}
            </span>
            {conversation.lastMessage && (
              <span className="text-xs text-gray-400 shrink-0">
                {formatRelativeTime(conversation.lastMessage.createdAt)}
              </span>
            )}
          </div>
          <p className="text-sm text-gray-500 truncate mt-0.5">
            {conversation.lastMessage?.content ?? "No messages"}
          </p>
        </div>

        {conversation.unreadCount > 0 && (
          <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-[#60A5FA] text-[11px] font-bold text-white">
            {conversation.unreadCount}
          </span>
        )}
      </button>
    );
  }
);

ConversationListItem.displayName = "ConversationListItem";
