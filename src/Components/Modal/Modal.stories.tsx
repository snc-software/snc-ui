import { useState } from 'react';

import Button from '@/Components/Button';

import Modal from './Modal';

import type { Meta, StoryObj } from '@storybook/react-vite';

const meta = {
  title: 'Components/Modal',
  component: Modal,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Fully controlled — the consumer renders its own trigger and flips `isOpen` on `onClose`. ' +
          'The card has no fixed heading prop, so it has no fixed accessible name either: pass ' +
          '`aria-label` (or `aria-labelledby` pointing at a heading rendered in `children`) so the ' +
          'dialog has one. The card itself is never a scroll container — if `children` can exceed ' +
          'the available height, give that content its own `max-h`/`overflow-y-auto` (see ' +
          '`LargeContent`).',
      },
    },
  },
  argTypes: {
    shouldCloseOnOverlayClick: { control: 'boolean' },
    closeLabel: { control: 'text' },
  },
  args: {
    isOpen: false,
    onClose: () => {},
  },
} satisfies Meta<typeof Modal>;

export default meta;

type Story = StoryObj<typeof meta>;

/**
 * The card sizes itself to its content rather than a fixed component width — compare this to
 * `LargeContent` below.
 */
export const Default: Story = {
  render: (args) => {
    function ControlledModal() {
      const [isOpen, setIsOpen] = useState(false);

      return (
        <>
          <Button onClick={() => setIsOpen(true)}>Open modal</Button>
          <Modal
            {...args}
            isOpen={isOpen}
            onClose={() => setIsOpen(false)}
            aria-labelledby="modal-story-heading"
          >
            <h2 id="modal-story-heading" className="snc:font-snc-heading snc:text-lg snc:font-semibold">
              Delete this item?
            </h2>
            <p className="snc:font-snc-body snc:mt-2 snc:text-sm snc:text-snc-text-secondary">
              This action cannot be undone.
            </p>
            <div className="snc:mt-4 snc:flex snc:justify-end snc:gap-2">
              <Button variant="secondary" onClick={() => setIsOpen(false)}>
                Cancel
              </Button>
              <Button onClick={() => setIsOpen(false)}>Delete</Button>
            </div>
          </Modal>
        </>
      );
    }

    return <ControlledModal />;
  },
};

/**
 * The same component with substantially more content than fits on screen. The card itself never
 * scrolls — it's the consumer's own wrapper around the paragraphs below that carries
 * `max-h`/`overflow-y-auto`, so scrolling is opted into by the content, not imposed by the card.
 */
export const LargeContent: Story = {
  render: (args) => {
    function ControlledModal() {
      const [isOpen, setIsOpen] = useState(false);

      return (
        <>
          <Button onClick={() => setIsOpen(true)}>Open large modal</Button>
          <Modal
            {...args}
            isOpen={isOpen}
            onClose={() => setIsOpen(false)}
            aria-labelledby="modal-story-large-heading"
          >
            <h2
              id="modal-story-large-heading"
              className="snc:font-snc-heading snc:text-lg snc:font-semibold"
            >
              Terms and conditions
            </h2>
            <div className="snc:mt-2 snc:max-h-[60vh] snc:max-w-2xl snc:overflow-y-auto snc:pr-2">
              <div className="snc:font-snc-body snc:text-sm snc:text-snc-text-secondary">
                {Array.from({ length: 12 }, (_, index) => (
                  <p key={index} className="snc:mt-2">
                    Paragraph {index + 1}: fully customisable content — the modal has no opinion on
                    what goes here, only how it is framed.
                  </p>
                ))}
              </div>
            </div>
          </Modal>
        </>
      );
    }

    return <ControlledModal />;
  },
};
