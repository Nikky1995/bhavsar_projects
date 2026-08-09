"use client";

import { useEffect, useState } from "react";

const VISITOR_KEY = "bks_visitor_recorded";

function formatCount(count: number) {
  return count.toLocaleString("en-IN");
}

export default function HitCounter() {
  const [count, setCount] = useState<number | null>(null);

  useEffect(() => {
    async function recordVisit() {
      const isNewVisitor = !localStorage.getItem(VISITOR_KEY);
      const endpoint = isNewVisitor ? "/api/hits?record=1" : "/api/hits";

      try {
        const res = await fetch(endpoint, { cache: "no-store" });
        if (!res.ok) return;

        const data = (await res.json()) as { count: number };
        setCount(data.count);

        if (isNewVisitor) {
          localStorage.setItem(VISITOR_KEY, "1");
        }
      } catch {
        setCount((current) => current ?? 0);
      }
    }

    recordVisit();
  }, []);

  return (
    <p className="mt-2 text-sm text-amber-100/70">
      Website Hits:{" "}
      <span className="font-semibold text-amber-50">
        {count === null ? "..." : formatCount(count)}
      </span>
    </p>
  );
}
