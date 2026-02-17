import { createFileRoute } from "@tanstack/react-router";

import { ConversationList } from "@/widgets/Chat";

export const Route = createFileRoute("/(app)/chat/")({
  component: ChatListPage,
});

function ChatListPage() {
  return (
    <div className="flex flex-col gap-6 h-full">
      <h1 className="font-bold text-[24px] leading-[100%] text-[#202224] font-['Onest',sans-serif]">
        Chats
      </h1>
      <div className="bg-white rounded-lg p-4 flex-1 overflow-hidden">
        <div className="w-70 h-full">
          <ConversationList />
        </div>
      </div>
    </div>
  );
}
