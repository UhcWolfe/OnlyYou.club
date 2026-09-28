"use client";

import React, { useState } from "react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { ReportReason, ReportTargetType } from "@/types";
import { useTranslation } from "@/lib/i18n/context";
import { useAuth } from "@/lib/auth/auth-context";
import { OnlyYouApiClient } from "@/lib/api/client";
import { Flag, CheckCircle2 } from "lucide-react";

interface ReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetType: ReportTargetType;
  targetId: string;
  postId?: string;
}

export const ReportModal: React.FC<ReportModalProps> = ({
  isOpen,
  onClose,
  targetType,
  targetId,
  postId,
}) => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [reason, setReason] = useState<ReportReason>("INAPPROPRIATE");
  const [details, setDetails] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const reasons: { value: ReportReason; labelKey: string }[] = [
    { value: "ILLEGAL_CONTENT", labelKey: "moderation.reason_illegal" },
    { value: "NON_CONSENSUAL", labelKey: "moderation.reason_non_consensual" },
    { value: "COPYRIGHT", labelKey: "moderation.reason_copyright" },
    { value: "IMPERSONATION", labelKey: "moderation.reason_impersonation" },
    { value: "SPAM", labelKey: "moderation.reason_spam" },
    { value: "INAPPROPRIATE", labelKey: "moderation.reason_inappropriate" },
    { value: "OTHER", labelKey: "moderation.reason_other" },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await OnlyYouApiClient.submitReport({
        reporterId: user?.id || "guest_user",
        targetType,
        targetId,
        postId,
        reason,
        details: details.trim() || undefined,
      });
      setIsSuccess(true);
      setTimeout(() => {
        setIsSuccess(false);
        onClose();
      }, 2000);
    } catch {
      // fallback
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={t("moderation.report_title")}>
      {isSuccess ? (
        <div className="flex flex-col items-center text-center py-6 space-y-3">
          <CheckCircle2 className="w-12 h-12 text-emerald-400" />
          <p className="text-sm font-semibold text-zinc-200">
            {t("moderation.report_success")}
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-zinc-300">
              {t("moderation.report_reason")}
            </label>
            <select
              value={reason}
              onChange={(e) => setReason(e.target.value as ReportReason)}
              className="w-full h-10 px-3 rounded-lg bg-surface-hover border border-surface-border text-sm text-zinc-200 focus:outline-none focus:border-brand-primary"
            >
              {reasons.map((r) => (
                <option key={r.value} value={r.value} className="bg-zinc-900">
                  {t(r.labelKey)}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-zinc-300">
              {t("moderation.report_details")}
            </label>
            <textarea
              rows={3}
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              placeholder="Opisz problem..."
              className="w-full p-3 rounded-lg bg-surface-hover border border-surface-border text-xs text-zinc-200 placeholder:text-zinc-600 focus:outline-none focus:border-brand-primary"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-surface-border">
            <Button type="button" variant="ghost" size="sm" onClick={onClose}>
              {t("moderation.cancel")}
            </Button>
            <Button
              type="submit"
              variant="danger"
              size="sm"
              isLoading={isSubmitting}
              className="gap-1.5"
            >
              <Flag className="w-3.5 h-3.5" />
              <span>{t("moderation.submit_report")}</span>
            </Button>
          </div>
        </form>
      )}
    </Modal>
  );
};
