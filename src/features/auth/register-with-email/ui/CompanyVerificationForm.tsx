import { useRef, useState } from "react"
import { FileIcon, Upload } from "lucide-react"

import { Button } from "@/shared/ui/button"

interface FileUploadSectionProps {
    label: string
    file: File | null
    onFileChange: (file: File) => void
}

const FileUploadSection = ({ label, file, onFileChange }: FileUploadSectionProps) => {
    const fileInputRef = useRef<HTMLInputElement>(null)

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            onFileChange(e.target.files[0])
        }
    }

    return (
        <div className="flex items-center justify-between py-4 border-b border-[#E5E7EB] last:border-0">
            <label className="text-[#202224] font-normal text-base flex items-center gap-2">
                <span className="text-[#60A5FA]">
                    <FileIcon className="size-5" />
                </span>
                {label}
            </label>

            <div>
                <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    className="hidden"
                    accept=".pdf,.jpg,.png"
                />
                {file ? (
                    <div className="flex items-center gap-2 text-[#202224]">
                        <span className="font-medium text-sm truncate max-w-[150px]">
                            {file.name}
                        </span>
                        <Button
                            variant="ghost"
                            size="sm"
                            className="text-[#60A5FA] hover:text-[#60A5FA]/80 h-auto p-0"
                            onClick={() => fileInputRef.current?.click()}
                        >
                            Change
                        </Button>
                    </div>
                ) : (
                    <Button
                        variant="outline"
                        onClick={() => fileInputRef.current?.click()}
                        className="border-[#60A5FA] text-[#60A5FA] hover:bg-[#F0F9FF] hover:text-[#60A5FA] gap-2 h-9"
                    >
                        <Upload className="size-4" />
                        Upload file
                    </Button>
                )}
            </div>
        </div>
    )
}

export const CompanyVerificationForm = ({ onSuccess }: { onSuccess?: () => void }) => {
    const [files, setFiles] = useState<Record<string, File | null>>({
        mcLicense: null,
        dotCertificate: null,
        insuranceCertificate: null,
        businessLicense: null,
    })

    const updateFile = (key: string, file: File) => {
        setFiles((prev) => ({ ...prev, [key]: file }))
    }

    const handleSubmit = () => {
        console.log("Submitting files:", files)
        if (onSuccess) onSuccess()
    }

    const isSubmitDisabled = !Object.values(files).some((file) => file !== null)

    return (
        <div className="space-y-2">
            <div className="bg-white rounded-lg border border-[#E5E7EB] px-4">
                <FileUploadSection
                    label="MC License"
                    file={files.mcLicense}
                    onFileChange={(file) => updateFile("mcLicense", file)}
                />
                <FileUploadSection
                    label="DOT Certificate"
                    file={files.dotCertificate}
                    onFileChange={(file) => updateFile("dotCertificate", file)}
                />
                <FileUploadSection
                    label="Insurance Certificate"
                    file={files.insuranceCertificate}
                    onFileChange={(file) => updateFile("insuranceCertificate", file)}
                />
                <FileUploadSection
                    label="Business License"
                    file={files.businessLicense}
                    onFileChange={(file) => updateFile("businessLicense", file)}
                />
            </div>

            <div className="space-y-4 pt-4">
                <Button
                    onClick={handleSubmit}
                    disabled={isSubmitDisabled}
                    className="
                        w-full h-[44px]
                        bg-[#60A5FA] hover:bg-[#60A5FA]/90 
                        text-white font-medium text-base 
                        rounded-md
                        disabled:bg-[rgba(96,165,250,0.6)]
                    "
                >
                    Submit
                </Button>

                <div className="flex justify-center">
                    <button
                        onClick={() => onSuccess && onSuccess()}
                        className="text-[#60A5FA] font-bold text-base hover:underline"
                    >
                        Verify later
                    </button>
                </div>
            </div>
        </div>
    )
}
