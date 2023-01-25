import { ComponentMeta, ComponentStory } from '@storybook/react'

import {
  ReactHookFormDecorator,
  makeActionsProviderDecorator,
  makeDaoInfo,
} from '@dao-dao/storybook'
import { ActionOptionsContextType } from '@dao-dao/types'

import { UpdateAdminComponent } from './UpdateAdmin'

export default {
  title: 'DAO DAO / packages / stateful / actions / components / UpdateAdmin',
  component: UpdateAdminComponent,
  decorators: [
    ReactHookFormDecorator,
    makeActionsProviderDecorator({
      address: 'junoWalletAddress',
      chainId: 'juno-1',
      bech32Prefix: 'juno',
      context: {
        type: ActionOptionsContextType.Dao,
        info: makeDaoInfo(),
      },
    }),
  ],
} as ComponentMeta<typeof UpdateAdminComponent>

const Template: ComponentStory<typeof UpdateAdminComponent> = (args) => (
  <UpdateAdminComponent {...args} />
)

export const Default = Template.bind({})
Default.args = {
  fieldNamePrefix: '',
  allActionsWithData: [],
  index: 0,
  data: {},
  isCreating: true,
  onRemove: () => alert('remove'),
  errors: {},
  options: {
    onContractChange: (contract) => alert('onContractChange: ' + contract),
    contractAdmin: 'contractAdmin',
  },
}
