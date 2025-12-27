import { useQuery } from "@tanstack/react-query";
import { conversationsQueryOptions } from "../api";

export const useConversations = () => {
  return useQuery(conversationsQueryOptions());
};
