// Store each subDAO creation state separately. Main DAO creation state uses an

import { atom } from 'recoil'

import { WalletTransactionForm } from '@dao-dao/types'

import { localStorageEffectJSON } from '../effects'

// empty string.
export const walletTransactionAtom = atom<WalletTransactionForm>({
  key: 'walletTransaction',
  default: {
    title: '',
    description: '',
    actionData: [],
  },
  effects: [localStorageEffectJSON],
})

// Save signed in wallet so its accessible by selectors.
export const walletAddressAtom = atom<string | undefined>({
  key: 'walletAddress',
  default: undefined,
})
