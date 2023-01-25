import { ComponentMeta, ComponentStory } from '@storybook/react'

import {
  ProposalStatus,
  ProposalStatusMap,
} from '@dao-dao/stateful/proposal-module-adapter/adapters/DaoProposalSingle/components/ProposalLine/ProposalStatus'
import { formatDate, secondsToWdhms } from '@dao-dao/utils'

import { LinkWrapper } from '../LinkWrapper'
import { ProposalLine, ProposalLineProps } from './ProposalLine'
import {
  ProposalWalletVote,
  ProposalWalletVoteProps,
} from './ProposalWalletVote'
import * as ProposalWalletVoteStories from './ProposalWalletVote.stories'

export default {
  title:
    'DAO DAO / packages / stateless / components / proposal / ProposalLine',
  component: ProposalLine,
  // Don't export helper function `makeProps`.
  excludeStories: ['makeProps'],
} as ComponentMeta<typeof ProposalLine>

const Template: ComponentStory<typeof ProposalLine> = (args) => (
  <ProposalLine {...args} />
)

export const makeProps = (
  // 3 days.
  secondsFromNow = 3 * 24 * 60 * 60,
  status: `${keyof typeof ProposalStatusMap}` = 'open',
  vote: Omit<keyof typeof ProposalWalletVoteStories, 'default'> = 'Pending'
): ProposalLineProps => ({
  href: '#',
  proposalPrefix: 'A',
  proposalNumber: Math.floor(Math.random() * 100),
  title:
    "Give everyone 1 million dollars, which is a lot of money, but how much though? Let's find out.",
  timestampDisplay: {
    label: '',
    tooltip: 'Tooltip',
    content:
      status === 'open'
        ? secondsToWdhms(secondsFromNow, 1) + ' left'
        : formatDate(new Date(Date.now() - secondsFromNow * 1000)),
  },
  Status: ({ dimmed }) => (
    <ProposalStatus
      dimmed={dimmed}
      status={status as keyof typeof ProposalStatusMap}
    />
  ),
  vote: (
    <ProposalWalletVote
      {...(ProposalWalletVoteStories[
        vote as keyof typeof ProposalWalletVoteStories
      ].args as ProposalWalletVoteProps)}
    />
  ),
  votingOpen: status === 'open',
  LinkWrapper,
})

export const Default = Template.bind({})
Default.args = makeProps()
Default.parameters = {
  design: {
    type: 'figma',
    url: 'https://www.figma.com/file/ZnQ4SMv8UUgKDZsR5YjVGH/DAO-DAO-2.0?node-id=312%3A27923',
  },
}
