import React, { ReactNode } from "react";
import "./Wallet.css";
import {
  RainbowKitProvider,
  ConnectButton,
  midnightTheme,
  connectorsForWallets,
  wallet
} from '@rainbow-me/rainbowkit';
import {
  chain,
  configureChains,
  createClient,
  WagmiConfig
} from 'wagmi';
import { alchemyProvider } from 'wagmi/providers/alchemy';
import { publicProvider } from 'wagmi/providers/public';
import { ANS } from "../Ans/ANS";
import { ToastContainer } from 'react-toastify';

export interface WalletProps {
  alchemyKey?: string;
  testnets?: boolean;
  children?: ReactNode;
}

export function WalletContext(props: WalletProps) {
  let nets = [chain.mainnet, chain.polygon];
  let providers = [publicProvider()];
  if (props.alchemyKey) providers.push(alchemyProvider({ alchemyId: props.alchemyKey }));
  if (props.testnets) nets = [chain.goerli, chain.polygonMumbai];
  const { chains, provider } = configureChains(
    nets,
    providers
  );

  const connectors = connectorsForWallets([
    {
      groupName: 'Recommended',
      wallets: [
        wallet.metaMask({ chains })
      ],
    },
  ]);

  const wagmiClient = createClient({
    autoConnect: true,
    connectors,
    provider
  })
  let theme = midnightTheme({
    accentColor: 'var(--as-light)',
    accentColorForeground: 'var(--as-dark)'
  });
  theme.colors.connectButtonBackground = 'var(--as-light)';
  theme.colors.connectButtonText = 'var(--as-dark)';
  theme.colors.modalBackground = 'var(--as-light)';
  theme.colors.modalText = 'var(--as-dark)';
  theme.colors.modalTextDim = 'var(--as-dark-dim)';
  theme.colors.modalTextSecondary = 'var(--as-secondary)';
  theme.colors.closeButtonBackground = 'var(--as-light)';
  theme.colors.closeButton = 'var(--as-danger)';
  theme.shadows = {
    connectButton: '0px 4px 12px var(--as-dark-dim)',
    dialog: '0px 8px 32px var(--as-dark-dim)',
    profileDetailsAction: '0px 2px 6px var(--as-dark-dim)',
    selectedOption: '0px 2px 6px var(--as-dark-dim)',
    selectedWallet: '0px 2px 6px var(--as-dark-dim)',
    walletLogo: '0px 2px 16px var(--as-dark-dim)',
  }

  return (<WagmiConfig client={wagmiClient}>
    <RainbowKitProvider chains={chains} theme={
      theme
    }>
      {props.children}
      <ToastContainer autoClose={5000} pauseOnHover closeOnClick newestOnTop={true} position="bottom-center" />
    </RainbowKitProvider>
  </WagmiConfig>
  );
}

export function Wallet(props: { className?: string, styles?: React.CSSProperties }) {
  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", ...props.styles }} className={props.className}>
      <ANS />
      <ConnectButton showBalance={false} 
                    chainStatus={{ smallScreen: 'icon', largeScreen: 'full' }}
                    accountStatus={{smallScreen:"address", largeScreen:"full"}} />
    </div>
  )
}