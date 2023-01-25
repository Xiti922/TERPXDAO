import { constSelector } from 'recoil'

import { useCachedLoadable } from '@dao-dao/stateless'
import {
  CheckedDepositInfo,
  ContractVersion,
  DepositRefundPolicy,
  LoadingData,
} from '@dao-dao/types'
import { ProposalResponse as ProposalV1Response } from '@dao-dao/types/contracts/CwProposalSingle.v1'
import { DepositInfoResponse as DepositInfoPreProposeResponse } from '@dao-dao/types/contracts/DaoPreProposeSingle'

import { useProposalModuleAdapterOptions } from '../../../react/context'
import { proposalSelector as proposalV1Selector } from '../contracts/CwProposalSingle.v1.recoil'
import { depositInfoSelector as depositInfoV2Selector } from '../contracts/DaoPreProposeSingle.recoil'

export const useLoadingDepositInfo = (): LoadingData<
  CheckedDepositInfo | undefined
> => {
  const {
    proposalModule: { address, version, preProposeAddress },
    proposalNumber,
  } = useProposalModuleAdapterOptions()

  const selectorValue = useCachedLoadable<
    ProposalV1Response | DepositInfoPreProposeResponse | undefined
  >(
    //! V1
    version === ContractVersion.V1
      ? proposalV1Selector({
          contractAddress: address,
          params: [
            {
              proposalId: proposalNumber,
            },
          ],
        })
      : //! V2
      preProposeAddress
      ? depositInfoV2Selector({
          contractAddress: preProposeAddress,
          params: [
            {
              proposalId: proposalNumber,
            },
          ],
        })
      : constSelector(undefined)
  )

  if (selectorValue.state !== 'hasValue') {
    return { loading: true }
  }

  // Type-checked below.
  const proposalResponse = selectorValue.contents as
    | ProposalV1Response
    | undefined
  const depositInfoResponse = selectorValue.contents as
    | DepositInfoPreProposeResponse
    | undefined

  const depositInfo: CheckedDepositInfo | undefined =
    //! V1
    version === ContractVersion.V1 && proposalResponse?.proposal?.deposit_info
      ? {
          amount: proposalResponse.proposal.deposit_info.deposit,
          denom: {
            cw20: proposalResponse.proposal.deposit_info.token,
          },
          refund_policy: proposalResponse.proposal.deposit_info
            .refund_failed_proposals
            ? DepositRefundPolicy.Always
            : DepositRefundPolicy.OnlyPassed,
        }
      : //! V2
        depositInfoResponse?.deposit_info ?? undefined

  return {
    loading: false,
    data: depositInfo,
  }
}
