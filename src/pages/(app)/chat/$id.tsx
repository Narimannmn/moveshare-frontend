import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/(app)/chat/$id")({
  component: ChatDetailPage,
});

function ChatDetailPage() {
  const { id } = Route.useParams();

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-[#202224] mb-6">Chat #{id}</h1>
      {/* TODO: Add ChatDetail component */}
      <p className="text-sm text-gray-500">Chat detail to be implemented</p>
    </div>
  );
}
