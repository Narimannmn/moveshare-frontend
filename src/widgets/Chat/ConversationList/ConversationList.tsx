import { memo, useCallback, useMemo, useState } from "react";

import { useNavigate } from "@tanstack/react-router";

import { CircleX, Loader2, SearchX } from "lucide-react";
import { useShallow } from "zustand/shallow";

import { cn } from "@/shared/lib/utils";
import { getJwtSubject } from "@/shared/utils/jwt/getJwtSubject";

import { useAuthStore } from "@/entities/Auth/model/store/authStore";
import { ConversationListItem, EmptyState, useChatStore, useConversations } from "@/entities/Chat";

import { Input } from "@shared/ui";

import styles from "./ConversationList.module.scss";

export interface ConversationListProps {
  className?: string;
}

export const ConversationList = memo(({ className }: ConversationListProps) => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const accessToken = useAuthStore((state) => state.accessToken);
  const currentUserId = useMemo(() => getJwtSubject(accessToken) ?? "", [accessToken]);

  const { selectedConversationId, actions } = useChatStore(
    useShallow((state) => ({
      selectedConversationId: state.selectedConversationId,
      actions: state.actions,
    }))
  );

  const { data: conversations, isLoading, isError } = useConversations();

  const filteredConversations = useMemo(() => {
    if (!conversations) return [];
    if (!searchQuery.trim()) return conversations;

    const lowercaseQuery = searchQuery.toLowerCase();
    return conversations.filter((conversation) => {
      const visibleParticipants =
        currentUserId.length > 0
          ? conversation.participants.filter((participant) => participant.id !== currentUserId)
          : conversation.participants;

      return visibleParticipants.some((participant) =>
        participant.name.toLowerCase().includes(lowercaseQuery)
      );
    });
  }, [conversations, searchQuery, currentUserId]);

  const handleConversationClick = useCallback(
    (id: string) => {
      actions.selectConversation(id);
      navigate({ to: `/chat/$id`, params: { id } });
    },
    [actions, navigate]
  );

  if (isLoading) {
    return (
      <div className={cn(styles.container, className)}>
        <div className={styles.header}>
          <h2 className={styles.title}>Messages</h2>
          <div className={styles.searchContainer}>
            <Input
              placeholder="Search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              disabled
            />
          </div>
        </div>
        <div className={styles.loadingState}>
          <EmptyState
            icon={<Loader2 className="animate-spin" />}
            title="Loading conversations"
            message="Please wait..."
          />
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className={cn(styles.container, className)}>
        <EmptyState
          icon={<CircleX />}
          title="Error loading conversations"
          message="Please try again later"
        />
      </div>
    );
  }

  return (
    <div className={cn(styles.container, className)}>
      <div className={styles.header}>
        <h2 className={styles.title}>Messages</h2>
        <div className={styles.searchContainer}>
          <Input
            placeholder="Search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className={styles.list}>
        {filteredConversations.length === 0 ? (
          <EmptyState
            icon={<SearchX />}
            title="No conversations found"
            message={searchQuery ? "Try a different search query" : "Start a new conversation"}
          />
        ) : (
          filteredConversations.map((conversation) => (
            <ConversationListItem
              key={conversation.id}
              conversation={conversation}
              isSelected={conversation.id === selectedConversationId}
              currentUserId={currentUserId}
              onClick={handleConversationClick}
            />
          ))
        )}
      </div>
    </div>
  );
});

ConversationList.displayName = "ConversationList";
