import { Tag } from '@mui/icons-material'
import clsx from 'clsx'
import { useTranslation } from 'react-i18next'

import { DaoMemberCardProps } from '@dao-dao/types/stateless/DaoMemberCard'
import { formatPercentOf100 } from '@dao-dao/utils'

import { CopyToClipboardUnderline } from '../CopyToClipboard'
import { ProfileImage } from '../profile'

export const DaoMemberCard = ({
  address,
  votingPowerPercent,
  profile,
}: DaoMemberCardProps) => {
  const { t } = useTranslation()

  return (
    <div className="flex flex-col justify-between rounded-md border border-border-primary">
      <div className="flex flex-col items-center px-6 pt-10 pb-8">
        {/* Image */}
        <ProfileImage
          imageUrl={profile.loading ? undefined : profile.data.imageUrl}
          loading={profile.loading}
          size="lg"
        />
        {/* Name */}
        <p
          className={clsx(
            'title-text mt-4 mb-1 text-text-body',
            profile.loading && 'animate-pulse'
          )}
        >
          {profile.loading ? '...' : profile.data.name}
        </p>
        {/* Address */}
        <div className="flex w-full min-w-0 flex-row items-center justify-center gap-1">
          <Tag className="!h-5 !w-5 text-icon-tertiary" />

          <CopyToClipboardUnderline
            className="text-sm !text-text-tertiary"
            takeAll
            value={address}
          />
        </div>
      </div>

      <div className="flex flex-row items-center justify-between gap-4 border-t border-border-interactive-disabled p-4">
        {/* Voting power */}
        <p className="secondary-text">{t('title.votingPower')}</p>
        <p
          className={clsx(
            'symbol-small-body-text font-mono',
            votingPowerPercent.loading && 'animate-pulse'
          )}
        >
          {votingPowerPercent.loading
            ? '...'
            : formatPercentOf100(votingPowerPercent.data)}
        </p>
      </div>
    </div>
  )
}
