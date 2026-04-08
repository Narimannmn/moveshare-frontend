import { Toaster as Sonner, type ToasterProps } from "sonner";

const Toaster = ({ ...props }: ToasterProps) => {
  return (
    <Sonner
      position="top-right"
      theme="light"
      closeButton
      richColors
      gap={8}
      toastOptions={{
        className: "!rounded-lg !border !shadow-lg !font-[Onest,sans-serif]",
        style: {
          padding: "14px 16px",
          fontSize: "14px",
          lineHeight: "1.4",
        },
        classNames: {
          toast: "!bg-white !border-[#E5E7EB] !shadow-[0_4px_20px_rgba(0,0,0,0.08)]",
          title: "!text-[#202224] !font-semibold !text-sm",
          description: "!text-[#666C72] !text-sm !mt-0.5",
          closeButton: "!bg-white !border-[#E5E7EB] !text-[#90A4AE] hover:!text-[#202224] hover:!border-[#D8D8D8]",
          success: "!bg-[#F0FDF4] !border-[#BBF7D0] !text-[#166534]",
          error: "!bg-[#FEF2F2] !border-[#FECACA] !text-[#991B1B]",
          info: "!bg-[#EFF6FF] !border-[#BFDBFE] !text-[#1E40AF]",
          warning: "!bg-[#FFFBEB] !border-[#FDE68A] !text-[#92400E]",
        },
      }}
      {...props}
    />
  );
};

export { Toaster };
