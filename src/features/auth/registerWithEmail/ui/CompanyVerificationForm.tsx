import { useRef, useState } from "react";

import { FileText } from "lucide-react";

import { Button } from "@shared/ui";

interface FileUploadSectionProps {
  label: string;
  file: File | null;
  onFileChange: (file: File) => void;
}

const FileUploadSection = ({ label, file, onFileChange }: FileUploadSectionProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      onFileChange(e.target.files[0]);
    }
  };

  return (
    <div className="flex items-center justify-between py-4">
      <div className="flex items-center gap-3">
        <FileText className="size-6 text-[#60A5FA]" />
        <span className="text-[#202224] font-normal text-base">{label}</span>
      </div>

      <div>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          className="hidden"
          accept=".pdf,.jpg,.jpeg,.png"
        />
        {file ? (
          <div className="flex items-center gap-2">
            <span className="text-sm text-[#202224] truncate max-w-[120px]">{file.name}</span>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="text-[#60A5FA] text-sm hover:underline"
            >
              Change
            </button>
          </div>
        ) : (
          <Button
            type="button"
            variant="outline"
            onClick={() => fileInputRef.current?.click()}
            className="border-[#60A5FA] text-[#60A5FA] hover:bg-[#60A5FA]/10 hover:text-[#60A5FA] hover:border-[#60A5FA] h-9 px-4 font-normal"
          >
            Upload file
          </Button>
        )}
      </div>
    </div>
  );
};

export const CompanyVerificationForm = ({ onSuccess }: { onSuccess?: () => void }) => {
  const [files, setFiles] = useState<Record<string, File | null>>({
    mcLicense: null,
    dotCertificate: null,
    insuranceCertificate: null,
    businessLicense: null,
  });

  const updateFile = (key: string, file: File) => {
    setFiles((prev) => ({ ...prev, [key]: file }));
  };

  const handleSubmit = () => {
    console.log("Submitting files:", files);
    if (onSuccess) onSuccess();
  };

  const allFilesUploaded = Object.values(files).every((file) => file !== null);

  return (
    <div className="space-y-6">
      <div className="space-y-0">
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

      <Button
        type="button"
        onClick={handleSubmit}
        disabled={!allFilesUploaded}
        className="w-full h-[44px] bg-[#60A5FA] hover:bg-[#60A5FA]/90 text-white font-medium text-base rounded-md disabled:bg-[rgba(96,165,250,0.6)] disabled:cursor-not-allowed"
      >
        Submit
      </Button>

      <div className="flex justify-center">
        <button
          type="button"
          onClick={() => onSuccess && onSuccess()}
          className="text-[#60A5FA] font-medium text-base hover:underline"
        >
          Verify later
        </button>
      </div>
    </div>
  );
};
