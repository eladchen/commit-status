// https://semantic-release.gitbook.io/semantic-releas
// https://github.com/semantic-release/semantic-release/blob/master/docs/usage/configuration.md#configuration
const plugin = (name, options) => [name, options];

module.exports = {
  plugins: [
    // https://github.com/conventional-changelog/conventional-changelog/tree/master/packages/conventional-changelog-conventionalcommits
    plugin("@semantic-release/commit-analyzer", {
      preset: "conventionalcommits",
      presetConfig: {},
    }),

    "@semantic-release/release-notes-generator",
    "@semantic-release/changelog",

    // https://github.com/semantic-release/git
    plugin("@semantic-release/git", {
      assets: ["package.json", "CHANGELOG.md", "build/bundled"],
    }),

    // https://github.com/semantic-release/github
    "@semantic-release/github",
  ],
};
