import { Add, EscalatorWarning, Upgrade } from '@mui/icons-material'
import { ComponentType } from 'react'
import { useTranslation } from 'react-i18next'

import {
  ContractVersion,
  DaoCardInfo,
  DaoInfo,
  LoadingData,
} from '@dao-dao/types'

import { ButtonLinkProps } from '../../buttons'
import { GridCardContainer } from '../../GridCardContainer'
import { Loader } from '../../logo/Loader'
import { NoContent } from '../../NoContent'

export interface SubDaosTabProps {
  DaoCard: ComponentType<DaoCardInfo>
  subDaos: LoadingData<DaoCardInfo[]>
  isMember: boolean
  daoInfo: DaoInfo
  createSubDaoHref?: string
  upgradeToV2Href?: string
  ButtonLink: ComponentType<ButtonLinkProps>
}

export const SubDaosTab = ({
  DaoCard,
  subDaos: subdaos,
  isMember,
  daoInfo,
  createSubDaoHref,
  upgradeToV2Href,
  ButtonLink,
}: SubDaosTabProps) => {
  const { t } = useTranslation()

  return (
    <>
      <div className="flex flex-row items-center justify-between gap-8 pb-6">
        <div className="flex flex-row flex-wrap items-center gap-x-4 gap-y-1">
          <p className="title-text text-text-body">
            {t('title.createASubDao')}
          </p>
          <p className="secondary-text">{t('info.subDaoExplanation')}</p>
        </div>

        <ButtonLink
          className="shrink-0"
          // Disabled for v1 DAOs, not supported.
          disabled={!isMember || daoInfo.coreVersion === ContractVersion.V1}
          href={`/dao/${daoInfo.coreAddress}/create`}
        >
          <Add className="!h-4 !w-4" />
          {t('button.newSubDao')}
        </ButtonLink>
      </div>

      {daoInfo.coreVersion === ContractVersion.V1 ? (
        <NoContent
          Icon={Upgrade}
          actionNudge={t('info.submitUpgradeProposal')}
          body={t('error.daoFeatureUnsupported', {
            name: daoInfo.name,
            feature: t('title.subDaos'),
          })}
          buttonLabel={t('button.proposeUpgrade')}
          href={isMember ? upgradeToV2Href : undefined}
        />
      ) : subdaos.loading ? (
        <div className="border-t border-border-secondary pt-6">
          <Loader fill={false} />
        </div>
      ) : subdaos.data.length > 0 ? (
        <>
          <p className="title-text mb-6 border-t border-border-secondary pt-6 text-text-body">
            {t('title.numSubDaos', { count: subdaos.data.length })}
          </p>

          <GridCardContainer>
            {subdaos.data.map((props, index) => (
              <DaoCard {...props} key={index} />
            ))}
          </GridCardContainer>
        </>
      ) : (
        <NoContent
          Icon={EscalatorWarning}
          actionNudge={t('info.createFirstOneQuestion')}
          body={t('info.noSubDaosYet')}
          buttonLabel={t('button.newSubDao')}
          href={isMember ? createSubDaoHref : undefined}
        />
      )}
    </>
  )
}
