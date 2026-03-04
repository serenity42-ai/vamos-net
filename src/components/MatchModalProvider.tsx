"use client";

import { createContext, useContext, useState, useCallback, type ReactNode } from "react";
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

  return (
    <MatchModalContext.Provider value={{ openMatch }}>
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
