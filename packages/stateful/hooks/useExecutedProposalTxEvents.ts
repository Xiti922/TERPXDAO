import { constSelector } from 'recoil'

import { transactionEventsSelector } from '@dao-dao/state/recoil'
import { useCachedLoadable } from '@dao-dao/stateless'

import { useProposalModuleAdapterIfAvailable } from '../proposal-module-adapter'

export const useExecutedProposalTxEventsLoadable = () => {
  // Use proposal execution hash to find instantiated
  // address if already instantiated. If not in a proposal, the proposal module
  // adapter will not be available and so the hook will be undefined.
  const {
    hooks: { useLoadingProposalExecutionTxHash },
  } = useProposalModuleAdapterIfAvailable() ?? { hooks: {} }
  const loadingExecutionTxHash = useLoadingProposalExecutionTxHash?.()

  const txEventsLoadable = useCachedLoadable(
    // If no hook is available, no execution hash to load since we're not in a
    // proposal.
    !loadingExecutionTxHash
      ? constSelector(undefined)
      : // If still loading, make this cached loadable load as well by returning
      // no selector. (See useCachedLoadable for more info.)
      loadingExecutionTxHash.loading
      ? undefined
      : // If no execution hash found, likely due to either the proposal not being executed or an RPC not having the transaction, no TX events to load.
      !loadingExecutionTxHash.data
      ? constSelector(undefined)
      : // Otherwise load the events for the given TX hash.
        transactionEventsSelector({ txHash: loadingExecutionTxHash.data })
  )

  return txEventsLoadable
}
