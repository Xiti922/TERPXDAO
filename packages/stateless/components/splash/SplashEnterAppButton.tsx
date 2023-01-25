import { ArrowOutwardRounded } from '@mui/icons-material'
import { useTranslation } from 'react-i18next'

import { ButtonLink } from '../buttons/ButtonLink'

export interface SplashEnterAppButtonProps {
  small?: boolean
}

export const SplashEnterAppButton = ({ small }: SplashEnterAppButtonProps) => {
  const { t } = useTranslation()

  return (
    <ButtonLink href="/home" size={small ? 'sm' : 'lg'}>
      {t('splash.cta')}
      <ArrowOutwardRounded className="!h-4 !w-4" />
    </ButtonLink>
  )
}
