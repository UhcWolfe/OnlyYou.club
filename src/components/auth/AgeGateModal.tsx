"use client";

import React, { useState } from "react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { ShieldAlert, CheckCircle2, Lock } from "lucide-react";
import { useTranslation } from "@/lib/i18n/context";
import { useAuth } from "@/lib/auth/auth-context";

interface AgeGateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onVerified?: () => void;
}

export const AgeGateModal: React.FC<AgeGateModalProps> = ({ isOpen, onClose, onVerified }) => {
  const { t } = useTranslation();
  const { verifyAge } = useAuth();
  const [agreed, setAgreed] = useState(false);

  const handleConfirm = () => {
    verifyAge();
    if (onVerified) onVerified();
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={t("age_gate.title")}>
      <div className="flex flex-col items-center text-center space-y-4 py-2">
        <div className="w-16 h-16 rounded-2xl bg-red-950/60 border border-red-800/80 flex items-center justify-center text-red-400 shadow-xl shadow-red-950/40">
          <ShieldAlert className="w-8 h-8" />
        </div>

        <div className="space-y-1">
          <Badge variant="adult" className="text-xs px-3 py-1">
            {t("age_gate.badge")}
          </Badge>
          <h4 className="text-base font-bold text-zinc-100 mt-2">
            {t("age_gate.title")}
          </h4>
          <p className="text-xs text-zinc-400 max-w-sm leading-relaxed">
            {t("age_gate.description")}
          </p>
        </div>

        <div className="w-full p-3 rounded-lg bg-surface-hover border border-surface-border text-left">
          <label className="flex items-start gap-2.5 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
              className="mt-0.5 rounded bg-zinc-900 border-zinc-700 text-brand-primary focus:ring-brand-primary"
            />
            <span className="text-xs text-zinc-300 font-medium leading-tight">
              {t("age_gate.confirm_adult")}
            </span>
          </label>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-2 w-full pt-2">
          <Button
            variant="primary"
            size="md"
            disabled={!agreed}
            onClick={handleConfirm}
            className="w-full flex items-center justify-center gap-2"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>{t("age_gate.btn_verify")}</span>
          </Button>
          <Button
            variant="outline"
            size="md"
            onClick={onClose}
            className="w-full sm:w-auto"
          >
            {t("age_gate.btn_back")}
          </Button>
        </div>

        <p className="text-[10px] text-zinc-500 leading-tight">
          {t("age_gate.adult_disclaimer")}
        </p>
      </div>
    </Modal>
  );
};
