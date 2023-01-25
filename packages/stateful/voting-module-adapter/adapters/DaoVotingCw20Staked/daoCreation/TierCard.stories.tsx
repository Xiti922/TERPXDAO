import { ComponentMeta, ComponentStory } from '@storybook/react'
import { useForm } from 'react-hook-form'

import { NewDao } from '@dao-dao/types'

import { makeDefaultNewDao } from '../../../../recoil/atoms'
import { DaoVotingCw20StakedAdapter } from '../../../index'
import { DaoCreationConfig } from '../types'
import { TierCard } from './TierCard'

export default {
  title:
    'DAO DAO / packages / stateful / voting-module-adapter / adapters / DaoVotingCw20Staked / daoCreation / TierCard',
  component: TierCard,
} as ComponentMeta<typeof TierCard>

const Template: ComponentStory<typeof TierCard> = (args) => {
  const {
    control,
    register,
    formState: { errors },
    setValue,
    watch,
  } = useForm<NewDao<DaoCreationConfig>>({
    defaultValues: {
      ...makeDefaultNewDao(),
      votingModuleAdapter: {
        id: DaoVotingCw20StakedAdapter.id,
        data: DaoVotingCw20StakedAdapter.daoCreation!.defaultConfig,
      },
    },
  })

  return (
    <div className="max-w-2xl">
      <TierCard
        {...args}
        control={control}
        data={watch('votingModuleAdapter.data')}
        errors={errors}
        register={register}
        remove={() => alert('remove')}
        setValue={setValue}
        watch={watch}
      />
    </div>
  )
}

export const Default = Template.bind({})
Default.args = {
  tierIndex: 0,
  showColorDotOnMember: true,
}
Default.parameters = {
  design: {
    type: 'figma',
    url: 'https://www.figma.com/file/ZnQ4SMv8UUgKDZsR5YjVGH/Dao-2.0?node-id=782%3A42908',
  },
}
