import { ComponentMeta, ComponentStory } from '@storybook/react'

import { ProfileImage } from './ProfileImage'

export default {
  title: 'DAO DAO / packages / stateless / components / profile / ProfileImage',
  component: ProfileImage,
} as ComponentMeta<typeof ProfileImage>

const Template: ComponentStory<typeof ProfileImage> = (args) => (
  <ProfileImage {...args} />
)

export const Default = Template.bind({})
Default.args = {
  size: 'lg',
  imageUrl: '/noah.jpg',
}

Default.parameters = {
  design: {
    type: 'figma',
    url: 'https://www.figma.com/file/ZnQ4SMv8UUgKDZsR5YjVGH/DAO-DAO-2.0?node-id=22%3A6007',
  },
}
