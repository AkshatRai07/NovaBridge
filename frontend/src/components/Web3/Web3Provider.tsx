'use client';

import '@rainbow-me/rainbowkit/styles.css';
import { getDefaultConfig, RainbowKitProvider } from '@rainbow-me/rainbowkit';
import { WagmiProvider } from 'wagmi';
import { baseSepolia, anvil } from 'wagmi/chains';
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { ReactNode } from 'react';

const config = getDefaultConfig({
  appName: 'NovaBridge',
  projectId: process.env.NEXT_PUBLIC_PROJECT_ID as string, // same as that of LedgerVote, nobody uses that :')
  chains: [anvil, baseSepolia],
});

const queryClient = new QueryClient();

export const Web3Provider = ( {children}: {children : ReactNode} ) => {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider>
          {children}
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
};
