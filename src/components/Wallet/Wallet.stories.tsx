import React from 'react';

import { ComponentStory, ComponentMeta } from '@storybook/react';

import { Wallet, WalletContext } from './Wallet';

import { ThemeSwitch } from '@anspar/anspar-theme';

export default {
  title: 'Wallet/WalletContext',
  component: WalletContext,
} as ComponentMeta<typeof WalletContext>;

const Template: ComponentStory<typeof WalletContext> = (args) => {
  return (
    <>
      <ThemeSwitch style={{ width: "30px" }} />
      <WalletContext {...args} >
        <div style={{ display: 'flex', width: '100%', justifyContent: 'center', alignItems: 'center' }}>
          <Wallet />
        </div>
      </WalletContext>
    </>
  )
}

export const Default = Template.bind({});

export const NoTheme = Template.bind({});
NoTheme.args = {
  noTheme: true
}

export const Testnets = Template.bind({});
Testnets.args = {
  testnets: true,
  customTestChains: [{
    id: 1337,
    name: 'Anspar',
    network: 'Anspar',
    nativeCurrency: {
      decimals: 18,
      name: 'Anspar',
      symbol: 'AT',
    },
    rpcUrls: {
      default: 'https://net.anspar.io'
    }
  }]
}
