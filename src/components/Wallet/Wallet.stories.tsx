import React from 'react';

import { ComponentStory, ComponentMeta } from '@storybook/react';

import { Wallet, WalletContext } from './Wallet';

import { ThemeSwitch } from '@anspar/anspar-theme';

export default{
  title: 'ANS/WalletContext',
  component: WalletContext,
} as ComponentMeta<typeof WalletContext>;

const Template: ComponentStory<typeof WalletContext> = (args) => {
  return (
    <>
      <ThemeSwitch style={{width: "30px"}}/>
      <WalletContext {...args} >
        <div style={{display: 'flex', width:'100%', justifyContent: 'center', alignItems:'center'}}>
          <Wallet />
        </div>
      </WalletContext>
    </>
  )
}

export const Default = Template.bind({});

export const Testnets = Template.bind({});
Testnets.args = {
  testnets: true
}


const Template2: ComponentStory<typeof WalletContext> = (args) => {
  return (
    <>
      <ThemeSwitch style={{width: "30px"}}/>
      <WalletContext {...args} >
        <Wallet styles={{position: "absolute", top:"2rem", right: "2rem", width: "fit-content", padding: "0.5rem"}} className="as-bg-light"/>
      </WalletContext>
    </>
  )
}

export const AlignedRight = Template2.bind({});
AlignedRight.args = {
  testnets: true
}
