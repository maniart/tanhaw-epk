'use client'

import { createContext, useContext, useState } from 'react'

interface EnsembleContextValue {
  active: string
  setActive: (slug: string) => void
}

const EnsembleContext = createContext<EnsembleContextValue | null>(null)

export function EnsembleProvider({
  children,
  defaultEnsemble,
}: {
  children: React.ReactNode
  defaultEnsemble: string
}) {
  const [active, setActive] = useState(defaultEnsemble)
  return (
    <EnsembleContext.Provider value={{ active, setActive }}>
      {children}
    </EnsembleContext.Provider>
  )
}

export function useEnsemble(): EnsembleContextValue | null {
  return useContext(EnsembleContext)
}
