import { useEffect, useRef, useCallback } from "react";

import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { useAuthStore } from "@/entities/Auth/model/store/authStore";
import { chatKeys } from "@/entities/Chat/api/keys";
import { useChatStore } from "@/entities/Chat/store/chatStore";

type WsMessage = {
  type: string;
  data: Record<string, unknown>;
};

const getWsUrl = (): string => {
  const apiBase = import.meta.env.VITE_API_BASE_URL as string;
  const wsBase = apiBase.replace(/^http/, "ws");
  return `${wsBase}/api/v1/ws`;
};

const RECONNECT_DELAY = 3000;
const PING_INTERVAL = 30000;

export const useWebSocket = () => {
  const queryClient = useQueryClient();
  const wsRef = useRef<WebSocket | null>(null);
  const pingIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const reconnectTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const mountedRef = useRef(true);

  const handleMessage = useCallback(
    (event: MessageEvent) => {
      try {
        const message: WsMessage = JSON.parse(event.data);

        if (message.type === "notification") {
          const title = message.data.title as string;
          const body = message.data.message as string;
          toast.info(title, { description: body });

          // Invalidate notification queries
          queryClient.invalidateQueries({ queryKey: ["notifications"] });
        }

        if (message.type === "chat.message") {
          const conversationId = message.data.conversation_id as string;
          const senderName = message.data.sender_name as string;
          const content = message.data.content as string;

          // Always refresh conversations list (last message, unread count)
          queryClient.invalidateQueries({
            queryKey: chatKeys.conversations(),
          });

          // Check if user is currently viewing this conversation
          const activeConversationId = useChatStore.getState().selectedConversationId;

          if (activeConversationId === conversationId) {
            // User is in this chat — refresh messages silently
            queryClient.invalidateQueries({
              queryKey: chatKeys.messageList(conversationId),
            });
          } else {
            // User is NOT in this chat — show toast notification
            const preview = content.length > 50 ? `${content.slice(0, 50)}...` : content;
            toast.info(senderName || "New message", {
              description: preview,
            });
          }
        }
      } catch {
        // Ignore non-JSON messages (like "pong")
      }
    },
    [queryClient]
  );

  const connect = useCallback(() => {
    const token = useAuthStore.getState().accessToken;
    if (!token || !mountedRef.current) return;

    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }

    const url = `${getWsUrl()}?token=${token}`;
    const ws = new WebSocket(url);

    ws.onopen = () => {
      pingIntervalRef.current = setInterval(() => {
        if (ws.readyState === WebSocket.OPEN) {
          ws.send("ping");
        }
      }, PING_INTERVAL);
    };

    ws.onmessage = handleMessage;

    ws.onclose = () => {
      if (pingIntervalRef.current) {
        clearInterval(pingIntervalRef.current);
        pingIntervalRef.current = null;
      }
      if (mountedRef.current) {
        reconnectTimeoutRef.current = setTimeout(connect, RECONNECT_DELAY);
      }
    };

    ws.onerror = () => {
      ws.close();
    };

    wsRef.current = ws;
  }, [handleMessage]);

  useEffect(() => {
    mountedRef.current = true;

    const unsubscribe = useAuthStore.subscribe((state, prevState) => {
      if (state.accessToken !== prevState.accessToken) {
        if (state.accessToken) {
          connect();
        } else {
          wsRef.current?.close();
          wsRef.current = null;
        }
      }
    });

    if (useAuthStore.getState().accessToken) {
      connect();
    }

    return () => {
      mountedRef.current = false;
      unsubscribe();

      if (pingIntervalRef.current) {
        clearInterval(pingIntervalRef.current);
      }
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
      if (wsRef.current) {
        wsRef.current.close();
        wsRef.current = null;
      }
    };
  }, [connect]);
};
