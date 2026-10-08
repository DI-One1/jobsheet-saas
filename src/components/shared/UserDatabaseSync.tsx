"use client";

import { useUser } from "@clerk/nextjs";
import { useEffect, useRef } from "react";
import { syncUserToDatabase } from "@/lib/sync-user";

export default function UserDatabaseSync() {
  const { isLoaded, isSignedIn, user } = useUser();
  const syncedUserId = useRef<string | null>(null);

  useEffect(() => {
    if (!isLoaded) return;

    if (!isSignedIn || !user) {
      syncedUserId.current = null;
      return;
    }

    if (syncedUserId.current === user.id) return;

    syncedUserId.current = user.id;
    void syncUserToDatabase().catch((error: unknown) => {
      syncedUserId.current = null;
      console.error("Gagal melakukan sinkronisasi user:", error);
    });
  }, [isLoaded, isSignedIn, user]);

  return null;
}
