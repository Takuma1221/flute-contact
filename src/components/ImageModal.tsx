"use client";

import { useEffect } from "react";
import Image from "next/image";
import { X } from "lucide-react";

interface ImageModalProps {
  src: string;
  alt: string;
  isOpen: boolean;
  onClose: () => void;
}

export function ImageModal({ src, alt, isOpen, onClose }: ImageModalProps) {
  // ESCキーでモーダルを閉じる
  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEsc);
      // スクロールを無効化
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEsc);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black bg-opacity-75 p-4">
      <div className="relative max-w-4xl max-h-full">
        {/* 閉じるボタン */}
        <button
          onClick={onClose}
          className="absolute -top-10 right-0 text-white hover:text-gray-300 transition-colors z-10"
          aria-label="閉じる"
        >
          <X className="w-8 h-8" />
        </button>

        {/* 画像 */}
        <div className="relative bg-white rounded-lg overflow-hidden shadow-2xl">
          <Image
            src={src}
            alt={alt}
            width={583}
            height={830}
            className="max-w-full max-h-[80vh] object-contain"
          />
        </div>
      </div>

      {/* 背景クリックで閉じる */}
      <div
        className="absolute inset-0 -z-10"
        onClick={onClose}
        aria-label="閉じる"
      />
    </div>
  );
}
