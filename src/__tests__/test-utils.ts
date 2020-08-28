import * as core from "@actions/core";
import * as github from "@actions/github";
import { Context } from "@actions/github/lib/context";

const withInputs = async <T>(inputs: { [name: string]: string }, cb: (...args: any[]) => T): Promise<T> => {
  const spyInstance = jest.spyOn(core, "getInput");

  spyInstance.mockImplementation((name, options): string => {
    const value = inputs[name];

    if (value === undefined && options?.required === true) {
      throw new Error(`input '${name}' is required but not set`);
    }

    return value;
  });

  try {
    return await cb();
  } finally {
    spyInstance.mockRestore();
  }
};

const withContext = async <T>(context: Context, cb: () => T): Promise<T> => {
  const c = github.context;

  try {
    // @ts-expect-error replacing context
    github.context = context;

    return await cb();
  } finally {
    // @ts-expect-error restoring context
    github.context = c;
  }
};

export { withInputs, withContext };
