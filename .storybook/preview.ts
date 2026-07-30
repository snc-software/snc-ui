import { createElement } from 'react';

import type { Decorator, Preview } from '@storybook/react-vite';

import '../src/index.css';

const withColorScheme: Decorator = (Story, context) => {
  const isDark = context.globals.theme === 'dark';

  return createElement(
    'div',
    { className: isDark ? 'dark' : '' },
    createElement(
      'div',
      { className: 'snc:bg-snc-background snc:p-4' },
      createElement(
        'div',
        {
          className:
            'snc:bg-snc-surface snc:border snc:border-snc-border snc:rounded-xl snc:p-6',
        },
        createElement(Story),
      ),
    ),
  );
};

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    a11y: {
      // 'todo' - show a11y violations in the test UI only
      // 'error' - fail CI on a11y violations
      // 'off' - skip a11y checks entirely
      test: 'todo',
    },
  },
  globalTypes: {
    theme: {
      name: 'Theme',
      description: 'Light/dark color scheme',
      toolbar: {
        icon: 'circlehollow',
        items: [
          { value: 'light', icon: 'sun', title: 'Light' },
          { value: 'dark', icon: 'moon', title: 'Dark' },
        ],
        dynamicTitle: true,
      },
    },
  },
  initialGlobals: {
    theme: 'light',
  },
  decorators: [withColorScheme],
};

export default preview;
