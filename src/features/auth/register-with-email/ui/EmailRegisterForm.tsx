import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"

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
})

export const EmailRegisterForm = ({ onSuccess }: { onSuccess?: () => void }) => {
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: "",
        },
    })

    function onSubmit(values: z.infer<typeof formSchema>) {
        console.log(values)
        if (onSuccess) {
            onSuccess()
        }
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
