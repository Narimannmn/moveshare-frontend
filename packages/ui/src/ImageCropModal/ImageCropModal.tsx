import { memo, useCallback, useState } from "react";

import Cropper from "react-easy-crop";
import type { Area } from "react-easy-crop";

import { Button } from "../Button/Button";
import { Dialog, DialogContent } from "../Dialog/Dialog";

export interface ImageCropModalProps {
  open: boolean;
  imageSrc: string;
  onClose: () => void;
  onConfirm: (croppedFile: File) => void;
  aspectRatio?: number;
  cropShape?: "rect" | "round";
  title?: string;
}

const OUTPUT_SIZE = 400;

const createImage = (url: string): Promise<HTMLImageElement> =>
  new Promise((resolve, reject) => {
    const image = new Image();
    image.addEventListener("load", () => resolve(image));
    image.addEventListener("error", (error) => reject(error));
    if (!url.startsWith("data:")) {
      image.crossOrigin = "anonymous";
    }
    image.src = url;
  });

const getCroppedCanvas = async (
  imageSrc: string,
  _pixelCrop: Area,
  percentCrop: Area
): Promise<Blob> => {
  const image = await createImage(imageSrc);

  // Use percentage crop + natural dimensions to avoid any coordinate mismatch
  const natW = image.naturalWidth;
  const natH = image.naturalHeight;

  const sx = Math.round((percentCrop.x / 100) * natW);
  const sy = Math.round((percentCrop.y / 100) * natH);
  const sw = Math.round((percentCrop.width / 100) * natW);
  const sh = Math.round((percentCrop.height / 100) * natH);

  // Crop using translate approach — draw the full image shifted, canvas clips it
  const canvas = document.createElement("canvas");
  canvas.width = OUTPUT_SIZE;
  canvas.height = OUTPUT_SIZE;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("No 2d context");

  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";

  // Scale factor from crop area to output size
  const scaleX = OUTPUT_SIZE / sw;
  const scaleY = OUTPUT_SIZE / sh;

  ctx.save();
  ctx.scale(scaleX, scaleY);
  ctx.translate(-sx, -sy);
  ctx.drawImage(image, 0, 0, natW, natH);
  ctx.restore();

  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (blob) resolve(blob);
        else reject(new Error("Canvas toBlob failed"));
      },
      "image/jpeg",
      0.92
    );
  });
};

export const ImageCropModal = memo(
  ({
    open,
    imageSrc,
    onClose,
    onConfirm,
    aspectRatio = 1,
    cropShape = "round",
    title = "Crop Image",
  }: ImageCropModalProps) => {
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
    const [croppedAreaPercent, setCroppedAreaPercent] = useState<Area | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);

    const onCropComplete = useCallback((croppedArea: Area, croppedPixels: Area) => {
      setCroppedAreaPixels(croppedPixels);
      setCroppedAreaPercent(croppedArea);
    }, []);

    const handleConfirm = useCallback(async () => {
      if (!croppedAreaPixels || !croppedAreaPercent) return;

      setIsProcessing(true);
      try {
        const blob = await getCroppedCanvas(imageSrc, croppedAreaPixels, croppedAreaPercent);
        const file = new File([blob], "profile-image.jpg", { type: "image/jpeg" });
        onConfirm(file);
      } catch (error) {
        console.error("Failed to crop image:", error);
      } finally {
        setIsProcessing(false);
      }
    }, [croppedAreaPixels, imageSrc, onConfirm]);

    const handleClose = useCallback(() => {
      setCrop({ x: 0, y: 0 });
      setZoom(1);
      setCroppedAreaPixels(null);
      setCroppedAreaPercent(null);
      onClose();
    }, [onClose]);

    return (
      <Dialog open={open} onOpenChange={(isOpen) => !isOpen && handleClose()}>
        <DialogContent
          showClose={false}
          className="w-[min(500px,calc(100vw-48px))] max-w-[500px] p-0"
          aria-describedby={undefined}
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-[#D8D8D8] px-6 py-4">
            <h2 className="text-lg font-bold text-[#202224]">{title}</h2>
            <button
              type="button"
              onClick={handleClose}
              className="text-[#90A4AE] transition-colors hover:text-[#202224]"
              aria-label="Close"
            >
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path
                  d="M15 5L5 15M5 5l10 10"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            </button>
          </div>

          {/* Crop Area */}
          <div className="relative h-[350px] bg-[#1a1a1a]">
            <Cropper
              image={imageSrc}
              crop={crop}
              zoom={zoom}
              aspect={aspectRatio}
              cropShape={cropShape}
              showGrid={false}
              onCropChange={setCrop}
              onZoomChange={setZoom}
              onCropComplete={onCropComplete}
            />
          </div>

          {/* Zoom Slider */}
          <div className="flex items-center gap-4 px-6 py-3">
            <span className="text-sm text-[#90A4AE]">Zoom</span>
            <input
              type="range"
              min={1}
              max={3}
              step={0.01}
              value={zoom}
              onChange={(e) => setZoom(Number(e.target.value))}
              className="h-1.5 flex-1 cursor-pointer appearance-none rounded-full bg-[#E0E0E0] accent-[#60A5FA] [&::-webkit-slider-thumb]:size-4 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-[#60A5FA]"
            />
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 border-t border-[#D8D8D8] px-6 py-4">
            <Button variant="outline" onClick={handleClose} disabled={isProcessing}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleConfirm} loading={isProcessing}>
              Save
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }
);

ImageCropModal.displayName = "ImageCropModal";
