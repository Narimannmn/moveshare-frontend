import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Eye, EyeOff } from "lucide-react"
import { Button } from "@/shared/ui/button"
import { Input } from "@/shared/ui/input"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/shared/ui/form"

const formSchema = z.object({
    email: z.string().email({ message: "Invalid email address" }),
    password: z.string().min(6, {
        message: "Password must be at least 6 characters",
    }),
})

export const EmailLoginForm = ({ onSuccess }: { onSuccess: () => void }) => {
    const [showPassword, setShowPassword] = useState(false)

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        mode: "onChange",
        defaultValues: {
            email: "",
            password: "",
        },
    })

    const onSubmit = (values: z.infer<typeof formSchema>) => {
        console.log(values)
        onSuccess()
    }

    const isValid = form.formState.isValid

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                        <FormItem className="space-y-1">
                            <FormLabel className="text-[#202224] font-normal text-base">
                                Email address:
                            </FormLabel>
                            <FormControl>
                                <Input
                                    placeholder="example@gmail.com"
                                    {...field}
                                    className="h-[44px] bg-[#F1F4F9] border-[#D8D8D8] text-base"
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                        <FormItem className="space-y-1">
                            <FormLabel className="text-[#202224] font-normal text-base">
                                Password
                            </FormLabel>
                            <FormControl>
                                <div className="relative">
                                    <Input
                                        type={showPassword ? "text" : "password"}
                                        placeholder="Enter password"
                                        {...field}
                                        className="h-[44px] bg-[#F1F4F9] border-[#D8D8D8] pr-10 text-base"
                                    />
                                    <button
                                        type="button"
                                        onClick={() =>
                                            setShowPassword((prev) => !prev)
                                        }
                                        tabIndex={-1}
                                        className="
                                            absolute right-3 top-1/2 -translate-y-1/2
                                            text-muted-foreground
                                            hover:text-foreground
                                            outline-none
                                            focus-visible:ring-2
                                            focus-visible:ring-ring
                                            rounded-sm
                                        "
                                    >
                                        {showPassword ? (
                                            <EyeOff className="size-5 text-[#60A5FA]" />
                                        ) : (
                                            <Eye className="size-5 text-[#60A5FA]" />
                                        )}
                                    </button>
                                </div>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <Button
                    type="submit"
                    disabled={!isValid}
                    className="
                        w-full h-[44px]
                        rounded-md
                        font-medium text-base
                        text-white
                        bg-[#60A5FA]
                        hover:bg-[#60A5FA]/90
                        disabled:bg-[rgba(96,165,250,0.6)]
                        disabled:cursor-not-allowed
                        disabled:hover:bg-[rgba(96,165,250,0.6)]
                        transition-colors
                        mt-2
                    "
                >
                    Next
                </Button>
            </form>
        </Form>
    )
}
