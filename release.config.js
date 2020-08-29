// https://semantic-release.gitbook.io/semantic-releas
// https://github.com/semantic-release/semantic-release/blob/master/docs/usage/configuration.md#configuration
const plugin = (name, options) => [name, options];

module.exports = {
  plugins: [
    plugin("@semantic-release/commit-analyzer", {
      // https://github.com/conventional-changelog/conventional-changelog/tree/master/packages/conventional-changelog-conventionalcommits
      preset: "conventionalcommits",
      presetConfig: {},
    }),

    "@semantic-release/release-notes-generator",
    "@semantic-release/changelog",

    // https://github.com/semantic-release/git
    plugin("@semantic-release/git", {
      assets: ["package.json", "CHANGELOG.md"],
      // eslint-disable-next-line no-template-curly-in-string
      message: "chore(release): ${nextRelease.version} [skip ci]\n\n${nextRelease.notes}",
    }),

    // https://github.com/semantic-release/github
    plugin("@semantic-release/github", {
      assets: "build",
    }),
  ],
};
