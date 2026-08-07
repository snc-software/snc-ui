import { addons } from 'storybook/manager-api';
import { create } from 'storybook/theming/create';

const sncTheme = create({
  base: 'light',

  brandTitle: 'SNC-UI',
  brandUrl: 'https://github.com/snc-software/snc-ui',
  brandImage: './logo.png',
  brandTarget: '_self',

  colorPrimary: '#C2185B',
  colorSecondary: '#C2185B',

  appBg: '#FFFFFF',
  appContentBg: '#FFFFFF',
  appPreviewBg: '#FFFFFF',
  appBorderColor: '#E2E8F0',
  appBorderRadius: 12,
  appHoverBg: '#FCE4EC',

  textColor: '#0F172A',
  textInverseColor: '#FFFFFF',
  textMutedColor: '#475569',

  barTextColor: '#475569',
  barSelectedColor: '#C2185B',
  barHoverColor: '#AD1457',
  barBg: '#FFFFFF',

  inputBg: '#F8FAFC',
  inputBorder: '#E2E8F0',
  inputTextColor: '#0F172A',
  inputBorderRadius: 8,

  fontBase: "'Manrope', sans-serif",
  fontCode: "'JetBrains Mono', monospace",
});

addons.setConfig({
  theme: sncTheme,
});
