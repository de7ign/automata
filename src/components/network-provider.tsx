"use client";

import networkService from "@/services/network-service";
import {createContext, ReactNode, useContext} from "react";

const NetworkContext = createContext(networkService);

export const NetworkProvider = ({children}: { children: ReactNode }) => {
  return (
    <NetworkContext.Provider value={networkService}>
      {children}
    </NetworkContext.Provider>
  )
};

export const useNetworkService = () => {
  return useContext(NetworkContext);
};