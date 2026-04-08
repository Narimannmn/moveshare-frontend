import { useMemo, useState } from "react";

import { createFileRoute } from "@tanstack/react-router";

import { MessageSquareDashed } from "lucide-react";

import { Button, Input } from "@/shared/ui";

export const Route = createFileRoute("/(app)/admin/support/")({
  component: SupportPage,
});

type MessageAuthor = "incoming" | "outgoing";

interface Message {
  id: string;
  text: string;
  time: string;
  author: MessageAuthor;
}

interface SupportConversation {
  id: string;
  companyName: string;
  preview: string;
  timeLabel: string;
  unreadCount: number;
  avatarSrc: string;
  messages: Message[];
}

const supportConversations: SupportConversation[] = [
  {
    id: "sup-1",
    companyName: "NorthStar Movers",
    preview: "Do you have the bill of lading ready...",
    timeLabel: "10:30AM",
    unreadCount: 0,
    avatarSrc: "/assets/figma/admin/avatar-northstar.png",
    messages: [
      {
        id: "1",
        text: "Hi there! We're interested in claiming your Chicago to Indianapolis job. Can you confirm the exact dimensions?",
        time: "6:30 pm",
        author: "incoming",
      },
      {
        id: "2",
        text: "Perfect! We have a 40' trailer returning empty on that route. We can offer $1,850 for the job.",
        time: "6:33 pm",
        author: "outgoing",
      },
      {
        id: "3",
        text: "Great! We'll send our driver info once the deposit clears. Looking forward to working with you.",
        time: "6:35 pm",
        author: "incoming",
      },
    ],
  },
  {
    id: "sup-2",
    companyName: "Peak Movers",
    preview: "Can we reschedule for Friday instead...",
    timeLabel: "Yesterday",
    unreadCount: 2,
    avatarSrc: "/assets/figma/admin/avatar-peak.png",
    messages: [
      {
        id: "1",
        text: "Can we move the pickup window from Thursday to Friday morning?",
        time: "4:12 pm",
        author: "incoming",
      },
      {
        id: "2",
        text: "Friday morning works. Please upload your updated route docs.",
        time: "4:16 pm",
        author: "outgoing",
      },
    ],
  },
  {
    id: "sup-3",
    companyName: "TransAtlantic Logistics",
    preview: "Can we reschedule for Friday?",
    timeLabel: "Jul 28",
    unreadCount: 5,
    avatarSrc: "/assets/figma/admin/avatar-transatlantic.png",
    messages: [
      {
        id: "1",
        text: "Can we reschedule for Friday?",
        time: "8:10 am",
        author: "incoming",
      },
      {
        id: "2",
        text: "Approved. Your booking remains active.",
        time: "8:18 am",
        author: "outgoing",
      },
    ],
  },
];

function SupportPage() {
  const [selectedConversationId, setSelectedConversationId] = useState("");
  const [search, setSearch] = useState("");
  const [draft, setDraft] = useState("");
  const [threadMessages, setThreadMessages] = useState<Record<string, Message[]>>(() =>
    Object.fromEntries(
      supportConversations.map((conversation) => [conversation.id, conversation.messages])
    )
  );

  const visibleConversations = useMemo(
    () =>
      supportConversations.filter((conversation) =>
        conversation.companyName.toLowerCase().includes(search.toLowerCase())
      ),
    [search]
  );

  const selectedConversation =
    supportConversations.find((conversation) => conversation.id === selectedConversationId) ?? null;

  const selectedMessages = selectedConversation
    ? (threadMessages[selectedConversation.id] ?? [])
    : [];

  const sendMessage = () => {
    if (!selectedConversation || !draft.trim()) {
      return;
    }

    setThreadMessages((prev) => ({
      ...prev,
      [selectedConversation.id]: [
        ...prev[selectedConversation.id],
        {
          id: `${Date.now()}`,
          author: "outgoing",
          text: draft.trim(),
          time: "now",
        },
      ],
    }));

    setDraft("");
  };

  return (
    <div className="bg-white border border-[#D8D8D8] rounded-[10px] h-full min-h-[780px] p-4">
      <div className="grid grid-cols-1 lg:grid-cols-[350px_1fr] gap-6 h-full">
        <aside className="pr-4 border-r border-[#E6E8EB]">
          <h1 className="text-[#202224] text-[24px] font-bold">Messages</h1>
          <Input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search"
            containerClassName="mt-4"
            prefix={
              <img src="/assets/figma/admin/search-icon.svg" alt="Search" className="size-4" />
            }
          />

          <div className="mt-4 space-y-2">
            {visibleConversations.length === 0 && (
              <div className="text-[#90A4AE] text-[13px] px-2 py-3">
                No conversations match your search.
              </div>
            )}

            {visibleConversations.map((conversation) => {
              const isActive = selectedConversationId === conversation.id;

              return (
                <button
                  key={conversation.id}
                  type="button"
                  onClick={() =>
                    setSelectedConversationId((prev) =>
                      prev === conversation.id ? "" : conversation.id
                    )
                  }
                  className={
                    isActive
                      ? "w-full text-left rounded-[8px] p-2 bg-[#E6F2FF] border border-[#D6E9FF]"
                      : "w-full text-left rounded-[8px] p-2 hover:bg-[#F8F9FA]"
                  }
                >
                  <div className="flex gap-2 items-stretch">
                    <span
                      className={
                        isActive
                          ? "w-1 rounded-full bg-[#60A5FA] shrink-0"
                          : "w-1 rounded-full bg-[#E6E8EB] shrink-0"
                      }
                      aria-hidden
                    />
                    <img
                      src={conversation.avatarSrc}
                      alt={conversation.companyName}
                      className="size-10 rounded-full object-cover"
                    />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between">
                        <p className="text-[#202224] text-[16px] font-bold truncate">
                          {conversation.companyName}
                        </p>
                        <span className="text-[#90A4AE] text-[10px]">{conversation.timeLabel}</span>
                      </div>
                      <div className="flex items-center justify-between gap-2 mt-1">
                        <p className="text-[#A6A6A6] text-[12px] truncate">
                          {conversation.preview}
                        </p>
                        {conversation.unreadCount > 0 && (
                          <span className="size-4 rounded-full bg-[#60A5FA] text-white text-[8px] font-bold flex items-center justify-center shrink-0">
                            {conversation.unreadCount}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </aside>

        <section className="flex flex-col min-h-0">
          {selectedConversation ? (
            <>
              <div className="pb-4 border-b border-[#E6E8EB]">
                <div className="flex items-center gap-3">
                  <img src="/assets/figma/admin/back-arrow.svg" alt="Back" className="size-5" />
                  <h2 className="text-[#202224] text-[20px] font-bold">
                    {selectedConversation.companyName}
                  </h2>
                  <span className="bg-[#E6F2FF] text-[#60A5FA] text-[12px] font-bold rounded-[6px] px-2 py-1">
                    Job #MS-4821: Chicago, IL → Indianapolis, IN
                  </span>
                </div>

                <div className="mt-3 bg-[#FFF8C0] rounded-[8px] p-3 flex items-center gap-3">
                  <img src="/assets/figma/admin/warning.svg" alt="Warning" className="size-5" />
                  <p className="text-[#202224] text-[14px]">
                    Remember: Sharing contact details before payment violates our Terms of Service.
                  </p>
                </div>
              </div>

              <div className="flex-1 overflow-auto py-4 space-y-4">
                {selectedMessages.map((message) => (
                  <div
                    key={message.id}
                    className={
                      message.author === "incoming"
                        ? "flex items-end gap-2 justify-start"
                        : "flex items-end gap-2 justify-end"
                    }
                  >
                    {message.author === "incoming" && (
                      <img
                        src="/assets/figma/admin/avatar-transatlantic.png"
                        alt="Company avatar"
                        className="size-10 rounded-full object-cover"
                      />
                    )}

                    <div
                      className={
                        message.author === "incoming"
                          ? "max-w-[68%] rounded-tl-[16px] rounded-tr-[16px] rounded-br-[16px] bg-[#F8F9FA] p-4"
                          : "max-w-[68%] rounded-tl-[16px] rounded-tr-[16px] rounded-bl-[16px] bg-[#60A5FA] p-4"
                      }
                    >
                      <p
                        className={
                          message.author === "incoming"
                            ? "text-[#202224] text-[16px]"
                            : "text-white text-[16px]"
                        }
                      >
                        {message.text}
                      </p>
                      <p
                        className={
                          message.author === "incoming"
                            ? "text-[#A6A6A6] text-[12px] text-right mt-2"
                            : "text-white text-[12px] text-right mt-2"
                        }
                      >
                        {message.time}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-3 border-t border-[#D8D8D8] flex items-center gap-3">
                <input
                  value={draft}
                  onChange={(event) => setDraft(event.target.value)}
                  placeholder="Write message"
                  className="flex-1 h-11 border border-[#D8D8D8] rounded-[8px] px-3 text-[16px] text-[#202224] outline-none focus:border-[#60A5FA]"
                />
                <Button variant="primary" size="default" onClick={sendMessage}>
                  Send
                </Button>
              </div>
            </>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-center px-6">
              <div className="size-14 rounded-full bg-[#E6F2FF] text-[#60A5FA] flex items-center justify-center mb-4">
                <MessageSquareDashed size={26} />
              </div>
              <p className="text-[#202224] text-[18px] font-bold">No chat selected</p>
              <p className="text-[#90A4AE] text-[14px] mt-2 max-w-[360px]">
                Choose a conversation on the left to view messages and reply.
              </p>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
