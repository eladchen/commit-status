import * as core from "@actions/core";

const withInputs = async <T>(inputs: { [name: string]: string }, cb: (...args: any[]) => T): Promise<T> => {
  const spyInstance = jest.spyOn(core, "getInput");

  spyInstance.mockImplementation((name, options): string => {
    const value = inputs[name];

    if (value === undefined && options?.required === true) {
      throw new Error(`input '${name}' is required but not set`);
    }

    return value;
  });

  let error, value;

  try {
    value = await cb();
  } catch (e) {
    error = e;
  }

  spyInstance.mockRestore();

  return error ? Promise.reject(error) : Promise.resolve(value);
};

export { withInputs };
