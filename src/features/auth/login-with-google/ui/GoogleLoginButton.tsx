import { Button } from "@/shared/ui/button"
import { GoogleIcon } from "@/shared/ui/icons/google-icon"

export const GoogleLoginButton = () => {
    const handleGoogleLogin = () => {
        console.log("Google login")
    }

    return (
        <Button
            onClick={handleGoogleLogin}
            variant="outline"
            className="
                w-full h-[44px]
                bg-white
                border border-gray-300
                hover:bg-gray-50
                shadow-sm hover:shadow
                transition-all
                text-[#202224]
                justify-start pl-4
                font-medium text-base
            "
        >
            <GoogleIcon className="mr-3 size-5" />
            <span className="flex-1 text-center pr-8">
                Continue with Google
            </span>
        </Button>

    )
}
