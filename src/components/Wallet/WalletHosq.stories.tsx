import React from 'react';

import { ComponentStory, ComponentMeta } from '@storybook/react';

import { Wallet, WalletContext } from './Wallet';
import { HosqUploadFiles } from '../Hosq/Hosq';

import { ThemeSwitch } from '@anspar/anspar-theme';

export default {
  title: 'ANS/WalletContext/Hosq',
  component: HosqUploadFiles,
} as ComponentMeta<typeof HosqUploadFiles>;

const Template: ComponentStory<typeof HosqUploadFiles> = (args) => {
  return (
    <>
      <ThemeSwitch />
      <WalletContext testnets>
        <Wallet />
        <div style={{marginTop: "0.5rem", backgroundColor: "var(--as-light)", padding: "1rem"}}>
              <HosqUploadFiles {...args}/>
        </div>
      </WalletContext>
    </>
  )
}


export const UploadFiles = Template.bind({});
export const UploadFilesAcceptOnlyImages = Template.bind({});
UploadFilesAcceptOnlyImages.args={
  accept: {
    "image/*": []
  }
}