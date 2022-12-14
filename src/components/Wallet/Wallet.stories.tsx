import React from 'react'

import { ComponentStory, ComponentMeta } from '@storybook/react'

import { Wallet, WalletContext } from './Wallet'

import { ThemeSwitch } from '@anspar/anspar-theme'

// eslint-disable-next-line @typescript-eslint/consistent-type-assertions
export default {
  title: 'Wallet/WalletContext',
  component: WalletContext
} as ComponentMeta<typeof WalletContext>

const Template: ComponentStory<typeof WalletContext> = (args) => {
  return (
    <>
      <ThemeSwitch style={{ width: '30px' }} />
      <WalletContext {...args} >
        <div style={{ display: 'flex', width: '100%', justifyContent: 'center', alignItems: 'center', backgroundColor: 'var(--as-common)', padding: '10px' }}>
          <Wallet />
        </div>
      </WalletContext>
    </>
  )
}

export const Default = Template.bind({})

export const NoTheme = Template.bind({})
NoTheme.args = {
  noTheme: true
}

export const Testnets = Template.bind({})
Testnets.args = {
  testnets: true,
  customTestChains: [{
    id: 1337,
    name: 'Anspar',
    network: 'Anspar',
    nativeCurrency: {
      decimals: 18,
      name: 'Anspar',
      symbol: 'AT'
    },
    rpcUrls: {
      default: {
        http: ['https://net.anspar.io']
      }
    }
  }]
}
