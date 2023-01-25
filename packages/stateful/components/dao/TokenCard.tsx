import { useRouter } from 'next/router'
import { useCallback, useEffect, useState } from 'react'
import { useSetRecoilState } from 'recoil'

import { refreshNativeTokenStakingInfoAtom } from '@dao-dao/state'
import {
  TokenCard as StatelessTokenCard,
  useCachedLoadable,
  useDaoInfoContext,
} from '@dao-dao/stateless'
import { CoreActionKey } from '@dao-dao/types'
import { TokenCardInfo } from '@dao-dao/types/dao'
import {
  NATIVE_DENOM,
  StakeType,
  loadableToLoadingData,
  useAddToken,
} from '@dao-dao/utils'

import { useCoreActionForKey } from '../../actions'
import { useEncodedDaoProposalSinglePrefill } from '../../hooks'
import { tokenCardLazyInfoSelector } from '../../recoil'
import { ButtonLink } from '../ButtonLink'
import { DaoTokenDepositModal } from './DaoTokenDepositModal'

export const TokenCard = (props: TokenCardInfo) => {
  const router = useRouter()
  const { coreAddress } = useDaoInfoContext()

  const addToken = useAddToken()

  const lazyInfoLoadable = useCachedLoadable(
    tokenCardLazyInfoSelector({
      walletAddress: coreAddress,
      denom: props.tokenDenom,
      tokenDecimals: props.tokenDecimals,
      tokenSymbol: props.tokenSymbol,
    })
  )

  //! Loadable errors.
  useEffect(() => {
    if (lazyInfoLoadable.state === 'hasError') {
      console.error(lazyInfoLoadable.contents)
    }
  }, [lazyInfoLoadable.contents, lazyInfoLoadable.state])

  // Refresh staking info.
  const setRefreshNativeTokenStakingInfo = useSetRecoilState(
    refreshNativeTokenStakingInfoAtom(coreAddress)
  )
  const refreshNativeTokenStakingInfo = useCallback(
    () => setRefreshNativeTokenStakingInfo((id) => id + 1),
    [setRefreshNativeTokenStakingInfo]
  )

  const lazyStakes =
    lazyInfoLoadable.state !== 'hasValue'
      ? []
      : lazyInfoLoadable.contents?.stakingInfo?.stakes ?? []

  const stakesWithRewards = lazyStakes.filter(({ rewards }) => rewards > 0)

  const stakeAction = useCoreActionForKey(CoreActionKey.StakingActions)

  // Prefill URLs only valid if action exists.
  const prefillValid = !!stakeAction
  const encodedProposalPrefillClaim = useEncodedDaoProposalSinglePrefill({
    actions: stakeAction
      ? stakesWithRewards.map(({ validator: { address } }) => ({
          action: stakeAction,
          data: {
            stakeType: StakeType.WithdrawDelegatorReward,
            validator: address,
            // Default values, not needed for displaying this type of message.
            amount: 1,
            denom: props.tokenDenom,
          },
        }))
      : [],
  })
  const encodedProposalPrefillStakeUnstake = useEncodedDaoProposalSinglePrefill(
    {
      // If has unstaked, show stake action by default.
      actions: stakeAction
        ? props.unstakedBalance > 0
          ? [
              {
                action: stakeAction,
                data: {
                  stakeType: StakeType.Delegate,
                  validator: '',
                  amount: props.unstakedBalance,
                  denom: props.tokenDenom,
                },
              },
            ]
          : // If has only staked, show unstake actions by default.
            lazyStakes.map(({ validator, amount }) => ({
              action: stakeAction,
              data: {
                stakeType: StakeType.Undelegate,
                validator,
                amount,
                denom: props.tokenDenom,
              },
            }))
        : [],
    }
  )

  const proposeClaimHref =
    prefillValid &&
    stakesWithRewards.length > 0 &&
    encodedProposalPrefillClaim &&
    props.tokenDenom === NATIVE_DENOM
      ? `/dao/${coreAddress}/proposals/create?prefill=${encodedProposalPrefillClaim}`
      : undefined

  const proposeStakeUnstakeHref =
    prefillValid &&
    (props.unstakedBalance > 0 || lazyStakes.length > 0) &&
    encodedProposalPrefillStakeUnstake &&
    props.tokenDenom === NATIVE_DENOM
      ? `/dao/${coreAddress}/proposals/create?prefill=${encodedProposalPrefillStakeUnstake}`
      : undefined

  const onAddToken =
    addToken && props.cw20Address
      ? () => props.cw20Address && addToken(props.cw20Address)
      : undefined

  const onClaim = proposeClaimHref
    ? () => router.push(proposeClaimHref)
    : undefined

  const [depositVisible, setDepositVisible] = useState(false)
  const showDeposit = useCallback(() => setDepositVisible(true), [])

  return (
    <>
      <StatelessTokenCard
        {...props}
        ButtonLink={ButtonLink}
        lazyInfo={loadableToLoadingData(lazyInfoLoadable, {
          usdcUnitPrice: undefined,
          stakingInfo: undefined,
        })}
        onAddToken={onAddToken}
        onClaim={onClaim}
        proposeClaimHref={proposeClaimHref}
        proposeStakeUnstakeHref={proposeStakeUnstakeHref}
        refreshUnstakingTasks={refreshNativeTokenStakingInfo}
        showDeposit={showDeposit}
      />

      <DaoTokenDepositModal
        onClose={() => setDepositVisible(false)}
        tokenDecimals={props.tokenDecimals}
        tokenDenomOrAddress={props.cw20Address ?? props.tokenDenom}
        tokenImageUrl={props.imageUrl}
        tokenSymbol={props.tokenSymbol}
        tokenType={props.cw20Address ? 'cw20' : 'native'}
        visible={depositVisible}
      />
    </>
  )
}
