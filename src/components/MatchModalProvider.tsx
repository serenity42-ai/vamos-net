"use client";

import { createContext, useContext, useState, useCallback, useMemo, type ReactNode } from "react";
import type { Match } from "@/lib/padel-api";
import MatchModal from "./MatchModal";

interface MatchModalContextType {
  openMatch: (match: Match, tournamentName?: string) => void;
}

const MatchModalContext = createContext<MatchModalContextType>({
  openMatch: () => {},
});

export function useMatchModal() {
  return useContext(MatchModalContext);
}

export default function MatchModalProvider({ children }: { children: ReactNode }) {
  const [activeMatch, setActiveMatch] = useState<Match | null>(null);
  const [tournamentName, setTournamentName] = useState<string | undefined>();

  const openMatch = useCallback((match: Match, name?: string) => {
    setActiveMatch(match);
    setTournamentName(name);
  }, []);

  const closeMatch = useCallback(() => {
    setActiveMatch(null);
    setTournamentName(undefined);
  }, []);

  // L6 (audit): memoize so context consumers don't re-render on every
  // provider render (e.g. when state flips on open/close).
  const value = useMemo(() => ({ openMatch }), [openMatch]);

  return (
    <MatchModalContext.Provider value={value}>
      {children}
      {activeMatch && (
        <MatchModal
          match={activeMatch}
          tournamentName={tournamentName}
          onClose={closeMatch}
        />
      )}
    </MatchModalContext.Provider>
  );
}
