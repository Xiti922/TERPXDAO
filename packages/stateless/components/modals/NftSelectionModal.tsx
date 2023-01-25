/* eslint-disable @next/next/no-img-element */
import { Image, WarningRounded } from '@mui/icons-material'
import clsx from 'clsx'
import Fuse from 'fuse.js'
import { ReactNode, useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { LoadingDataWithError, ModalProps, NftCardInfo } from '@dao-dao/types'

import { SortFn, useDropdownSorter, useSearchFilter } from '../../hooks'
import { Button } from '../buttons/Button'
import { Dropdown, DropdownOption, SearchBar } from '../inputs'
import { Loader } from '../logo/Loader'
import { NftCard } from '../NftCard'
import { NoContent } from '../NoContent'
import { Modal } from './Modal'

export interface NftSelectionModalProps<T extends NftCardInfo>
  extends Omit<ModalProps, 'children' | 'header'>,
    Required<Pick<ModalProps, 'header'>> {
  nfts: LoadingDataWithError<T[]>
  selectedIds: string[]
  getIdForNft: (nft: T) => string
  onNftClick: (nft: T) => void
  onSelectAll?: () => void
  onDeselectAll?: () => void
  onAction: () => void
  actionLoading: boolean
  actionLabel: string
  allowSelectingNone?: boolean
  selectedDisplay?: ReactNode
}

export const NftSelectionModal = <T extends NftCardInfo>({
  nfts,
  selectedIds,
  getIdForNft,
  onNftClick,
  onSelectAll,
  onDeselectAll,
  onAction,
  actionLoading,
  actionLabel,
  containerClassName,
  allowSelectingNone,
  selectedDisplay,
  ...modalProps
}: NftSelectionModalProps<T>) => {
  const { t } = useTranslation()

  const showSelectAll =
    (onSelectAll || onDeselectAll) &&
    !nfts.loading &&
    !nfts.errored &&
    nfts.data.length > 2

  // Scroll first selected into view as soon as possible.
  const firstSelectedRef = useRef<HTMLDivElement | null>(null)
  const [scrolledToFirst, setScrolledToFirst] = useState(false)
  useEffect(() => {
    if (
      nfts.loading ||
      scrolledToFirst ||
      !firstSelectedRef.current?.parentElement
    ) {
      return
    }

    setScrolledToFirst(true)

    firstSelectedRef.current.parentElement.scrollTo({
      behavior: 'smooth',
      top:
        // Calculate y position of selected card in scrollable container.
        firstSelectedRef.current.offsetTop -
        firstSelectedRef.current.parentElement.offsetTop -
        // Add some padding on top.
        24,
    })
  }, [nfts, firstSelectedRef, scrolledToFirst])

  const { sortedData: sortedNfts, dropdownProps: sortDropdownProps } =
    useDropdownSorter(
      nfts.loading || nfts.errored ? [] : nfts.data,
      sortOptions
    )

  const { searchBarProps, filteredData } = useSearchFilter(
    sortedNfts,
    FILTERABLE_KEYS
  )

  return (
    <Modal
      {...modalProps}
      containerClassName={clsx(
        'h-[48rem] w-full !max-w-3xl',
        containerClassName
      )}
      contentContainerClassName={
        nfts.errored
          ? 'items-center justify-center gap-4'
          : !nfts.loading && nfts.data.length > 0
          ? 'no-scrollbar grid grid-flow-row auto-rows-max grid-cols-2 gap-4 overflow-y-auto sm:grid-cols-3'
          : undefined
      }
      footerContent={
        <div
          className={clsx(
            'flex flex-row items-center gap-6',
            // If selectedDisplay is null, it will be hidden, so align button at
            // the end.
            selectedDisplay === null ? 'justify-end' : 'justify-between'
          )}
        >
          {selectedDisplay !== undefined ? (
            selectedDisplay
          ) : (
            <p>{t('info.numNftsSelected', { count: selectedIds.length })}</p>
          )}

          <Button
            disabled={!allowSelectingNone && selectedIds.length === 0}
            loading={actionLoading}
            onClick={onAction}
          >
            {actionLabel}
          </Button>
        </div>
      }
      headerContent={
        <div className="mt-4 flex flex-col gap-4">
          <SearchBar
            autoFocus
            placeholder={t('info.searchNftsPlaceholder')}
            {...searchBarProps}
          />

          <div
            className={clsx(
              'flex flex-row items-center gap-12',
              // Push sort dropdown to the right no matter what.
              showSelectAll ? 'justify-between' : 'justify-end'
            )}
          >
            {showSelectAll && (
              <Button
                className="text-text-interactive-active"
                disabled={nfts.loading}
                onClick={
                  nfts.loading
                    ? undefined
                    : nfts.data.length === selectedIds.length
                    ? onDeselectAll
                    : onSelectAll
                }
                variant="underline"
              >
                {!nfts.loading &&
                  (nfts.data.length === selectedIds.length
                    ? t('button.deselectAllNfts', { count: nfts.data.length })
                    : t('button.selectAllNfts', { count: nfts.data.length }))}
              </Button>
            )}

            <div className="flex flex-row items-center justify-between gap-4">
              <p className="primary-text text-text-body">{t('title.sortBy')}</p>

              <Dropdown {...sortDropdownProps} />
            </div>
          </div>
        </div>
      }
    >
      {nfts.loading ? (
        <Loader />
      ) : nfts.errored ? (
        <>
          <WarningRounded className="!h-14 !w-14" />
          <p className="body-text">{t('error.pfpkStargazeReopenModal')}</p>
          <pre className="secondary-text max-w-prose whitespace-pre-wrap text-center text-xs text-text-interactive-error">
            {nfts.error instanceof Error ? nfts.error.message : `${nfts.error}`}
          </pre>
        </>
      ) : nfts.data.length > 0 ? (
        filteredData.map((nft: T) => (
          <NftCard
            key={getIdForNft(nft)}
            ref={
              selectedIds[0] === getIdForNft(nft) ? firstSelectedRef : undefined
            }
            {...nft}
            checkbox={{
              checked: selectedIds.includes(getIdForNft(nft)),
              // Disable toggling if currently staking.
              onClick: () => !actionLoading && onNftClick(nft),
            }}
          />
        ))
      ) : (
        <NoContent
          Icon={Image}
          body={t('info.noNftsYet')}
          className="grow justify-center"
        />
      )}
    </Modal>
  )
}

const sortOptions: DropdownOption<SortFn<Pick<NftCardInfo, 'name'>>>[] = [
  {
    label: 'A → Z',
    value: (a, b) =>
      a.name.toLocaleLowerCase().localeCompare(b.name.toLocaleLowerCase()),
  },
  {
    label: 'Z → A',
    value: (a, b) =>
      b.name.toLocaleLowerCase().localeCompare(a.name.toLocaleLowerCase()),
  },
]

const FILTERABLE_KEYS: Fuse.FuseOptionKey<NftCardInfo>[] = [
  'name',
  'description',
  'collection.address',
]
