import {useNavigate} from "@tanstack/react-router";

import {Button, Typography} from "@shared/ui";

export const VerificationForm = () => {
  const navigate = useNavigate();

  return (
    <div className="space-y-6 text-center">
      <Typography variant="regular_16" className="text-[#666C72]">
        Login verification is no longer required. You will be redirected automatically after login.
      </Typography>

      <Button
        onClick={() => navigate({to: "/login"})}
        className="w-full h-11 bg-[#60A5FA] hover:bg-[#60A5FA]/90 text-white font-medium text-base rounded-md"
      >
        Back to Login
      </Button>
    </div>
  );
};
