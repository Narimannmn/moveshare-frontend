import { Button } from "@shared/ui";
import { GoogleIcon } from "@shared/ui/icons/google-icon";

export const GoogleLoginButton = () => {
  const handleGoogleLogin = () => {
    const apiBaseUrl = (import.meta.env.VITE_API_BASE_URL ?? "").trim().replace(/\/$/, "");
    if (!apiBaseUrl) {
      console.error("VITE_API_BASE_URL is not set");
      return;
    }
    window.location.assign(`${apiBaseUrl}/api/v1/auth/google/start`);
  };

  return (
    <Button onClick={handleGoogleLogin} variant="outline" className="w-full">
      <GoogleIcon className="size-5" />
      Continue with Google
    </Button>
  );
};
