import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"

import { Button } from "@/shared/ui/button"
import { Input } from "@/shared/ui/input"
import { Textarea } from "@/shared/ui/textarea"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/shared/ui/form"

const formSchema = z.object({
    companyName: z.string().min(1, { message: "Company Name is required" }),
    emailAddress: z.string().email({ message: "Invalid email address" }),
    address: z.string().min(1, { message: "Address is required" }),
    state: z.string().min(1, { message: "State is required" }),
    mcLicenceNumber: z.string().min(1, { message: "MC Licence Number is required" }),
    contactPerson: z.string().min(1, { message: "Contact Person is required" }),
    phoneNumber: z.string().min(1, { message: "Phone Number is required" }),
    city: z.string().min(1, { message: "City is required" }),
    zipCode: z.string().min(1, { message: "ZIP Code is required" }),
    dotNumber: z.string().min(1, { message: "DOT Number is required" }),
    companyDescription: z.string().optional(),
})

export const CompanyInfoForm = ({ onSuccess }: { onSuccess?: () => void }) => {
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            companyName: "",
            emailAddress: "",
            address: "",
            state: "",
            mcLicenceNumber: "",
            contactPerson: "",
            phoneNumber: "",
            city: "",
            zipCode: "",
            dotNumber: "",
            companyDescription: "",
        },
    })

    function onSubmit(values: z.infer<typeof formSchema>) {
        console.log(values)
        if (onSuccess) onSuccess()
    }


    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Left Side */}
                    <div className="space-y-4">
                        <FormField
                            control={form.control}
                            name="companyName"
                            render={({ field }) => (
                                <FormItem className="space-y-1">
                                    <FormLabel className="text-[#202224] font-normal text-base">Company Name</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Enter company name" {...field} className="h-[44px] bg-white border-[#D8D8D8] text-base" />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="emailAddress"
                            render={({ field }) => (
                                <FormItem className="space-y-1">
                                    <FormLabel className="text-[#202224] font-normal text-base">Email Address</FormLabel>
                                    <FormControl>
                                        <Input placeholder="contact@transatlantic.com" {...field} className="h-[44px] bg-white border-[#D8D8D8] text-base" />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="address"
                            render={({ field }) => (
                                <FormItem className="space-y-1">
                                    <FormLabel className="text-[#202224] font-normal text-base">Address</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Enter address company" {...field} className="h-[44px] bg-white border-[#D8D8D8] text-base" />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="state"
                            render={({ field }) => (
                                <FormItem className="space-y-1">
                                    <FormLabel className="text-[#202224] font-normal text-base">State</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Enter state" {...field} className="h-[44px] bg-white border-[#D8D8D8] text-base" />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="mcLicenceNumber"
                            render={({ field }) => (
                                <FormItem className="space-y-1">
                                    <FormLabel className="text-[#202224] font-normal text-base">MC License Number</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Enter MC license number" {...field} className="h-[44px] bg-white border-[#D8D8D8] text-base" />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                    {/* Right Side */}
                    <div className="space-y-4">
                        <FormField
                            control={form.control}
                            name="contactPerson"
                            render={({ field }) => (
                                <FormItem className="space-y-1">
                                    <FormLabel className="text-[#202224] font-normal text-base">Contact Person</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Enter contact person" {...field} className="h-[44px] bg-white border-[#D8D8D8] text-base" />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="phoneNumber"
                            render={({ field }) => (
                                <FormItem className="space-y-1">
                                    <FormLabel className="text-[#202224] font-normal text-base">Phone Number</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Enter phone number" {...field} className="h-[44px] bg-white border-[#D8D8D8] text-base" />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="city"
                            render={({ field }) => (
                                <FormItem className="space-y-1">
                                    <FormLabel className="text-[#202224] font-normal text-base">City</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Enter city" {...field} className="h-[44px] bg-white border-[#D8D8D8] text-base" />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="zipCode"
                            render={({ field }) => (
                                <FormItem className="space-y-1">
                                    <FormLabel className="text-[#202224] font-normal text-base">ZIP Code</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Enter ZIP code" {...field} className="h-[44px] bg-white border-[#D8D8D8] text-base" />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="dotNumber"
                            render={({ field }) => (
                                <FormItem className="space-y-1">
                                    <FormLabel className="text-[#202224] font-normal text-base">DOT Number</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Enter DOT number" {...field} className="h-[44px] bg-white border-[#D8D8D8] text-base" />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                </div>

                {/* Bottom Full Width */}
                <FormField
                    control={form.control}
                    name="companyDescription"
                    render={({ field }) => (
                        <FormItem className="space-y-1">
                            <FormLabel className="text-[#202224] font-normal text-base">Company Description</FormLabel>
                            <FormControl>
                                <Textarea placeholder="Enter company description" {...field} className="min-h-[100px] bg-white border-[#D8D8D8] text-base resize-none" />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <div className="flex justify-end mt-4">
                    <Button
                        type="submit"
                        className="
                            px-8 h-[44px]
                            rounded-md
                            font-medium text-base
                            text-white
                            bg-[#60A5FA]
                            hover:bg-[#60A5FA]/90
                            transition-colors
                        "
                    >
                        Next
                    </Button>
                </div>
            </form>
        </Form>
    )
}
