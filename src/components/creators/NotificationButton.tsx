"use client";

import React from "react";
import { Bell, BellOff } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useAuth } from "@/lib/auth/auth-context";
import { useTranslation } from "@/lib/i18n/context";

interface NotificationButtonProps {
  creatorId: string;
  size?: "sm" | "md" | "icon";
  className?: string;
}

export const NotificationButton: React.FC<NotificationButtonProps> = ({ creatorId, size = "icon", className }) => {
  const { t } = useTranslation();
  const { notificationSettings, toggleNotifications } = useAuth();
  const isEnabled = !!notificationSettings[creatorId];

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleNotifications(creatorId);
  };

  return (
    <Button
      variant="secondary"
      size={size}
      onClick={handleClick}
      title={isEnabled ? t("creator.notifications_on") : t("creator.notifications_off")}
      className={className}
    >
      {isEnabled ? (
        <Bell className="w-4 h-4 text-amber-400 fill-amber-400/20" />
      ) : (
        <BellOff className="w-4 h-4 text-zinc-400" />
      )}
    </Button>
  );
};
