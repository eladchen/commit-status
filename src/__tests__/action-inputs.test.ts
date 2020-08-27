import * as github from "@actions/github";
import { Context } from "@actions/github/lib/context";

import { withInputs } from "./test-utils";
import * as actionInputs from "../action-inputs";

const createEventInput = (repositoryOwner, repositoryName, commitSHA) => ({
  repository: {
    name: repositoryName,
    owner: {
      login: repositoryOwner,
    },
  },
  pull_request: {
    head: {
      sha: commitSHA,
    },
  },
});

const withPayload = (payload, cb) => {
  const ctx = github.context;
  const context = new Context();

  context.payload = payload;

  // @ts-expect-error instead of mocking
  // noinspection JSConstantReassignment
  github.context = context;

  let value, error;

  try {
    value = cb();
  } catch (e) {
    error = e;
  }

  // @ts-expect-error instead of mocking
  // noinspection JSConstantReassignment
  github.context = ctx;

  if (error) {
    throw error;
  }

  return value;
};

describe(actionInputs.shaInput, () => {
  test("sha input is required", () => {
    const cb = () => actionInputs.shaInput();

    expect(cb).toThrowError("'sha' input must be a non empty string");
  });

  test("sha input is read from payload", () => {
    const expected = "123";
    const payload = {
      inputs: {
        event: JSON.stringify(createEventInput(null, null, expected)),
      },
    };

    withPayload(payload, () => {
      const actual = actionInputs.shaInput();

      expect(actual).toStrictEqual(expected);
    });
  });

  test("sha input is read from action sha input", async () => {
    const expected = "input";
    const inputs = { sha: expected };

    await withInputs(inputs, async () => {
      const actual = actionInputs.shaInput();

      expect(actual).toStrictEqual(expected);
    });
  });
});

describe(actionInputs.repoInput, () => {
  test("repo input is required", () => {
    const cb = () => actionInputs.repoInput();

    expect(cb).toThrowError("'repo' input must be a non empty string");
  });

  test("repo input is read from payload", () => {
    const expected = "testing";
    const payload = {
      inputs: {
        event: JSON.stringify(createEventInput(null, expected, null)),
      },
    };

    withPayload(payload, () => {
      const actual = actionInputs.repoInput();

      expect(actual).toStrictEqual(expected);
    });
  });

  test("repo input is read from action sha input", async () => {
    const expected = "input";
    const inputs = { repo: expected };

    await withInputs(inputs, async () => {
      const actual = actionInputs.repoInput();

      expect(actual).toStrictEqual(expected);
    });
  });
});

describe(actionInputs.ownerInput, () => {
  test("owner input is required", () => {
    const cb = () => actionInputs.ownerInput();

    expect(cb).toThrowError("'owner' input must be a non empty string");
  });

  test("owner input is read from payload", () => {
    const expected = "elad";
    const payload = {
      inputs: {
        event: JSON.stringify(createEventInput(expected, null, null)),
      },
    };

    withPayload(payload, () => {
      const actual = actionInputs.ownerInput();

      expect(actual).toStrictEqual(expected);
    });
  });

  test("owner input is read from action sha input", async () => {
    const expected = "input";
    const inputs = { owner: expected };

    await withInputs(inputs, async () => {
      const actual = actionInputs.ownerInput();

      expect(actual).toStrictEqual(expected);
    });
  });
});

describe(actionInputs.eventInput, () => {
  test("event input is read from payload", () => {
    const expected = createEventInput("elad", "test", "123");
    const payload = {
      inputs: {
        event: JSON.stringify(expected),
      },
    };

    withPayload(payload, () => {
      const actual = actionInputs.eventInput();

      expect(actual).toEqual(expect.objectContaining(expected));
    });
  });

  test("null is returned when there event input is undefined", () => {
    const actual = actionInputs.eventInput();

    expect(actual).toBeNull();
  });
});

describe(actionInputs.updateCommitStatus, () => {
  test("is true", async () => {
    const expected = true;
    const inputs = {
      "update-commit-status": String(expected),
    };

    await withInputs(inputs, () => {
      const actual = actionInputs.updateCommitStatus();

      expect(actual).toStrictEqual(expected);
    });
  });

  test("is false", async () => {
    const expected = false;
    const inputs = {
      "update-commit-status": String(expected),
    };

    await withInputs(inputs, () => {
      const actual = actionInputs.updateCommitStatus();

      expect(actual).toStrictEqual(expected);
    });
  });
});
