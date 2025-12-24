import { createFileRoute } from "@tanstack/react-router";
import { UIKitDemo } from "@pages/UIKitDemo";

export const Route = createFileRoute("/(app)/ui-kit-demo/")({
  component: RouteComponent,
});

function RouteComponent() {
  return <UIKitDemo />;
}
