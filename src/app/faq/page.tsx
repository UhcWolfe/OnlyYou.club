import React from "react";
import { Metadata } from "next";
import { FaqContent } from "./FaqContent";

export const metadata: Metadata = {
  title: "Często Zadawane Pytania (FAQ) — OnlyYou",
  description:
    "Odpowiedzi na najczęściej zadawane pytania dotyczące platformy OnlyYou, programu weryfikacji twórców (18+), Discord Creator Hubs, ochrony przed leakami oraz prywatności.",
};

export default function FaqPage() {
  return <FaqContent />;
}
