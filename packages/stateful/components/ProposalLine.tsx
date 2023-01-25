import { ProposalLineLoader } from '@dao-dao/stateless'
import { ProposalModule } from '@dao-dao/types'

import {
  ProposalModuleAdapterProvider,
  useProposalModuleAdapter,
} from '../proposal-module-adapter'
import { LinkWrapper } from './LinkWrapper'
import { SuspenseLoader } from './SuspenseLoader'

export interface ProposalLineProps {
  chainId: string
  coreAddress: string
  proposalModules: ProposalModule[]
  proposalId: string
  proposalViewUrl: string
}

export const ProposalLine = ({
  chainId,
  coreAddress,
  proposalModules,
  proposalId,
  ...props
}: ProposalLineProps) => (
  <ProposalModuleAdapterProvider
    initialOptions={{
      chainId,
      coreAddress,
    }}
    proposalId={proposalId}
    proposalModules={proposalModules}
  >
    <InnerProposalLine {...props} />
  </ProposalModuleAdapterProvider>
)

type InnerProposalLineProps = Pick<ProposalLineProps, 'proposalViewUrl'>

const InnerProposalLine = ({ proposalViewUrl }: InnerProposalLineProps) => {
  const {
    components: { ProposalLine },
  } = useProposalModuleAdapter()

  return (
    <SuspenseLoader fallback={<ProposalLineLoader />}>
      <ProposalLine LinkWrapper={LinkWrapper} href={proposalViewUrl} />
    </SuspenseLoader>
  )
}
