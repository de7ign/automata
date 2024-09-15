"use client";

import nfaService from "@/services/nfa-service";
import {createContext, ReactNode, useContext} from "react";

const NfaContext = createContext(nfaService);

export const NfaProvider = ({children}: { children: ReactNode }) => {
  return (
    <NfaContext.Provider value={nfaService}>
      {children}
    </NfaContext.Provider>
  )
};

export const useNfaService = () => {
  return useContext(NfaContext);
};