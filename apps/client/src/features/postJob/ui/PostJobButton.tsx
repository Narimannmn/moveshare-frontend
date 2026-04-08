import { memo, useState } from "react";

import { Button } from "@/shared/ui";

import { PostJobModal } from "./PostJobModal";

export const PostJobButton = memo(() => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button variant="primary" onClick={() => setIsOpen(true)}>
        Post New Job
      </Button>
      <PostJobModal open={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
});

PostJobButton.displayName = "PostJobButton";
