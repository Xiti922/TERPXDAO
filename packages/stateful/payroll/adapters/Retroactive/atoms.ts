import { atomFamily } from 'recoil'

// Increment this to refresh status.
export const refreshStatusAtom = atomFamily<number, { daoAddress: string }>({
  key: 'payrollRetroactiveRefreshStatus',
  default: 0,
})
