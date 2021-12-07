module.exports = {
  core: {
    builder: 'webpack5'
  },
  stories: [
    '../src/stories/**/*.stories.tsx'
  ],
  addons: [
    '@storybook/addon-links',
    '@storybook/addon-essentials',
    '@storybook/preset-scss',
    '@storybook/builder-webpack5'
  ],
}