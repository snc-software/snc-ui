import type { StorybookConfig } from '@storybook/react-vite';
import type { PluginOption } from 'vite';

const LIBRARY_ONLY_PLUGINS = ['copy-design-tokens', 'unplugin-dts'];

const flattenPlugins = (plugins: PluginOption[]): PluginOption[] =>
  plugins.flatMap((plugin) => (Array.isArray(plugin) ? flattenPlugins(plugin) : [plugin]));

const isLibraryOnlyPlugin = (plugin: PluginOption): boolean =>
  !!plugin &&
  typeof plugin === 'object' &&
  'name' in plugin &&
  LIBRARY_ONLY_PLUGINS.includes(plugin.name);

const config: StorybookConfig = {
  stories: ['../src/**/*.mdx', '../src/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
  addons: ['@storybook/addon-a11y', '@storybook/addon-docs'],
  framework: '@storybook/react-vite',
  staticDirs: ['../public'],
  viteFinal: (config) => ({
    ...config,
    plugins:
      config.plugins &&
      flattenPlugins(config.plugins).filter((plugin) => !isLibraryOnlyPlugin(plugin)),
  }),
};
export default config;
