"use client";

import { createContext, useContext, useState } from "react";

const ChromeVisibilityContext = createContext<{
  isNotFound: boolean;
  setIsNotFound: (isNotFound: boolean) => void;
} | null>(null);

export function ChromeVisibilityProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isNotFound, setIsNotFound] = useState(false);

  return (
    <ChromeVisibilityContext.Provider value={{ isNotFound, setIsNotFound }}>
      {children}
    </ChromeVisibilityContext.Provider>
  );
}

export function useChromeVisibility() {
  const context = useContext(ChromeVisibilityContext);

  if (!context) {
    throw new Error(
      "useChromeVisibility must be used within ChromeVisibilityProvider."
    );
  }

  return context;
}
