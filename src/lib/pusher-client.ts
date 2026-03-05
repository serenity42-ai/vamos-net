"use client";

import Pusher from "pusher-js";

let pusherInstance: Pusher | null = null;

export function getPusher(): Pusher {
  if (!pusherInstance) {
    pusherInstance = new Pusher("0ffbefeb945e4e466065", {
      cluster: "eu",
    });
  }
  return pusherInstance;
}
