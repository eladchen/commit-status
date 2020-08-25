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
  test("when action input is provided then action input value is read", async () => {
    const expected = "input";
    const inputs = { sha: expected };

    await withInputs(inputs, async () => {
      const actual = actionInputs.shaInput();

      expect(actual).toStrictEqual(expected);
    });
  });

  test("when action input is falsy then read from payload", async () => {
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

  test("when no value is found then error is thrown", () => {
    const cb = () => actionInputs.shaInput();

    expect(cb).toThrowError("'sha' input must be a non empty string");
  });
});

describe(actionInputs.repoInput, () => {
  test("when action input is provided then action input value is read", async () => {
    const expected = "input";
    const inputs = { repo: expected };

    await withInputs(inputs, async () => {
      const actual = actionInputs.repoInput();

      expect(actual).toStrictEqual(expected);
    });
  });

  test("when action input is falsy then read from payload", async () => {
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

  test("when no value is found then error is thrown", () => {
    const cb = () => actionInputs.repoInput();

    expect(cb).toThrowError("'repo' input must be a non empty string");
  });
});

describe(actionInputs.ownerInput, () => {
  test("when action input is provided then action input value is read", async () => {
    const expected = "input";
    const inputs = { owner: expected };

    await withInputs(inputs, async () => {
      const actual = actionInputs.ownerInput();

      expect(actual).toStrictEqual(expected);
    });
  });

  test("when action input is falsy then read from payload", async () => {
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

  test("when no value is found then error is thrown", () => {
    const cb = () => actionInputs.ownerInput();

    expect(cb).toThrowError("'owner' input must be a non empty string");
  });
});

describe(actionInputs.eventInput, () => {
  test("when workflow 'event' input is defined then object is returned", () => {
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

  test("when workflow 'event' input is undefined then null is returned", () => {
    const actual = actionInputs.eventInput();

    expect(actual).toBeNull();
  });
});

describe(actionInputs.updateCommitStatus, () => {
  test("when action input is 'false' then false is returned", async () => {
    const expected = false;
    const inputs = {
      "update-commit-status": String(expected),
    };

    await withInputs(inputs, () => {
      const actual = actionInputs.updateCommitStatus();

      expect(actual).toStrictEqual(expected);
    });
  });

  test("when action input is any string then true is returned", async () => {
    const expected = true;
    const inputs = {
      "update-commit-status": String(expected),
    };

    await withInputs(inputs, () => {
      const actual = actionInputs.updateCommitStatus();

      expect(actual).toStrictEqual(expected);
    });
  });
});
