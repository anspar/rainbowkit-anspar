/* eslint-disable @typescript-eslint/explicit-function-return-type */
import React, { ReactNode } from 'react'
import {
  RainbowKitProvider,
  ConnectButton,
  connectorsForWallets,
  lightTheme,
  DisclaimerComponent
} from '@rainbow-me/rainbowkit'
import { injectedWallet, metaMaskWallet, rainbowWallet, omniWallet, braveWallet, argentWallet } from '@rainbow-me/rainbowkit/wallets'
import {
  Chain,
  chain,
  configureChains,
  createClient,
  WagmiConfig
} from 'wagmi'
import { alchemyProvider } from 'wagmi/providers/alchemy'
import { publicProvider } from 'wagmi/providers/public'

export interface WalletProps {
  alchemyKey?: string
  testnets?: boolean
  children?: ReactNode
  shadow?: boolean
  customTestChains?: Chain[]
  appInfo?: {
    appName?: string
    learnMoreUrl?: string
    disclaimer?: DisclaimerComponent
  }
  noTheme?: boolean
}

export function WalletContext (props: WalletProps) {
  let nets = [chain.mainnet, chain.polygon]
  const providers = [publicProvider()]
  if ((props.alchemyKey ?? '').length > 0) providers.push(alchemyProvider({ apiKey: props.alchemyKey }))
  if (props.testnets ?? false) {
    const customChains = props.customTestChains ?? []
    nets = [chain.goerli, chain.polygonMumbai, ...customChains]
  }
  const { chains, provider } = configureChains(
    nets,
    providers
  )

  const connectors = connectorsForWallets([
    {
      groupName: 'Recommended',
      wallets: [
        metaMaskWallet({ chains }),
        // coinbaseWallet({ appName: props.appInfo?.appName ?? '', chains }),
        braveWallet({ chains }),
        rainbowWallet({ chains }),
        omniWallet({ chains }),
        argentWallet({ chains }),
        injectedWallet({ chains })
      ]
    }
  ])

  const wagmiClient = createClient({
    autoConnect: true,
    connectors,
    provider
  })

  const theme = lightTheme({
    accentColor: 'var(--as-light)',
    accentColorForeground: 'var(--as-dark)'
  })
  theme.colors.connectButtonBackground = 'var(--as-light)'
  theme.colors.connectButtonText = 'var(--as-dark)'
  theme.colors.modalBackground = 'var(--as-light)'
  theme.colors.modalText = 'var(--as-dark)'
  theme.colors.modalTextDim = 'var(--as-dark-dim)'
  theme.colors.modalTextSecondary = 'var(--as-dark)'
  theme.colors.closeButtonBackground = 'var(--as-light)'
  theme.colors.closeButton = 'var(--as-danger)'
  theme.colors.menuItemBackground = 'var(--as-primary)'
  theme.colors.actionButtonSecondaryBackground = 'var(--as-primary)'
  theme.colors.profileAction = 'var(--as-light)'
  theme.colors.profileActionHover = 'var(--as-primary)'
  theme.shadows = {
    connectButton: (props.shadow ?? false) ? '0px 4px 12px var(--as-dark-dim)' : '0px 0px 0px #00000000',
    dialog: '0px 8px 32px var(--as-dark-dim)',
    profileDetailsAction: '0px 2px 6px var(--as-dark-dim)',
    selectedOption: '0px 2px 6px var(--as-dark-dim)',
    selectedWallet: '0px 2px 6px var(--as-dark-dim)',
    walletLogo: '0px 2px 16px var(--as-dark-dim)'
  }
  theme.radii = {
    actionButton: '1rem',
    connectButton: '1rem',
    menuButton: '1rem',
    modal: '1rem',
    modalMobile: '1rem'
  }

  return (
    <WagmiConfig client={wagmiClient}>
      <RainbowKitProvider chains={chains} theme={(props.noTheme ?? false) ? undefined : theme} appInfo={props.appInfo}>
        {props.children}
      </RainbowKitProvider>
    </WagmiConfig>
  )
}

export function Wallet () {
  return (
    <ConnectButton showBalance={false}
      chainStatus={{ smallScreen: 'icon', largeScreen: 'full' }}
      accountStatus={{ smallScreen: 'avatar', largeScreen: 'full' }} />
  )
}
