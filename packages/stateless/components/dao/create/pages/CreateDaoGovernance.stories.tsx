import { ComponentMeta, ComponentStory } from '@storybook/react'

import { DaoVotingCw20StakedAdapter } from '@dao-dao/stateful/voting-module-adapter/adapters/DaoVotingCw20Staked'
import {
  WalletProviderDecorator,
  makeAppLayoutDecorator,
  makeCreateDaoFormDecorator,
} from '@dao-dao/storybook/decorators'

import { CreateDaoGovernance } from './CreateDaoGovernance'

export default {
  title:
    'DAO DAO / packages / stateless / components / dao / create / pages / CreateDaoGovernance',
  component: CreateDaoGovernance,
  decorators: [
    // Direct ancestor of rendered story.
    makeCreateDaoFormDecorator(1, {
      name: 'Evil Cow DAO',
      description: "There are evil cows all over the place. Let's milk 'em!",
      imageUrl:
        'https://ipfs.stargaze.zone/ipfs/QmbGvE3wmxex8KiBbbvMjR8f9adR28s3XkiZSTuGmHoMHV/33.jpg',
      votingModuleAdapter: {
        id: DaoVotingCw20StakedAdapter.id,
        data: DaoVotingCw20StakedAdapter.daoCreation!.defaultConfig,
      },
    }),
    makeAppLayoutDecorator(),
    WalletProviderDecorator,
  ],
} as ComponentMeta<typeof CreateDaoGovernance>

// makeCreateDaoFormDecorator renders the page based on the initialIndex set to
// `1` in the decorators above.
const Template: ComponentStory<typeof CreateDaoGovernance> = (_args) => <></>

export const Default = Template.bind({})
Default.parameters = {
  design: {
    type: 'figma',
    url: 'https://www.figma.com/file/ZnQ4SMv8UUgKDZsR5YjVGH/Dao-2.0?node-id=779%3A39683',
  },
}
