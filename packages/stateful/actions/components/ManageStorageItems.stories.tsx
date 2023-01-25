import { ComponentMeta, ComponentStory } from '@storybook/react'

import { makeReactHookFormDecorator } from '@dao-dao/storybook/decorators'

import {
  ManageStorageItemsComponent,
  ManageStorageItemsData,
} from './ManageStorageItems'

export default {
  title:
    'DAO DAO / packages / stateful / actions / components / ManageStorageItems',
  component: ManageStorageItemsComponent,
  decorators: [
    makeReactHookFormDecorator<ManageStorageItemsData>({
      setting: true,
      key: 'color',
      value: '',
    }),
  ],
} as ComponentMeta<typeof ManageStorageItemsComponent>

const Template: ComponentStory<typeof ManageStorageItemsComponent> = (args) => (
  <ManageStorageItemsComponent {...args} />
)

export const Default = Template.bind({})
Default.args = {
  fieldNamePrefix: '',
  allActionsWithData: [],
  index: 0,
  options: {
    existingItems: [['color', 'blue']],
  },
  isCreating: true,
  onRemove: () => alert('remove'),
  errors: {},
}
