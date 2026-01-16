import { Button } from "@shared/ui";
import { GoogleIcon } from "@shared/ui/icons/google-icon";

export const GoogleLoginButton = () => {
  const handleGoogleLogin = () => {
    console.log("Google login");
  };

  return (
    <Button onClick={handleGoogleLogin} variant="outline">
      <GoogleIcon className="size-5" />
      Continue with Google
    </Button>
  );
};
