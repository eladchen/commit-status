// {src,test}/**/*.ts
// https://github.com/okonet/lint-staged
module.exports = {
  "*.{ts,js}": ["npm run lint", "npm run test -- --bail --findRelatedTests"],
};
