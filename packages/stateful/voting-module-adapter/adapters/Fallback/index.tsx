import { useMemo } from 'react'

import { VotingModuleAdapter } from '@dao-dao/types'

import { Placeholder } from './Placeholder'

// Used in case no voting module adapter applies so that it still loads.
export const FallbackAdapter: VotingModuleAdapter = {
  id: 'Fallback',
  // Match all contracts.
  contractNames: [''],

  load: () => ({
    // Hooks
    hooks: {
      useActions: () => useMemo(() => [], []),
      useDaoInfoBarItems: () => [],
      useProfileNewProposalCardAddresses: () => [],
    },

    // Components
    components: {
      ProfileCardMemberInfo: Placeholder,
    },
  }),
}
