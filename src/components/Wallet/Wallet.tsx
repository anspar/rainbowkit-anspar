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
  configureChains,
  createClient,
  WagmiConfig
} from 'wagmi'
import { mainnet, polygon, goerli, polygonMumbai, Chain } from 'wagmi/chains'
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
  let nets = [mainnet, polygon]
  const providers = [publicProvider()]
  if ((props.alchemyKey ?? '').length > 0) providers.push(alchemyProvider({ apiKey: (props.alchemyKey ?? '') }))
  if (props.testnets ?? false) {
    const customChains = props.customTestChains ?? []
    nets = [goerli, polygonMumbai, ...customChains]
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
    accentColor: 'var(--as-secondary)', // btn-bg, recent ...
    accentColorForeground: 'var(--as-common)' // text
  })
  theme.colors.connectButtonBackground = 'var(--as-secondary)'
  theme.colors.connectButtonText = 'var(--as-common)'
  theme.colors.modalBackground = 'var(--as-common)'
  theme.colors.modalText = 'var(--as-highlight)'
  theme.colors.modalTextDim = 'var(--as-primary-dim)'
  theme.colors.modalTextSecondary = 'var(--as-secondary)'
  theme.colors.closeButtonBackground = 'var(--as-secondary)'
  theme.colors.closeButton = 'var(--as-common)'
  theme.colors.menuItemBackground = 'var(--as-primary)'
  theme.colors.actionButtonSecondaryBackground = 'var(--as-primary)'
  theme.colors.profileAction = 'var(--as-common)'
  theme.colors.profileActionHover = 'var(--as-primary)'
  theme.shadows = {
    connectButton: (props.shadow ?? false) ? '0px 4px 12px var(--as-np-out-dark)' : '0px 0px 0px #00000000',
    dialog: '0px 8px 32px var(--as-secondary-dim)',
    profileDetailsAction: '0px 2px 6px var(--as-np-out-dark)',
    selectedOption: '0px 2px 6px var(--as-np-out-dark)',
    selectedWallet: '0px 2px 6px var(--as-np-out-dark)',
    walletLogo: '0px 2px 16px var(--as-np-out-dark)'
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
