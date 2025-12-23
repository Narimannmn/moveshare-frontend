import { CheckCircle2 } from "lucide-react"
import { Button } from "@/shared/ui/button"

export const ReviewStatus = ({ onNext }: { onNext?: () => void }) => {
    return (
        <div className="flex flex-col items-center gap-6">
            <div className="relative flex items-center justify-center size-[70px] rounded-full bg-linear-to-br from-[#00B09B] to-[#96C93D]">
                <CheckCircle2 className="size-8 text-white relative z-10" />
            </div>

            <div className="space-y-2 text-center">
                <h3 className="text-[#202224] font-bold text-2xl">
                    Under review
                </h3>
                <p className="text-[#202224] text-base max-w-[340px] mx-auto">
                    Verification may take up to 3 days. We’ll notify you once it’s completed. If there are any issues we will contact you.
                </p>
            </div>

            <Button
                onClick={onNext}
                className="
            w-full h-[44px]
            bg-[#60A5FA] hover:bg-[#60A5FA]/90 
            text-white font-medium text-base 
            rounded-md
        "
            >
                Next
            </Button>
        </div>
    )
}
