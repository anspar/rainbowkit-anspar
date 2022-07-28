import React from 'react';

import { ComponentStory, ComponentMeta } from '@storybook/react';

import { Wallet } from './Wallet';
import { HosqUploadFiles } from '../Hosq/Hosq';

import { ThemeSwitch } from '@anspar/anspar-theme';

export default {
  title: 'ANS/Wallet/Hosq',
  component: HosqUploadFiles,
} as ComponentMeta<typeof HosqUploadFiles>;

const Template: ComponentStory<typeof HosqUploadFiles> = (args) => {
  return (
    <>
      <ThemeSwitch />
      <Wallet testnets>
        <div style={{marginTop: "0.5rem", backgroundColor: "var(--as-light)", padding: "1rem"}}>
              <HosqUploadFiles {...args}/>
        </div>
      </Wallet>
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