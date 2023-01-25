import { Add } from '@mui/icons-material'
import { ComponentType } from 'react'
import { useTranslation } from 'react-i18next'

import { ButtonLinkProps } from '../../buttons'
import { GridCardContainer } from '../../GridCardContainer'

export interface MembersTabProps<D> {
  DaoMemberCard: ComponentType<D>
  members: D[]
  isMember: boolean
  addMemberHref?: string
  ButtonLink: ComponentType<ButtonLinkProps>
}

export const MembersTab = <D extends {}>({
  DaoMemberCard,
  members,
  isMember,
  addMemberHref,
  ButtonLink,
}: MembersTabProps<D>) => {
  const { t } = useTranslation()

  return (
    <>
      {addMemberHref && (
        <div className="mb-6 flex flex-row items-center justify-between gap-8 border-b border-b-border-secondary pb-6">
          <div className="flex flex-row flex-wrap items-center gap-x-4 gap-y-1">
            <p className="title-text text-text-body">{t('title.newMember')}</p>
            <p className="secondary-text">{t('info.newMemberExplanation')}</p>
          </div>

          <ButtonLink
            className="shrink-0"
            disabled={!isMember}
            href={addMemberHref}
          >
            <Add className="!h-4 !w-4" />
            {t('button.addMembers')}
          </ButtonLink>
        </div>
      )}

      <p className="title-text mb-6 text-text-body">
        {t('title.numMembers', { count: members.length })}
      </p>

      {members.length ? (
        <GridCardContainer>
          {members.map((props, index) => (
            <DaoMemberCard {...props} key={index} />
          ))}
        </GridCardContainer>
      ) : (
        <p className="secondary-text">{t('info.noSubDaos')}</p>
      )}
    </>
  )
}
