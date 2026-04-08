import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";

import { Button, ErrorMessage, Input } from "@shared/ui";

import { useSendOTP } from "@entities/Auth";

const formSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
});

type FormData = z.infer<typeof formSchema>;

interface EmailRegisterFormProps {
  onSuccess?: (email: string) => void;
}

export const EmailRegisterForm: React.FC<EmailRegisterFormProps> = ({ onSuccess }) => {
  const sendOTP = useSendOTP();

  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    mode: "onChange",
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = (values: FormData) => {
    sendOTP.mutate(values.email, {
      onSuccess: () => {
        onSuccess?.(values.email);
      },
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Controller
        name="email"
        control={control}
        render={({ field }) => (
          <Input
            {...field}
            label="Email address:"
            type="email"
            placeholder="example@gmail.com"
            disabled={sendOTP.isPending}
            error={errors?.email?.message}
          />
        )}
      />
      {sendOTP.error && <ErrorMessage error={sendOTP.error} />}

      <Button
        type="submit"
        disabled={!isValid || sendOTP.isPending}
        className="w-full h-[44px] rounded-md font-medium text-base text-white bg-[#60A5FA] hover:bg-[#60A5FA]/90 disabled:bg-[rgba(96,165,250,0.6)] disabled:cursor-not-allowed disabled:hover:bg-[rgba(96,165,250,0.6)] transition-colors mt-2"
      >
        {sendOTP.isPending ? "Sending..." : "Next"}
      </Button>
    </form>
  );
};
