module.exports = {
  "hooks": {
    "pre-commit": "lint-staged",

    // The hook below will run only when TTY is available.
    "prepare-commit-msg": "exec < /dev/tty && git cz --hook || true"
  }
};
