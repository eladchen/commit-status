import * as core from "@actions/core";

const parametersStateIdentifier = "parameters";

const setParameters = (parameters: Record<string, any>) => {
  core.saveState(parametersStateIdentifier, JSON.stringify(parameters));
};

const getParameters = (): Record<string, any> | null => {
  const parameters = core.getState(parametersStateIdentifier);

  return parameters ? JSON.parse(parameters) : null;
};

export { setParameters, getParameters };
