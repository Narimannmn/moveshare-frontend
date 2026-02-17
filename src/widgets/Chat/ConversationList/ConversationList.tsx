import { memo, useCallback, useMemo, useState } from "react";

import { useNavigate } from "@tanstack/react-router";

import { useShallow } from "zustand/shallow";

import { cn } from "@/shared/lib/utils";

import { ConversationListItem, EmptyState, useChatStore, useConversations } from "@/entities/Chat";

import { Input } from "@shared/ui";

import styles from "./ConversationList.module.scss";

export interface ConversationListProps {
  className?: string;
}

const CURRENT_USER_ID = "1";

export const ConversationList = memo(({ className }: ConversationListProps) => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");

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
      const otherUser = conversation.participants.find((p) => p.id !== CURRENT_USER_ID);
      return otherUser?.name.toLowerCase().includes(lowercaseQuery);
    });
  }, [conversations, searchQuery]);

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
          <EmptyState icon="⏳" title="Loading conversations" message="Please wait..." />
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className={cn(styles.container, className)}>
        <EmptyState
          icon="❌"
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
            icon="🔍"
            title="No conversations found"
            message={searchQuery ? "Try a different search query" : "Start a new conversation"}
          />
        ) : (
          filteredConversations.map((conversation) => (
            <ConversationListItem
              key={conversation.id}
              conversation={conversation}
              isSelected={conversation.id === selectedConversationId}
              currentUserId={CURRENT_USER_ID}
              onClick={handleConversationClick}
            />
          ))
        )}
      </div>
    </div>
  );
});

ConversationList.displayName = "ConversationList";
