import Button from '@/Components/Button';
import { Heading, Paragraph } from '@/Components/Typography';

import Card from './Card';

import type { Meta, StoryObj } from '@storybook/react-vite';

const meta = {
  title: 'Components/Card',
  component: Card,
  tags: ['autodocs'],
  argTypes: {
    actionsAlign: {
      control: 'select',
      options: ['left', 'center', 'right'],
    },
  },
} satisfies Meta<typeof Card>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    header: <Heading level="h3">Project settings</Heading>,
    content: <Paragraph>Manage the name, visibility, and members of this project.</Paragraph>,
    actions: (
      <>
        <Button variant="secondary">Cancel</Button>
        <Button variant="primary">Save</Button>
      </>
    ),
  },
};

export const HeaderAndContentOnly: Story = {
  args: {
    header: <Heading level="h3">Project settings</Heading>,
    content: <Paragraph>Manage the name, visibility, and members of this project.</Paragraph>,
  },
};

export const ContentOnly: Story = {
  args: {
    content: <Paragraph>Manage the name, visibility, and members of this project.</Paragraph>,
  },
};

export const LeftAlignedActions: Story = {
  args: {
    content: <Paragraph>Actions aligned to the left of the row.</Paragraph>,
    actions: <Button variant="primary">Save</Button>,
    actionsAlign: 'left',
  },
};

export const CenteredActions: Story = {
  args: {
    content: <Paragraph>Actions centred in the row.</Paragraph>,
    actions: <Button variant="primary">Save</Button>,
    actionsAlign: 'center',
  },
};
