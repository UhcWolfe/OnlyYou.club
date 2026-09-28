"use client";

import React from "react";
import Link from "next/link";
import { useTranslation } from "@/lib/i18n/context";
import { siteConfig } from "@/config/site";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import {
  Crown,
  Sparkles,
  Video,
  MessageSquare,
  BarChart3,
  CheckCircle2,
  ExternalLink,
  ShieldCheck,
  ArrowRight,
  UserCheck,
  FileCheck,
} from "lucide-react";

interface CreatorProgramPromptProps {
  isGate?: boolean;
}

export const CreatorProgramPrompt: React.FC<CreatorProgramPromptProps> = ({ isGate = false }) => {
  const { t } = useTranslation();

  const benefits = [
    {
      icon: Crown,
      title: t("creator_program.benefit_1_title"),
      desc: t("creator_program.benefit_1_desc"),
      color: "text-amber-400 bg-amber-400/10 border-amber-400/20",
    },
    {
      icon: Video,
      title: t("creator_program.benefit_2_title"),
      desc: t("creator_program.benefit_2_desc"),
      color: "text-brand-primary bg-brand-primary/10 border-brand-primary/20",
    },
    {
      icon: MessageSquare,
      title: t("creator_program.benefit_3_title"),
      desc: t("creator_program.benefit_3_desc"),
      color: "text-[#5865F2] bg-[#5865F2]/10 border-[#5865F2]/20",
    },
    {
      icon: BarChart3,
      title: t("creator_program.benefit_4_title"),
      desc: t("creator_program.benefit_4_desc"),
      color: "text-emerald-400 bg-emerald-400/10 border-emerald-400/20",
    },
  ];

  const steps = [
    {
      num: "01",
      icon: MessageSquare,
      title: t("creator_program.step_1_title"),
      desc: t("creator_program.step_1_desc"),
    },
    {
      num: "02",
      icon: FileCheck,
      title: t("creator_program.step_2_title"),
      desc: t("creator_program.step_2_desc"),
    },
    {
      num: "03",
      icon: ShieldCheck,
      title: t("creator_program.step_3_title"),
      desc: t("creator_program.step_3_desc"),
    },
    {
      num: "04",
      icon: UserCheck,
      title: t("creator_program.step_4_title"),
      desc: t("creator_program.step_4_desc"),
    },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-8 py-4 sm:py-8">
      {/* Gate Alert Banner if accessed when unauthorized */}
      {isGate && (
        <Card className="p-5 bg-gradient-to-r from-amber-950/40 via-surface to-surface border-amber-500/40 space-y-2">
          <div className="flex items-center gap-2 text-amber-400 font-bold text-sm sm:text-base">
            <Crown className="w-5 h-5 flex-shrink-0" />
            <span>{t("creator_program.access_denied_title")}</span>
          </div>
          <p className="text-xs sm:text-sm text-zinc-300">
            {t("creator_program.access_denied_desc")}
          </p>
        </Card>
      )}

      {/* Hero Presentation */}
      <div className="text-center space-y-4 relative overflow-hidden rounded-3xl p-8 sm:p-12 bg-gradient-to-b from-brand-primary/10 via-surface to-surface border border-surface-border">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-primary/15 border border-brand-primary/30 text-brand-primary text-xs font-semibold">
          <Sparkles className="w-3.5 h-3.5" />
          <span>{t("creator_program.badge")}</span>
        </div>

        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight">
          {t("creator_program.title")}
        </h1>

        <p className="text-sm sm:text-base text-zinc-400 max-w-2xl mx-auto leading-relaxed">
          {t("creator_program.subtitle")}
        </p>

        <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
          <a
            href={siteConfig.discordInviteUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button variant="discord" size="lg" className="w-full sm:w-auto gap-2 font-bold shadow-lg shadow-[#5865F2]/20">
              <MessageSquare className="w-5 h-5" />
              <span>{t("creator_program.open_ticket_btn")}</span>
              <ExternalLink className="w-4 h-4 opacity-70" />
            </Button>
          </a>

          <Link href="/">
            <Button variant="secondary" size="lg" className="w-full sm:w-auto">
              {t("creator_program.back_to_home")}
            </Button>
          </Link>
        </div>
      </div>

      {/* Benefits Grid */}
      <div className="space-y-4">
        <h2 className="text-lg sm:text-xl font-bold text-white text-center sm:text-left">
          {t("creator_program.why_join_title")}
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {benefits.map((b, i) => {
            const Icon = b.icon;
            return (
              <Card key={i} className="p-5 space-y-3 hover:border-zinc-700 transition-colors">
                <div className={`w-10 h-10 rounded-xl border flex items-center justify-center ${b.color}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-zinc-100">{b.title}</h3>
                  <p className="text-xs text-zinc-400 mt-1 leading-relaxed">{b.desc}</p>
                </div>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Verification Steps */}
      <Card className="p-6 sm:p-8 space-y-6 bg-surface border-surface-border">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-brand-primary font-bold text-sm uppercase tracking-wider">
            <ShieldCheck className="w-4 h-4" />
            <span>Weryfikacja 18+ w ticketach</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white">
            {t("creator_program.how_to_join_title")}
          </h2>
          <p className="text-xs sm:text-sm text-zinc-400">
            {t("creator_program.how_to_join_desc")}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          {steps.map((s, idx) => {
            const Icon = s.icon;
            return (
              <div
                key={idx}
                className="p-4 rounded-xl bg-surface-hover border border-surface-border space-y-2 relative"
              >
                <div className="flex items-center justify-between">
                  <div className="w-8 h-8 rounded-lg bg-surface border border-surface-border flex items-center justify-center text-brand-primary font-bold text-xs">
                    {s.num}
                  </div>
                  <Icon className="w-4 h-4 text-zinc-500" />
                </div>
                <h3 className="text-sm font-bold text-white pt-1">{s.title}</h3>
                <p className="text-xs text-zinc-400 leading-relaxed">{s.desc}</p>
              </div>
            );
          })}
        </div>

        <div className="pt-4 p-4 rounded-xl bg-brand-primary/5 border border-brand-primary/20 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="space-y-0.5 text-center sm:text-left">
            <div className="text-xs font-bold text-white flex items-center gap-1.5 justify-center sm:justify-start">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Bezpieczna i poufna weryfikacja</span>
            </div>
            <p className="text-[11px] text-zinc-400">
              {t("creator_program.already_verified")}
            </p>
          </div>

          <a
            href={siteConfig.discordInviteUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto"
          >
            <Button variant="discord" size="sm" className="w-full sm:w-auto gap-1.5 font-bold">
              <span>{t("brand.join_discord")}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Button>
          </a>
        </div>
      </Card>
    </div>
  );
};
