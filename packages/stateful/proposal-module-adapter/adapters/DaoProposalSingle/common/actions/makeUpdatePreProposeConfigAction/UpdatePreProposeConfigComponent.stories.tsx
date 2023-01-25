import { ComponentMeta, ComponentStory } from '@storybook/react'

import {
  DaoPageWrapperDecorator,
  makeReactHookFormDecorator,
} from '@dao-dao/storybook/decorators'
import { DepositRefundPolicy } from '@dao-dao/types'

import {
  UpdatePreProposeConfigComponent,
  UpdatePreProposeConfigData,
} from './UpdatePreProposeConfigComponent'

export default {
  title:
    'DAO DAO / packages / stateful / proposal-module-adapter / adapters / DaoProposalSingle / common / actions / makeUpdatePreProposeConfigAction / UpdatePreProposeConfigComponent',
  component: UpdatePreProposeConfigComponent,
  decorators: [
    makeReactHookFormDecorator<UpdatePreProposeConfigData>({
      depositRequired: true,
      depositInfo: {
        amount: Math.pow(10, 6),
        type: 'native',
        cw20Address: '',
        cw20Decimals: 6,
        refundPolicy: DepositRefundPolicy.OnlyPassed,
      },
    }),
    DaoPageWrapperDecorator,
  ],
} as ComponentMeta<typeof UpdatePreProposeConfigComponent>

const Template: ComponentStory<typeof UpdatePreProposeConfigComponent> = (
  args
) => <UpdatePreProposeConfigComponent {...args} />

export const Default = Template.bind({})
Default.args = {
  fieldNamePrefix: '',
  allActionsWithData: [],
  index: 0,
  data: {},
  isCreating: true,
  options: {
    cw20: {
      governanceTokenSymbol: 'GOV',
      formattedJsonDisplayProps: {
        jsonLoadable: {
          state: 'loading',
        },
      } as any,
    },
  },
}
