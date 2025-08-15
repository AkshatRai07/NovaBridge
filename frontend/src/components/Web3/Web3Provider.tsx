'use client';

import '@rainbow-me/rainbowkit/styles.css';
import { getDefaultConfig, RainbowKitProvider, darkTheme, Theme } from '@rainbow-me/rainbowkit';
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

const myTheme = {
  ...darkTheme(),
  colors: {
    ...darkTheme().colors,
    accentColor: '#4f39f6',  // your custom background color
    accentColorForeground: '#ffffff',        // your custom text color
  },
};

export const Web3Provider = ( {children}: {children : ReactNode} ) => {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider modalSize="compact" theme={myTheme}>
          {children}
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
};
