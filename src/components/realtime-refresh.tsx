"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

// Invisible — subscribes to Postgres changes on the given tables and calls
// router.refresh() when anything changes, so a server-rendered page picks
// up e.g. an artisan's status update without the admin manually reloading.
// RLS still governs what the subscribing user actually receives, so this
// doesn't expose anything a plain refresh wouldn't.
export function RealtimeRefresh({ tables }: { tables: string[] }) {
  const router = useRouter();
  const tableKey = tables.join(",");

  useEffect(() => {
    const supabase = createClient();
    let channel: ReturnType<typeof supabase.channel> | undefined;
    let cancelled = false;

    // The realtime socket authenticates with the anon key by default; RLS
    // then sees an unauthenticated connection and silently drops every
    // event. Explicitly handing it the current session's JWT is what makes
    // postgres_changes respect "is_admin()" etc. — see Supabase's own
    // troubleshooting notes on this exact symptom (clean SUBSCRIBED status,
    // zero events).
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (cancelled || !session) return;

      supabase.realtime.setAuth(session.access_token);
      channel = supabase.channel(`realtime-refresh-${tableKey}`);

      tableKey.split(",").forEach((table) => {
        channel!.on(
          "postgres_changes",
          { event: "*", schema: "public", table },
          () => router.refresh(),
        );
      });

      channel.subscribe();
    });

    return () => {
      cancelled = true;
      if (channel) supabase.removeChannel(channel);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tableKey]);

  return null;
}
