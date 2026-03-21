
'use client';

import React, { createContext, useContext, useState, ReactNode, useCallback, useEffect } from 'react';

interface ConsentContextType {
  isConsentGiven: boolean;
  consentTimestamp: string | null;
  giveConsent: () => void;
  loading: boolean;
}

const ConsentContext = createContext<ConsentContextType | undefined>(undefined);

export function ConsentProvider({ children }: { children: ReactNode }) {
  const [isConsentGiven, setIsConsentGiven] = useState(false);
  const [consentTimestamp, setConsentTimestamp] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const storedConsent = localStorage.getItem('skillmatch-consent-given');
      const storedTimestamp = localStorage.getItem('skillmatch-consent-timestamp');
      if (storedConsent === 'true') {
        setIsConsentGiven(true);
        setConsentTimestamp(storedTimestamp);
      }
    } catch (e) {
        console.error("Could not read consent status from localStorage");
    } finally {
        setLoading(false);
    }
  }, []);

  const giveConsent = useCallback(() => {
    const timestamp = new Date().toISOString();
    localStorage.setItem('skillmatch-consent-given', 'true');
    localStorage.setItem('skillmatch-consent-timestamp', timestamp);
    setIsConsentGiven(true);
    setConsentTimestamp(timestamp);
  }, []);

  return (
    <ConsentContext.Provider value={{ isConsentGiven, giveConsent, consentTimestamp, loading }}>
      {children}
    </ConsentContext.Provider>
  );
}

export function useConsent() {
  const context = useContext(ConsentContext);
  if (context === undefined) {
    throw new Error('useConsent must be used within a ConsentProvider');
  }
  return context;
}
