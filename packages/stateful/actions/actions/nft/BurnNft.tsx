import { useCallback } from 'react'
import { useFormContext } from 'react-hook-form'
import { constSelector } from 'recoil'

import { FireEmoji, useCachedLoadable } from '@dao-dao/stateless'
import {
  ActionComponent,
  ActionMaker,
  CoreActionKey,
  UseDecodedCosmosMsg,
  UseDefaults,
  UseTransformToCosmos,
} from '@dao-dao/types'
import {
  loadableToLoadingDataWithError,
  makeWasmMessage,
  objectMatchesStructure,
} from '@dao-dao/utils'

import {
  nftCardInfoSelector,
  nftCardInfosSelector,
} from '../../../recoil/selectors/nft'
import { BurnNft, BurnNftData } from '../../components/nft'
import { useActionOptions } from '../../react'

const useDefaults: UseDefaults<BurnNftData> = () => ({
  collection: '',
  tokenId: '',
})

const useTransformToCosmos: UseTransformToCosmos<BurnNftData> = () =>
  useCallback(
    ({ collection, tokenId }: BurnNftData) =>
      makeWasmMessage({
        wasm: {
          execute: {
            contract_addr: collection,
            funds: [],
            msg: {
              burn: {
                token_id: tokenId,
              },
            },
          },
        },
      }),
    []
  )

const useDecodedCosmosMsg: UseDecodedCosmosMsg<BurnNftData> = (
  msg: Record<string, any>
) =>
  objectMatchesStructure(msg, {
    wasm: {
      execute: {
        contract_addr: {},
        funds: {},
        msg: {
          burn: {
            token_id: {},
          },
        },
      },
    },
  })
    ? {
        match: true,
        data: {
          collection: msg.wasm.execute.contract_addr,
          tokenId: msg.wasm.execute.msg.burn.token_id,
        },
      }
    : { match: false }

const Component: ActionComponent = (props) => {
  const { address, chainId } = useActionOptions()
  const { watch } = useFormContext()

  const tokenId = watch(props.fieldNamePrefix + 'tokenId')
  const collection = watch(props.fieldNamePrefix + 'collection')

  const options = loadableToLoadingDataWithError(
    useCachedLoadable(
      props.isCreating
        ? nftCardInfosSelector({
            coreAddress: address,
            chainId,
          })
        : constSelector([])
    )
  )
  const nftInfoLoadable = useCachedLoadable(
    !!tokenId && !!collection
      ? nftCardInfoSelector({ chainId, collection, tokenId })
      : constSelector(undefined)
  )

  return (
    <BurnNft
      {...props}
      options={{
        options,
        nftInfo: loadableToLoadingDataWithError(nftInfoLoadable),
      }}
    />
  )
}

export const makeBurnNftAction: ActionMaker<BurnNftData> = ({ t }) => ({
  key: CoreActionKey.BurnNft,
  Icon: FireEmoji,
  label: t('title.burnNft'),
  description: t('info.burnNftDescription'),
  Component,
  useDefaults,
  useTransformToCosmos,
  useDecodedCosmosMsg,
})
