import { defaultCache } from "@serwist/next/worker";
import type { PrecacheEntry, SerwistGlobalConfig } from "serwist";
import { Serwist } from "serwist";

// Serwist injects the precache manifest (build assets) here at build time.
declare global {
  interface WorkerGlobalScope extends SerwistGlobalConfig {
    __SW_MANIFEST: (PrecacheEntry | string)[] | undefined;
  }
}

declare const self: ServiceWorkerGlobalScope;

const serwist = new Serwist({
  precacheEntries: self.__SW_MANIFEST,
  skipWaiting: true,
  clientsClaim: true,
  navigationPreload: true,
  // defaultCache gives sensible runtime strategies for Next assets, fonts,
  // images, and same-origin requests. Score/calendar HTML pages already set
  // short edge-cache headers (see next.config headers()), and the default
  // NetworkFirst strategy for navigations means a fresh network response wins
  // when online, falling back to the last-cached page when offline — exactly
  // what we want for "scores on the metro with no signal".
  runtimeCaching: defaultCache,
});

serwist.addEventListeners();
