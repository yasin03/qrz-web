import { useSyncExternalStore } from "react";

const subscribe = () => () => {};

/** Sunucuda ve hydration sırasında false, istemcide true. Hydration uyuşmazlığını önler. */
export function useMounted() {
  return useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  );
}
