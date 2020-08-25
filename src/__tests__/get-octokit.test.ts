import * as github from "@actions/github";

import { withInputs } from "./test-utils";
import { getOctokit } from "../get-octokit";

describe(getOctokit, () => {
  test("when action token input is not provided then an error is thrown", () => {
    const cb = () => getOctokit();

    expect(cb).toThrowError("Input required and not supplied: token");
  });

  test("when action token input is provided then octokit instance is returned", async () => {
    const expected = "token";
    const octokit = github.getOctokit(expected);
    const inputs = {
      token: expected,
    };
    const fn = await withInputs(inputs, () => {
      const _fn = github.getOctokit;
      const fn = jest.fn(() => octokit);

      // @ts-expect-error testing
      github.getOctokit = fn;

      getOctokit();

      // @ts-expect-error testing
      github.getOctokit = _fn;

      return fn;
    });

    expect(fn).toHaveReturnedWith(octokit);
    expect(fn).toHaveBeenCalledWith(expected);
  });
});
