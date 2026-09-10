"use client";

import { useEffect } from "react";
import { useCartStore } from "@/lib/store";

export function CartHydration() {
  useEffect(() => {
    const finish = () => useCartStore.getState().setHydrated();
    const unsub = useCartStore.persist.onFinishHydration(finish);
    if (useCartStore.persist.hasHydrated()) finish();
    return unsub;
  }, []);

  return null;
}
