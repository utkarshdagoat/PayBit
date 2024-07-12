import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { WagmiProvider,createConfig,http } from "wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ubitTestnet } from './lib/chain.ts';
import {mainnet} from "viem/chains"
import { metaMask } from 'wagmi/connectors'
export const config = createConfig({
  chains: [mainnet],
  connectors: [metaMask()],
  transports: {
    [mainnet.id]: http(),
  },
});
const queryClient = new QueryClient();


ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
     <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <App />
      </QueryClientProvider>
    </WagmiProvider>
  </React.StrictMode>,
)
