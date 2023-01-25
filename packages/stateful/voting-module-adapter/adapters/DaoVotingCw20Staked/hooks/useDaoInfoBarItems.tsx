import { LayersOutlined, PeopleAltOutlined } from '@mui/icons-material'
import { useTranslation } from 'react-i18next'

import { DaoInfoBarItem, TokenAmountDisplay } from '@dao-dao/stateless'
import {
  convertMicroDenomToDenomWithDecimals,
  formatPercentOf100,
} from '@dao-dao/utils'

import { useMembership } from '../../../../hooks'
import { useVotingModuleAdapterOptions } from '../../../react/context'
import { useGovernanceTokenInfo } from './useGovernanceTokenInfo'

export const useDaoInfoBarItems = (): DaoInfoBarItem[] => {
  const { t } = useTranslation()
  const { coreAddress } = useVotingModuleAdapterOptions()
  const { totalVotingWeight } = useMembership({
    coreAddress,
  })

  const {
    governanceTokenInfo: { decimals, symbol, total_supply },
  } = useGovernanceTokenInfo()

  return [
    {
      Icon: PeopleAltOutlined,
      label: t('title.totalSupply'),
      value: (
        <TokenAmountDisplay
          amount={convertMicroDenomToDenomWithDecimals(total_supply, decimals)}
          decimals={decimals}
          symbol={symbol}
        />
      ),
    },
    {
      Icon: LayersOutlined,
      label: t('title.totalStaked'),
      value:
        totalVotingWeight === undefined
          ? '...'
          : formatPercentOf100(
              (totalVotingWeight / Number(total_supply)) * 100
            ),
    },
  ]
}
