import { useMutation, useQueryClient } from "@tanstack/react-query";

import { chatKeys } from "./keys";
import { createDirectConversation, sendMessage } from "./services";

interface SendMessageParams {
  conversationId: string;
  content: string;
}

export const useCreateDirectConversation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (participantUserId: string) => createDirectConversation(participantUserId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: chatKeys.conversations() });
    },
  });
};

export const useSendMessage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ conversationId, content }: SendMessageParams) => sendMessage(conversationId, content),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: chatKeys.messageList(variables.conversationId) });
      queryClient.invalidateQueries({ queryKey: chatKeys.conversations() });
    },
  });
};
