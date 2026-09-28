"use client";

import { useEffect } from "react";

export function VisitorTracker() {
  useEffect(() => {
    // Only run on client-side once per session/browser
    const recordVisit = async () => {
      try {
        await fetch("/api/stats/visitor", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        });
      } catch (err) {
        // Non-blocking telemetry
      }
    };

    recordVisit();
  }, []);

  return null;
}
