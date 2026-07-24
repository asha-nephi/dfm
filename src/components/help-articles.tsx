"use client";

import { useMemo, useState } from "react";

export type HelpArticle = {
  category: string;
  title: string;
  body: string;
};

export function HelpArticles({ articles }: { articles: HelpArticle[] }) {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return articles;
    return articles.filter(
      (a) =>
        a.title.toLowerCase().includes(q) ||
        a.body.toLowerCase().includes(q) ||
        a.category.toLowerCase().includes(q),
    );
  }, [articles, query]);

  const grouped = useMemo(() => {
    const map = new Map<string, HelpArticle[]>();
    for (const a of filtered) {
      const list = map.get(a.category) ?? [];
      list.push(a);
      map.set(a.category, list);
    }
    return Array.from(map.entries());
  }, [filtered]);

  return (
    <div>
      <input
        type="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search — e.g. &quot;payout&quot;, &quot;photo&quot;, &quot;statement&quot;..."
        className="w-full max-w-md rounded-lg border border-charcoal/15 bg-white px-3.5 py-2.5 text-sm text-navy-black placeholder:text-navy-black/40 transition-colors focus:border-amber focus:outline-none focus:ring-2 focus:ring-amber/30"
      />

      {grouped.length === 0 ? (
        <p className="mt-6 text-sm text-navy-black/60">
          No guides match &quot;{query}&quot;.
        </p>
      ) : (
        <div className="mt-6 space-y-8">
          {grouped.map(([category, items]) => (
            <section key={category}>
              <h2 className="font-semibold text-navy-black">{category}</h2>
              <div className="mt-3 space-y-4">
                {items.map((a) => (
                  <div
                    key={a.title}
                    className="rounded-xl border border-charcoal/10 bg-white shadow-sm shadow-charcoal/5 p-4"
                  >
                    <h3 className="font-medium text-navy-black">{a.title}</h3>
                    <p className="mt-1.5 text-sm text-navy-black/70 whitespace-pre-line">
                      {a.body}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}
