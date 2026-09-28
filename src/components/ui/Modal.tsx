"use client";

import React, { useEffect } from "react";
import { X } from "lucide-react";
import { Button } from "./Button";
import { cn } from "@/lib/utils/cn";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  className?: string;
}

export const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children, className }) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.body.style.overflow = "unset";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div
        className="fixed inset-0"
        onClick={onClose}
        aria-hidden="true"
      />
      <div
        className={cn(
          "relative z-10 w-full max-w-lg rounded-xl bg-surface border border-surface-border shadow-2xl p-6 overflow-hidden",
          className
        )}
      >
        <div className="flex items-center justify-between pb-4 border-b border-surface-border mb-4">
          {title && <h3 className="text-lg font-semibold text-zinc-100">{title}</h3>}
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="ml-auto text-zinc-400 hover:text-zinc-100"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
        {children}
      </div>
    </div>
  );
};
