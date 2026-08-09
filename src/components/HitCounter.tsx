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

      try {
        if (isNewVisitor) {
          const res = await fetch("/api/hits", {
            method: "POST",
            cache: "no-store",
          });

          if (res.ok) {
            const data = await res.json();
            setCount(data.count);
            localStorage.setItem(VISITOR_KEY, "1");
            return;
          }
        }

        const res = await fetch("/api/hits", { cache: "no-store" });
        if (res.ok) {
          const data = await res.json();
          setCount(data.count);
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
