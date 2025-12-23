import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { REGEXP_ONLY_DIGITS } from "input-otp"

import { Button } from "@/shared/ui/button"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormMessage,
} from "@/shared/ui/form"
import {
    InputOTP,
    InputOTPGroup,
    InputOTPSlot,
} from "@/shared/ui/input-otp"

const formSchema = z.object({
    pin: z.string().min(6, {
        message: "Your verification code must be 6 characters.",
    }),
})

export const VerificationRegisterForm = ({ onSuccess }: { onSuccess?: () => void }) => {
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            pin: "",
        },
    })

    function onSubmit(values: z.infer<typeof formSchema>) {
        console.log(values)
        if (onSuccess) onSuccess()
    }

    // Countdown logic (mocking 2 minutes)
    const [timeLeft, setTimeLeft] = useState(120)

    useEffect(() => {
        if (timeLeft <= 0) return
        const intervalId = setInterval(() => {
            setTimeLeft((prev) => prev - 1)
        }, 1000)
        return () => clearInterval(intervalId)
    }, [timeLeft])

    const formatTime = (seconds: number) => {
        const minutes = Math.floor(seconds / 60)
        const remainingSeconds = seconds % 60
        return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="flex justify-center">
                    <FormField
                        control={form.control}
                        name="pin"
                        render={({ field }) => (
                            <FormItem>
                                <FormControl>
                                    <InputOTP
                                        maxLength={6}
                                        pattern={REGEXP_ONLY_DIGITS}
                                        {...field}
                                    >
                                        <InputOTPGroup className="gap-2">
                                            {Array.from({ length: 6 }).map((_, index) => (
                                                <InputOTPSlot
                                                    key={index}
                                                    index={index}
                                                    className="
                                    h-[56px] w-[56px]
                                    rounded-[8px]
                                    bg-[#F1F4F9]
                                    border border-[#D8D8D8]
                                    text-lg
                                    overflow-hidden
                                    box-border
                                "
                                                />
                                            ))}
                                        </InputOTPGroup>
                                    </InputOTP>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <Button
                    type="submit"
                    className="w-full h-[44px] bg-[#60A5FA] hover:bg-[#60A5FA]/90 text-white font-medium text-base rounded-md"
                >
                    Verify
                </Button>

                <div className="text-center text-[#666C72] text-sm">
                    The code will arrive within {formatTime(timeLeft)}
                </div>
            </form>
        </Form>
    )
}
