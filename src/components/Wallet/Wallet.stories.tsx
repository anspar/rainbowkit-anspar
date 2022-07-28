import React from 'react';

import { ComponentStory, ComponentMeta } from '@storybook/react';

import { Wallet } from './Wallet';

import { ThemeSwitch } from '@anspar/anspar-theme';

export default {
  title: 'ANS/Wallet',
  component: Wallet,
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
