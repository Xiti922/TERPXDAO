import { useCallback, useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { CommandModal as StatelessCommandModal } from '@dao-dao/stateless'
import {
  CommandModalContext,
  StatefulCommandModalProps,
} from '@dao-dao/types/command'

import { SuspenseLoader } from '../../components/SuspenseLoader'
import { CommandModalContextView } from './CommandModalContextView'

export const CommandModal = ({
  makeRootContext,
  ...props
}: StatefulCommandModalProps) => {
  const { t } = useTranslation()
  const [filter, setFilter] = useState('')
  const searchBarRef = useRef<HTMLInputElement>(null)

  const [contexts, _setContexts] = useState<CommandModalContext[]>([])

  // Keep unique ID (counter) of when context changes so we can tell
  // CommandModalContextView to refresh. Since a context has a useSections hook,
  // and each useSections hook is different, we need to tell the component to
  // re-render as if it's a new component.
  const [contextChangeCount, setContextChangeCount] = useState(0)
  const setContexts: typeof _setContexts = useCallback((...args) => {
    setContextChangeCount((count) => count + 1)
    _setContexts(...args)
    // Focus input when adding new context.
    searchBarRef.current?.focus()
  }, [])

  // Reset with new root context whenever makeRootContext changes. Also
  // initializes first time.
  useEffect(() => {
    setContexts([
      // Initialize with root context.
      makeRootContext({
        t,
        openContext: (newContext: CommandModalContext) => {
          setContexts((currentContexts) => [...currentContexts, newContext])
          // Clear filter when opening new context.
          setFilter('')
        },
      }),
    ])
  }, [makeRootContext, setContexts, t])

  // Clear context and filter when modal becomes visible.
  useEffect(() => {
    if (props.visible) {
      setFilter('')
      setContexts((currentContexts) => currentContexts.slice(0, 1))
    }
  }, [props.visible, setContexts])

  // Remove the last one unless there is only one remaining. Never close the
  // root context.
  const closeCurrentContext = useCallback(
    () =>
      setContexts((currentContexts) =>
        currentContexts.slice(
          0,
          // Never remove the root context.
          Math.max(currentContexts.length - 1, 1)
        )
      ),
    [setContexts]
  )

  return (
    // Don't render Modal on server side, since it portals to document.body.
    <SuspenseLoader fallback={null}>
      <StatelessCommandModal
        closeCurrentContext={closeCurrentContext}
        contexts={contexts}
        filter={filter}
        searchBarRef={searchBarRef}
        setFilter={setFilter}
        {...props}
      >
        <CommandModalContextView
          key={contextChangeCount}
          contexts={contexts}
          filter={filter}
          visible={props.visible}
        />
      </StatelessCommandModal>
    </SuspenseLoader>
  )
}
