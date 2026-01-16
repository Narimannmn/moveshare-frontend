import { Button } from "@shared/ui";
import { AppleIcon } from "@shared/ui/icons/apple-icon";

export const AppleLoginButton = () => {
  const handleAppleLogin = () => {
    console.log("Apple login");
  };

  return (
    <Button onClick={handleAppleLogin} variant="outline">
      <AppleIcon className="size-5" />
      Continue with Apple
    </Button>
  );
};
