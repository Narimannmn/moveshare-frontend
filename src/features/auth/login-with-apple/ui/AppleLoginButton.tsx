import { Button } from "@/shared/ui/button"
import { AppleIcon } from "@/shared/ui/icons/apple-icon"

export const AppleLoginButton = () => {
    const handleAppleLogin = () => {
        console.log("Apple login")
    }

    return (
        <Button
            onClick={handleAppleLogin}
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
            <AppleIcon className="mr-3 size-5" />
            <span className="flex-1 text-center pr-8">Continue with Apple</span>
        </Button>
    )
}
