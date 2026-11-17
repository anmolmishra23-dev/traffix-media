"use client";

import { useCallback, useEffect, useState } from "react";

/** Loads data on mount (and whenever `key` changes); `reload()` fetches again. */
export function useLoad<T>(load: () => Promise<T>, key: string = "") {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    let active = true;
    load()
      .then((d) => active && (setData(d), setError(null)))
      .catch((e: Error) => active && setError(e.message));
    return () => {
      active = false;
    };
    // `load` is re-created every render; `key` and `tick` decide when to fetch again.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key, tick]);

  const reload = useCallback(() => setTick((t) => t + 1), []);
  return { data, error, reload };
}

export type FlashState = { ok?: string; error?: string };

/** Runs an async admin task with a pending flag and a success / error message. */
export function useTask() {
  const [pending, setPending] = useState(false);
  const [flash, setFlash] = useState<FlashState>({});

  const run = useCallback(async (task: () => Promise<string | void>) => {
    setPending(true);
    setFlash({});
    try {
      const ok = await task();
      if (ok) setFlash({ ok });
      return true;
    } catch (e) {
      setFlash({ error: (e as Error).message });
      return false;
    } finally {
      setPending(false);
    }
  }, []);

  return { pending, flash, setFlash, run };
}
