// eslint-disable-next-line import/no-default-export
export default (moduleName: string, functionName: string): jest.Mock<any, any[]> => {
  let func = null;

  const fn = jest.fn((...args) => {
    if (func !== null) {
      // @ts-expect-error not really null
      return func(...args);
    }
  });

  jest.mock("../get-workflow-run", () => {
    const m = jest.requireActual("../get-workflow-run");

    func = m[functionName];

    return {
      __esModule: true,
      [functionName]: fn,
    };
  });

  return fn;
};
