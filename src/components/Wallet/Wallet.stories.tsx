import React from 'react';

import { ComponentStory, ComponentMeta } from '@storybook/react';

import { Wallet } from './Wallet';

export default {
  title: 'ANS/Wallet',
  component: Wallet,
} as ComponentMeta<typeof Wallet>;

const Template: ComponentStory<typeof Wallet> = (args) => <Wallet {...args} />;

export const Default = Template.bind({});


export const Testnets = Template.bind({});
Testnets.args = {
  testnets: true
}