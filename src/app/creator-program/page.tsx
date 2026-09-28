"use client";

import React from "react";
import { CreatorProgramPrompt } from "@/components/creator-program/CreatorProgramPrompt";

export default function CreatorProgramPage() {
  return (
    <div className="py-6">
      <CreatorProgramPrompt isGate={false} />
    </div>
  );
}
