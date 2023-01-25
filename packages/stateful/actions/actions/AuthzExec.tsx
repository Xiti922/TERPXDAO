import type { MsgWithdrawDelegatorReward } from 'cosmjs-types/cosmos/distribution/v1beta1/tx'
import type {
  MsgBeginRedelegate,
  MsgDelegate,
  MsgUndelegate,
} from 'cosmjs-types/cosmos/staking/v1beta1/tx'
import cloneDeep from 'lodash.clonedeep'
import { useCallback, useMemo } from 'react'

import { validatorsSelector } from '@dao-dao/state/recoil'
import {
  ActionCardLoader,
  LockWithKeyEmoji,
  useCachedLoadable,
} from '@dao-dao/stateless'
import {
  ActionComponent,
  ActionMaker,
  CoreActionKey,
  UseDecodedCosmosMsg,
  UseDefaults,
  UseTransformToCosmos,
} from '@dao-dao/types/actions'
import {
  NATIVE_DENOM,
  decodeRawProtobufMsg,
  encodeRawProtobufMsg,
  isDecodedStargateMsg,
  loadableToLoadingData,
  makeStargateMessage,
} from '@dao-dao/utils'

import { AddressInput, SuspenseLoader } from '../../components'
import { AuthzExecComponent as StatelessAuthzComponent } from '../components'
import { useActionOptions } from '../react'

const TYPE_URL_MSG_EXEC = '/cosmos.authz.v1beta1.MsgExec'

export enum AuthzExecActionTypes {
  Delegate = '/cosmos.staking.v1beta1.MsgDelegate',
  Undelegate = '/cosmos.staking.v1beta1.MsgUndelegate',
  Redelegate = '/cosmos.staking.v1beta1.MsgBeginRedelegate',
  ClaimRewards = '/cosmos.distribution.v1beta1.MsgWithdrawDelegatorReward',
  Custom = 'custom',
}

interface AuthzExecData {
  authzExecActionType: AuthzExecActionTypes
  delegate: MsgDelegate
  undelegate: MsgUndelegate
  redelegate: MsgBeginRedelegate
  claimRewards: MsgWithdrawDelegatorReward
  custom: string
}

const useDefaults: UseDefaults<AuthzExecData> = () => ({
  authzExecActionType: AuthzExecActionTypes.Delegate,
  delegate: {
    amount: { denom: NATIVE_DENOM, amount: '0' },
    delegatorAddress: '',
    validatorAddress: '',
  },
  undelegate: {
    amount: {
      denom: NATIVE_DENOM,
      amount: '0',
    },
    delegatorAddress: '',
    validatorAddress: '',
  },
  redelegate: {
    delegatorAddress: '',
    validatorSrcAddress: '',
    validatorDstAddress: '',
    amount: {
      denom: NATIVE_DENOM,
      amount: '0',
    },
  },
  claimRewards: {
    delegatorAddress: '',
    validatorAddress: '',
  },
  custom: '[]',
})

const Component: ActionComponent = (props) => {
  const { chainId } = useActionOptions()

  const loadingValidators = loadableToLoadingData(
    useCachedLoadable(
      validatorsSelector({
        chainId,
      })
    ),
    []
  )

  return (
    <SuspenseLoader fallback={<ActionCardLoader />}>
      <StatelessAuthzComponent
        {...props}
        options={{
          AddressInput,
          validators: loadingValidators.loading ? [] : loadingValidators.data,
        }}
      />
    </SuspenseLoader>
  )
}

const useDecodedCosmosMsg: UseDecodedCosmosMsg<AuthzExecData> = (
  msg: Record<string, any>
) => {
  const data = useDefaults()

  return useMemo(() => {
    // Check this is a stargate message, and that this is an Authz MsgExec
    // message formatted by this action.
    if (
      !isDecodedStargateMsg(msg) ||
      msg.stargate.typeUrl !== TYPE_URL_MSG_EXEC ||
      msg.stargate.value.msgs?.length !== 1
    ) {
      return { match: false }
    }

    // Decode the message included with Authz MsgExec.
    const decodedExecMsg = decodeRawProtobufMsg(msg.stargate.value.msgs[0])

    // Check that the type_url for default Authz messages, set data accordingly.
    const decodedData = cloneDeep(data)
    switch (decodedExecMsg.typeUrl) {
      case AuthzExecActionTypes.Delegate:
        decodedData.authzExecActionType = AuthzExecActionTypes.Delegate
        decodedData.delegate = decodedExecMsg.value
      case AuthzExecActionTypes.Redelegate:
        decodedData.authzExecActionType = AuthzExecActionTypes.Redelegate
        decodedData.redelegate = decodedExecMsg.value
      case AuthzExecActionTypes.Undelegate:
        decodedData.authzExecActionType = AuthzExecActionTypes.Undelegate
        decodedData.undelegate = decodedExecMsg.value
      case AuthzExecActionTypes.ClaimRewards:
        decodedData.authzExecActionType = AuthzExecActionTypes.ClaimRewards
        decodedData.claimRewards = decodedExecMsg.value
      default:
        decodedData.authzExecActionType = AuthzExecActionTypes.Custom
        decodedData.custom = decodedExecMsg.value
    }

    return {
      match: true,
      data: decodedData,
    }
  }, [msg, data])
}

export const makeAuthzExecAction: ActionMaker<AuthzExecData> = ({
  t,
  address,
}) => {
  const useTransformToCosmos: UseTransformToCosmos<AuthzExecData> = () =>
    useCallback(
      (data: AuthzExecData) =>
        makeStargateMessage({
          stargate: {
            typeUrl: TYPE_URL_MSG_EXEC,
            value: {
              grantee: address,
              msgs:
                data.authzExecActionType === AuthzExecActionTypes.Custom
                  ? JSON.parse(data.custom)
                  : [
                      encodeRawProtobufMsg({
                        typeUrl: data.authzExecActionType,
                        value:
                          data.authzExecActionType ===
                          AuthzExecActionTypes.Delegate
                            ? data.delegate
                            : data.authzExecActionType ===
                              AuthzExecActionTypes.Undelegate
                            ? data.undelegate
                            : data.authzExecActionType ===
                              AuthzExecActionTypes.Redelegate
                            ? data.redelegate
                            : data.authzExecActionType ===
                              AuthzExecActionTypes.ClaimRewards
                            ? data.claimRewards
                            : undefined,
                      }),
                    ],
            },
          },
        }),
      []
    )

  return {
    key: CoreActionKey.AuthzExec,
    Icon: LockWithKeyEmoji,
    label: t('title.authzExec'),
    description: t('info.authzExecDescription'),
    Component,
    useDefaults,
    useTransformToCosmos,
    useDecodedCosmosMsg,
  }
}
