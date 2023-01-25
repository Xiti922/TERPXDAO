import { useDaoInfoContext } from '@dao-dao/stateless'

import { useCfWorkerAuthPostRequest } from '../../../../hooks'
import { API_BASE, SIGNATURE_TYPE } from '../constants'

export const usePostRequest = () =>
  useCfWorkerAuthPostRequest(
    API_BASE,
    SIGNATURE_TYPE,
    useDaoInfoContext().chainId
  ).postRequest
