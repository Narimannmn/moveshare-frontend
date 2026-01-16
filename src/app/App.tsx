import { RouterProvider, createRouter } from "@tanstack/react-router";

import { QueryProvider } from "@app/providers";
import { routeTree } from "@app/routeTree.gen";

// import '@shared/config/i18n'

const router = createRouter({ routeTree });
export type AppRouter = typeof router;

declare module "@tanstack/react-router" {
  interface Register {
    router: AppRouter;
  }
}
export const App = () => {
  return (
    <QueryProvider>
      <RouterProvider router={router} />
    </QueryProvider>
  );
};
