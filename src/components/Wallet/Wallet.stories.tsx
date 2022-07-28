import React from 'react';

import { ComponentStory, ComponentMeta } from '@storybook/react';

import { Wallet } from './Wallet';
import { HosqUploadFiles } from '../Hosq/Hosq';

import { ThemeSwitch } from '@anspar/anspar-theme';

export default {
  title: 'ANS/Wallet',
  component: Wallet,
  parameters:{
    
  }
} as ComponentMeta<typeof Wallet>;

const Template: ComponentStory<typeof Wallet> = (args) => {
  return (
    <>
      <ThemeSwitch />
      <Wallet {...args} />
    </>
  )
}

export const Default = Template.bind({});

export const Testnets = Template.bind({});
Testnets.args = {
  testnets: true
}

export const UploadFiles = Template.bind({});
UploadFiles.args = {
  testnets: true,
  children: <div style={{marginTop: "0.5rem", backgroundColor: "var(--as-light)", padding: "1rem"}}>
              <HosqUploadFiles allowPinning/>
            </div>
}