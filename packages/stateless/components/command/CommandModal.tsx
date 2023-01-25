import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'

import { CommandModalProps } from '@dao-dao/types/stateless/CommandModal'

import { SearchBar } from '../inputs/SearchBar'
import { Modal } from '../modals/Modal'
import { ContextPill } from './ContextPill'

export const CommandModal = ({
  visible,
  setVisible,
  filter,
  setFilter,
  contexts,
  closeCurrentContext,
  children,
  searchBarRef,
}: CommandModalProps) => {
  const { t } = useTranslation()

  // Auto focus search bar on open and blur on close.
  useEffect(() => {
    if (visible) {
      searchBarRef.current?.focus()
    } else {
      searchBarRef.current?.blur()
    }
  }, [searchBarRef, visible])

  return (
    <Modal
      containerClassName="!w-[36rem] !max-w-[90vw] !h-[28rem] !max-h-[90vh]"
      contentContainerClassName="p-3 pt-4"
      headerContainerClassName="p-4"
      headerContent={
        <div className="flex h-8 flex-row items-stretch gap-4">
          {/* Don't show the root context. */}
          {contexts.slice(1).map((context, index) => (
            <ContextPill
              key={index}
              imageUrl={context.imageUrl}
              name={context.name}
              // Only the most recent context can go back. Sliced off the first
              // one, so add one to the current index before comparing.
              onClose={
                index + 1 === contexts.length - 1
                  ? closeCurrentContext
                  : undefined
              }
            />
          ))}

          <SearchBar
            className="!primary-text leading-8 text-text-body"
            containerClassName="grow"
            ghost
            hideIcon
            onChange={(event) => setFilter(event.currentTarget.value)}
            onKeyDown={(event) => {
              // Handle in list.
              if (event.key === 'ArrowUp' || event.key === 'ArrowDown') {
                return event.preventDefault()
              } else if (
                (event.key === 'Backspace' && !filter.length) ||
                // If escape and not at root context, go back instead of close
                // modal.
                (event.key === 'Escape' && contexts.length > 1)
              ) {
                event.stopPropagation()
                return closeCurrentContext()
              }
              // If hits Escape and there are no contexts, this event will
              // propagate to the Modal, which will then close itself.
            }}
            placeholder={t('info.whatAreYouLookingForPrompt')}
            ref={searchBarRef}
            value={filter}
          />
        </div>
      }
      hideCloseButton
      onClose={() => setVisible(false)}
      visible={visible}
    >
      {children}
    </Modal>
  )
}
