import { useMemo } from 'react'

import { VotingModuleAdapter } from '@dao-dao/types'

import { ProfileCardMemberInfo } from './components'
import {
  useDaoInfoBarItems,
  useGovernanceTokenInfo,
  useStakingInfo,
} from './hooks'

export const DaoVotingNativeStakedAdapter: VotingModuleAdapter = {
  id: 'DaoVotingNativeStaked',
  contractNames: [
    // V1
    'cw-native-staked-balance-voting',
    // V2
    'cwd-voting-native-staked',
    'dao-voting-native-staked',
  ],

  load: () => ({
    // Hooks
    hooks: {
      useActions: () => useMemo(() => [], []),
      useDaoInfoBarItems,
      useProfileNewProposalCardAddresses: () => [],
      useGovernanceTokenInfo,
      useStakingInfo,
    },

    // Components
    components: {
      ProfileCardMemberInfo,
    },
  }),
}
